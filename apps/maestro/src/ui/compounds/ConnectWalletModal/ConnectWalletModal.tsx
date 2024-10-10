import { Button, Modal, type ButtonProps } from "@axelarjs/ui";
import React, { forwardRef, useEffect, useState } from "react";

import { ConnectModal } from "@mysten/dapp-kit";

import ConnectWalletButton from "../ConnectWalletButton/ConnectWalletButton";

const ConnectWalletModal = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, ...props }, ref) => {
    const [isMainModalOpen, setIsMainModalOpen] = useState(false);
    // Enable pointer events on body when modal is closed, the library is not handling this properly
    useEffect(() => {
      if (!isMainModalOpen) {
        document.body.style.pointerEvents = "";
      }
    }, [isMainModalOpen]);
    return (
      <Modal
        onOpenChange={setIsMainModalOpen}
        trigger={
          <Button
            $variant="primary"
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
          <ConnectWalletButton $size="md">EVM Chains</ConnectWalletButton>
          <ConnectModal
            trigger={
              <Button
                $variant="primary"
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

ConnectWalletModal.defaultProps = {
  $size: "md",
  $variant: "primary",
  children: "Connect Wallet",
};
export default ConnectWalletModal;
