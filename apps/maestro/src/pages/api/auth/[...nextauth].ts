import NextAuth from "next-auth/next";

import { NEXT_AUTH_OPTIONS } from "~/config/next-auth";

export default NextAuth(NEXT_AUTH_OPTIONS);
