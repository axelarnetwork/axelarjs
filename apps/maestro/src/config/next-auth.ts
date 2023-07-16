import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { getAddress } from "viem";

export type Session = {
  address: `0x${string}`;
};

export const nextAuthOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "web3",
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
      // @ts-ignore
      session["address"] = token.sub;
      return session;
    },
  },
  secret: process.env.NEXT_PUBLIC_SECRET,
  pages: {
    signIn: "/",
    signOut: "/",
    error: "/",
    newUser: "/",
  },
};
