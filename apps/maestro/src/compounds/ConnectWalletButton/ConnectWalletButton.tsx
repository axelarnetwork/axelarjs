import { forwardRef } from "react";

import { Button, ButtonProps } from "@axelarjs/ui";
import { useWeb3Modal } from "@web3modal/react";

type Props = ButtonProps;

const ConnectWalletButton = forwardRef<HTMLButtonElement, Props>(
  (props, ref) => {
    const { open } = useWeb3Modal();

    return (
      <Button
        {...props}
        onClick={() => open({ route: "ConnectWallet" })}
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
