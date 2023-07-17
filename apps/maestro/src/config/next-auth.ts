import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { getAddress } from "viem";

export type Web3Session = {
  address: `0x${string}`;
};

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
      },
      authorize: async (credentials, _req) => {
        if (!Boolean(getAddress(credentials?.address!))) {
          return null;
        }
        return {
          id: credentials?.address as `0x${string}`,
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
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/",
    signOut: "/",
    error: "/",
    newUser: "/",
  },
};
