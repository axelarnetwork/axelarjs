import { Button, type ButtonProps } from "@axelarjs/ui";
import { forwardRef } from "react";

import { useWeb3Modal } from "@web3modal/react";
import { goerli } from "viem/chains";
import { useConnect } from "wagmi";

import { NEXT_PUBLIC_E2E_ENABLED } from "~/config/env";

type Props = ButtonProps;

const ConnectWalletButton = forwardRef<HTMLButtonElement, Props>(
  (props, ref) => {
    const { open } = useWeb3Modal();
    const { connect } = useConnect();

    const handleConnect = async () => {
      if (NEXT_PUBLIC_E2E_ENABLED) {
        connect({
          chainId: goerli.id,
        });
      } else {
        open();
      }
    };

    return (
      <Button
        data-test-id="connect-button"
        {...props}
        onClick={handleConnect}
        ref={ref}
      />
    );
  }
);

ConnectWalletButton.displayName = "ConnectWalletButton";

ConnectWalletButton.defaultProps = {
  size: "sm",
  color: "primary",
  children: "Connect Wallet",
};

export default ConnectWalletButton;
