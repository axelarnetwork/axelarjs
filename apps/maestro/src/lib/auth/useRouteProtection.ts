import { usePrevious } from "@axelarjs/utils/react";
import { useCallback, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";

import { useAccount, useDisconnect } from "wagmi";

export function useRouteProtection({ redirectTo = "/" }) {
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
    if (
      (prevAddress && !address) ||
      (sessionStatus !== "loading" && !address && prevAddress) ||
      (sessionStatus === "authenticated" && (!session.address || !address))
    ) {
      handleSignout();
      router.push(redirectTo);
    }
  }, [
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
