import { usePrevious } from "@axelarjs/utils/react";
import { useCallback, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";

import { useAccount, useDisconnect } from "wagmi";

import type { AccountStatus } from "~/services/db/kv";
import { logger } from "../logger";

export type UseRouteProtectionProps = {
  /**
   * The route to redirect to if the user is not logged in.
   *
   * @default "/"
   * */
  redirectTo?: string;
  /**
   * The account statuses that are allowed to access the route.
   *
   * @default ["enabled", "privileged"]
   * */
  accountStatuses?: AccountStatus[];
};

export function useRouteProtection({
  redirectTo = "/",
  accountStatuses = ["enabled", "privileged"],
}: UseRouteProtectionProps) {
  const { address } = useAccount();
  const { disconnectAsync } = useDisconnect();
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();

  const prevAddress = usePrevious(address);

  const handleSignout = useCallback(async () => {
    await signOut({ callbackUrl: "/" });
    await disconnectAsync();
  }, [disconnectAsync]);

  /**
   * redirect rules rules:
   *
   * If the user is not logged in, redirect to the homepage.
   * If the user is logged in but does not have an address, redirect to the homepage.
   * If the user is logged in and has an address, but the address is not in the session, redirect to the homepage.
   */
  useEffect(() => {
    if (sessionStatus === "loading" || !session) return;

    if (
      // sign out if the user is not logged in
      (!address && prevAddress) ||
      // or the session is authenticated but the user has no address
      (sessionStatus === "authenticated" && (!session.address || !address)) ||
      // or the account status is not allowed
      !accountStatuses.includes(session.accountStatus)
    ) {
      handleSignout()
        .then(() => router.push(redirectTo))
        .catch((err) => {
          logger.error(err);
        });
    }
  }, [
    accountStatuses,
    address,
    handleSignout,
    prevAddress,
    redirectTo,
    router,
    session,
    sessionStatus,
  ]);

  return handleSignout;
}
