import { Maybe } from "@axelarjs/utils";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { verifyPersonalMessageSignature } from "@mysten/sui/verify";
import { kv } from "@vercel/kv";
import { Keypair } from "stellar-sdk";
import { verifyMessage } from "viem";

import db from "~/lib/drizzle/client";
import { getSignInMessage } from "~/server/routers/auth/createSignInMessage";
import MaestroKVClient, { AccountStatus } from "~/services/db/kv";
import MaestroPostgresClient from "~/services/db/postgres/MaestroPostgresClient";

// TODO-XRPL: Restrict to only necessary imports
import * as xrpl from "xrpl"
import * as binary from "ripple-binary-codec"

export type Web3Session = {
  address: string;
  accountStatus: AccountStatus;
};

const kvClient = new MaestroKVClient(kv);
const pgClient = new MaestroPostgresClient(db);

// augments the default session type
declare module "next-auth" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Session extends Web3Session {}
}

export const NEXT_AUTH_OPTIONS: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        address: {
          label: "Address",
          type: "text",
          placeholder: "0x0",
        },
        signature: {
          label: "Signature",
          type: "text",
          placeholder: "0x0",
        },
      },
      async authorize(credentials, req) {
        if (!credentials?.address || !credentials?.signature) {
          return null;
        }
        //TODO: revert
        const address = credentials.address;
        const signature = credentials.signature;
        const [accountNonce, accountStatus] = await Promise.all([
          kvClient.getAccountNonce(address),
          kvClient.getAccountStatus(address),
        ]);

        if (accountNonce === null || accountStatus === "disabled") {
          if (accountStatus === "disabled") {
            const { ip, userAgent } = Maybe.of(req.headers).mapOr(
              { ip: "", userAgent: "" },
              (headers) => ({
                ip: headers["x-real-ip"] ?? headers["x-forwarded-for"],
                userAgent: headers["user-agent"],
              })
            );

            // record unauthorized access attempt event to audit logs
            await pgClient.recordAuditLogEvent({
              kind: "unauthorized_access_attempt",
              payload: {
                ip,
                userAgent,
                accountAddress: address,
              },
            });
          }
          return null;
        }
        let isMessageSigned;
        const message = getSignInMessage(accountNonce ?? 0);
        // is SUI address
        if (address.length === 66) {
          const suiPublicKey = await verifyPersonalMessageSignature(
            new TextEncoder().encode(message),
            signature
          );
          isMessageSigned = suiPublicKey.toSuiAddress() === address;
        }
        // is EVM address
        else if (address.length === 42) {
          isMessageSigned = await verifyMessage({
            message,
            signature: signature as `0x${string}`,
            address: address as `0x${string}`,
          });
        }
        // is Stellar address
        else if (address.length === 56 && address.startsWith("G")) {
          // We'll need to verify the Stellar signature
          try {
            // Convert message to Buffer (note: Freighter signs the base64 encoded message)
            const messageBuffer = Buffer.from(message, "base64");
            // Convert signature from base64 to Buffer
            const signatureBuffer = Buffer.from(signature, "base64");
            // Need to decode the signature again to verify it
            const signatureSecondDecode = Buffer.from(
              signatureBuffer.toString("utf8"),
              "base64"
            );
            const keyPair = Keypair.fromPublicKey(address);
            // Verify the signature
            isMessageSigned = keyPair.verify(
              messageBuffer,
              signatureSecondDecode
            );
          } catch (error) {
            console.error("Failed to verify Stellar signature:", error);
          }
        }
        else if (address.startsWith("r")) {
          // xrpl address

          // Check if the credentials that we received is a transaction that was created just like in the frontend
          // Then, verify the signature against the address
          
          const encodedTx = signature; // this is the signed transaction blob that we received from the client
          const tx = binary.decode(encodedTx); // decode it to get the transaction object

          if (
            !tx.Memos || !Array.isArray(tx.Memos) || tx.Memos.length === 0
          ) {
            console.warn("No memos found in the transaction");
            return null;
          }
          
          const signerPublicKey = tx.SigningPubKey;
          if (typeof signerPublicKey !== "string")
            return null;
          console.warn("Signer public key from transaction:", signerPublicKey);
          if (!tx.Memos[0])
            return null;
          if (typeof tx.Memos[0] !== "object" || !("Memo" in tx.Memos[0]))
            return null;
          const memo = tx.Memos[0].Memo;
          if (memo === null || typeof memo !== "object" || !("MemoData" in memo))
            return null;
          const memoHex = memo.MemoData as string;
          const memoData = Buffer.from(memoHex, "hex").toString("utf8");

          console.warn("Reconstructed memo from transaction:", memoData, message);
          isMessageSigned = 
            (memoData === message) // require that the memo matches the challenge (we don't care about the other data)
            && (xrpl.verifySignature(encodedTx, signerPublicKey)) // AND that the signature is valid
            && (xrpl.deriveAddress(signerPublicKey) === address); // AND that the public key matches the address
          console.log("isMessageSigned:", isMessageSigned);
        }

        if (!isMessageSigned) {
          return null;
        }

        // increment nonce
        await kvClient.incrementAccountNonce(address);

        return {
          id: address,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      const address = token.sub as string;

      session.address = address;
      session.accountStatus = await kvClient
        .getAccountStatus(address)
        .then((x) => x ?? "enabled");

      return session;
    },
    jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
  useSecureCookies: process.env.NODE_ENV === "production",
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/",
    signOut: "/",
    error: "/",
    newUser: "/",
    verifyRequest: "/",
  },
  debug: process.env.NODE_ENV === "development",
};
