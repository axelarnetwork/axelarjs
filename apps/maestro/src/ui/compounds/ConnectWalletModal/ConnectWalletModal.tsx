import { Button, Modal, type ButtonProps } from "@axelarjs/ui";
import React, { forwardRef } from "react";

import type { ISupportedWallet } from "@creit.tech/stellar-wallets-kit";
import { ConnectModal } from "@mysten/dapp-kit";

import { useWeb3SignIn } from "~/lib/auth";
import { useStellarKit } from "~/lib/providers/StellarWalletKitProvider";
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
    const { kit, isLoading } = useStellarKit();
    const { signInAsync } = useWeb3SignIn();

    const handleStellarConnect = async () => {
      if (!kit || isLoading) return;

      try {
        await kit.openModal({
          onWalletSelected: async (option: ISupportedWallet) => {
            kit.setWallet(option.id);
            const { address } = await kit.getAddress();
            console.log("the address is", address);
            // Explicitly trigger the sign-in process
            await signInAsync(address);
            setIsModalOpen(false);
          },
        });
      } catch (error) {
        console.error("Failed to connect Stellar wallet:", error);
      }
    };
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
                aria-label="Open wallet connection modal for SUI"
              >
                SUI
              </Button>
            }
          />
          <Button
            $size={$size}
            $variant={$variant}
            className="w-full"
            onClick={handleStellarConnect}
            aria-label="Open wallet connection modal for Stellar"
          >
            Stellar
          </Button>
        </Modal.Body>
      </Modal>
    );
  }
);

ConnectWalletModal.displayName = "ConnectWalletButton";

export default ConnectWalletModal;
