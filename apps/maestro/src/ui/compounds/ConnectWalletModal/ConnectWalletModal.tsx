import { Button, Modal, type ButtonProps } from "@axelarjs/ui";
import React, { forwardRef, useRef } from "react";

import type { ISupportedWallet } from "@creit.tech/stellar-wallets-kit";
import { ConnectModal } from "@mysten/dapp-kit";

import { useAuth } from "~/contexts/AuthContext";
import { useStellarKit } from "~/lib/providers/StellarWalletKitProvider";
import ConnectWalletButton from "../ConnectWalletButton/ConnectWalletButton";

import { ConnectButton as XRPLConnectWalletButton } from "@xrpl-wallet-standard/react";
import { getRegisterdXRPLWallets } from "@xrpl-wallet-standard/app";
import { useWallets as useXRPLWallets, useAccount as useXRPLAccount, useConnect as useXRPLConnect, useDisconnect as useXRPLDisconnect } from '@xrpl-wallet-standard/react'

import { ConnectModal as XRPLConnectModal } from "../XRPLWalletList/ConnectModal";

/*export const XRPLWalletButton = ({ $size, $variant }) => {
  const wallets = useXRPLWallets();
  const { connect: connectXRPL } = useXRPLConnect();

  return (
   <div className="flex flex-col gap-y-2">
      {wallets.map((w, i) => (
        <button key={i} onClick={() => connectXRPL(w)} className="w-full" $size={$size} $variant={$variant}>
          <div className="w-fit h-6 bg-blue-600 hover:bg-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-xl flex items-center font-display text-white whitespace-nowrap gap-x-1.5 px-2.5 py-1">
            <Image
              src={w.icon}
              alt=""
              width={16}
              height={16}
            />
            {w.name}
          </div>
        </button>
      ))}
    </div>
  );
};
// use with: <XRPLWalletButton $size={$size} $variant={$variant} />
*/

// the default button:
// <XRPLConnectWalletButton></XRPLConnectWalletButton> 

export function XRPLWallet({ children, className }) {

  const wallets = useXRPLWallets()
  const account = useXRPLAccount()
  const { connect: connectXRPL } = useXRPLConnect()
  const disconnectXRPL = useXRPLDisconnect()

  console.log("Available wallets are:", wallets);

  return (
    <div className="flex flex-col gap-y-2">
      <div>ASDF</div>
      {wallets.map((w, i) => (
        <button key={i} onClick={() => connectXRPL(w)} className="w-full">
          <div className="w-fit h-6 bg-blue-600 hover:bg-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-xl flex items-center font-display text-white whitespace-nowrap gap-x-1.5 px-2.5 py-1">
            <Image
              src={w.icon}
              alt=""
              width={16}
              height={16}
            />
            {w.name}
          </div>
        </button>
      ))}
    </div>)
}
// use with <XRPLWallet></XRPLWallet>

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
    const { signInAsync } = useAuth();

    const handleStellarConnect = async () => {
      if (!kit || isLoading) return;

      try {
        await kit.openModal({
          onWalletSelected: async (option: ISupportedWallet) => {
            kit.setWallet(option.id);
            const { address } = await kit.getAddress();
            await signInAsync(address);
            setIsModalOpen(false);
          },
        });
      } catch (error) {
        console.error("Failed to connect Stellar wallet:", error);
      }
    };

    const printRegisteredWallets = () => {
      console.log(getRegisterdXRPLWallets());
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
          <Button onClick={printRegisteredWallets}>Print XRPL Wallets</Button>
          <XRPLConnectModal
            trigger={
              <Button
                $size={$size}
                $variant={$variant}
                className="w-full"
                aria-label="Open wallet connection modal for XRPL"
              >
                XRPL
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
