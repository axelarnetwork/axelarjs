import { Button, type ButtonProps } from "@axelarjs/ui";
import { forwardRef } from "react";

import { useWeb3Modal } from "@web3modal/wagmi/react";

type Props = ButtonProps;

const ConnectWalletButton = forwardRef<HTMLButtonElement, Props>(
  (
    {
      $size = "sm",
      $variant = "primary",
      children = "Connect Wallet",
      ...props
    },
    ref
  ) => {
    const { open } = useWeb3Modal();

    return (
      <Button
        data-testid="connect-button"
        {...props}
        onClick={open.bind(null, { view: "Connect" })}
        ref={ref}
        $size={$size}
        $variant={$variant}
      >
        {children}
      </Button>
    );
  }
);

ConnectWalletButton.displayName = "ConnectWalletButton";

export default ConnectWalletButton;
