import { usePrevious } from "@axelarjs/utils/react";
import { useCallback, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";

import { useAccount, useDisconnect } from "wagmi";

export function useProtected() {
  const { address } = useAccount();
  const { disconnectAsync } = useDisconnect();
  const session = useSession();

  const prevAddress = usePrevious(address);

  const handleSignout = useCallback(async () => {
    await signOut({ callbackUrl: "/" });
    await disconnectAsync();
  }, [disconnectAsync]);

  useEffect(() => {
    if (prevAddress && !address) {
      handleSignout();
    }
    if (session.status !== "loading" && !address && prevAddress) {
      handleSignout();
    }
  }, [address, handleSignout, prevAddress, session.status]);

  return handleSignout;
}
