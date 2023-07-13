import NextAuth from "next-auth/next";

import { nextAuthOptions } from "~/config/next-auth";

export default NextAuth(nextAuthOptions);
