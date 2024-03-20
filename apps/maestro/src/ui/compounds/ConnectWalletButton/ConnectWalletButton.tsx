import { Button, type ButtonProps } from "@axelarjs/ui";
import { forwardRef } from "react";

import { useWeb3Modal } from "@web3modal/wagmi/react";

type Props = ButtonProps;

const ConnectWalletButton = forwardRef<HTMLButtonElement, Props>(
  (props, ref) => {
    const { open } = useWeb3Modal();

    return (
      <Button
        data-testid="connect-button"
        {...props}
        onClick={open.bind(null, { view: "Connect" })}
        ref={ref}
      />
    );
  },
);

ConnectWalletButton.displayName = "ConnectWalletButton";

ConnectWalletButton.defaultProps = {
  $size: "sm",
  $variant: "primary",
  children: "Connect Wallet",
};

export default ConnectWalletButton;
