import { Button, Modal, type ButtonProps } from "@axelarjs/ui";
import React, { forwardRef } from "react";

import { ConnectModal } from "@mysten/dapp-kit";

import ConnectWalletButton from "../ConnectWalletButton/ConnectWalletButton";

const ConnectWalletModal = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      $size = "md",
      $variant = "primary",
      children = "Connect Wallet",
      ...props
    },
    ref
  ) => {
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    return (
      <Modal
        open={isModalOpen}
        // reset pointer events, fixes modal closing before child modal interactivity issue
        onOpenChange={(a) => {
          setTimeout(() => (document.body.style.pointerEvents = ""), 1);
          setIsModalOpen(a);
        }}
        trigger={
          <Button
            $variant={$variant}
            {...props}
            ref={ref}
            aria-label="Open wallet connection modal"
          >
            {children}
          </Button>
        }
      >
        <Modal.Title className="flex">
          <span>Select Chain Type</span>
        </Modal.Title>
        <Modal.Body className="flex flex-col gap-4">
          <ConnectWalletButton $size={$size}>EVM Chains</ConnectWalletButton>
          <ConnectModal
            trigger={
              <Button
                $size={$size}
                $variant={$variant}
                className="w-full"
                aria-label="Open wallet connection modal for SUI chains"
              >
                SUI
              </Button>
            }
          />
        </Modal.Body>
      </Modal>
    );
  }
);

ConnectWalletModal.displayName = "ConnectWalletButton";

export default ConnectWalletModal;
