import { Maybe } from "@axelarjs/utils";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { verifyPersonalMessageSignature } from "@mysten/sui/verify";
import { kv } from "@vercel/kv";
import { verifyMessage } from "viem";

import db from "~/lib/drizzle/client";
import { getSignInMessage } from "~/server/routers/auth/createSignInMessage";
import MaestroKVClient, { AccountStatus } from "~/services/db/kv";
import MaestroPostgresClient from "~/services/db/postgres/MaestroPostgresClient";

export type Web3Session = {
  address: `0x${string}`;
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
        if (
          !credentials?.address ||
          // !getAddress(credentials?.address) ||
          !credentials?.signature
        ) {
          return null;
        }
        //TODO: revert
        const address = credentials.address as `0x${string}`;
        const signature = credentials.signature as `0x${string}`;
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
            signature,
            address,
          });
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
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  callbacks: {
    async session({ session, token }) {
      const address = token.sub as `0x${string}`;

      session.address = address;
      session.accountStatus = await kvClient
        .getAccountStatus(address)
        .then((x) => x ?? "enabled");

      return session;
    },
    jwt({ token, user }) {
      if (user) {
        token.sub = user.id as `0x${string}`;
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
