import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { kv } from "@vercel/kv";
import { getAddress, verifyMessage } from "viem";

import { getSignInMessage } from "~/server/routers/auth/createSignInMessage";
import MaestroKVClient from "~/services/kv/MaestroKVClient";

export type Web3Session = {
  address: `0x${string}`;
};

const kvClient = new MaestroKVClient(kv);

// augments the default session type
declare module "next-auth" {
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
      authorize: async (credentials, _req) => {
        if (
          !credentials?.address ||
          !Boolean(getAddress(credentials?.address!)) ||
          !credentials?.signature
        ) {
          return null;
        }

        const address = getAddress(credentials.address);
        const signature = credentials.signature as `0x${string}`;

        const accountNonce = await kvClient.getAccountNonce(address);

        if (accountNonce === null) {
          return null;
        }

        const message = getSignInMessage(accountNonce ?? 0);

        const isMessageSigned = await verifyMessage({
          message,
          signature,
          address,
        });

        if (!isMessageSigned) {
          return null;
        }

        // increment nonce

        await kvClient.incrementAccountNonce(address);

        return {
          id: address as `0x${string}`,
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
      session.address = token.sub as `0x${string}`;
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
