import { trpc } from "~/lib/trpc";

export function useSession() {
  return trpc.auth.getSession.useQuery();
}
