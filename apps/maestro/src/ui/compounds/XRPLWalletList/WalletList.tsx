import Image from "next/image";

import {
  getRegisterdXRPLWallets,
  type XRPLWallet,
} from "@xrpl-wallet-standard/app";
import { useConnect } from "@xrpl-wallet-standard/react";

const styles = {
  walletListContainer: {
    padding: 0,
    margin: 0,
    listStyle: "none",
  },
  walletItem: {
    listStyle: "none",
    display: "flex",
  },
  walletButton: {
    display: "flex",
    width: "100%",
    justifyContent: "stretch" as const,
    alignItems: "center",
    gap: "1rem",
    padding: "1.2rem",
    margin: "0.3rem",
    border: "none",
    background: "transparent",
    cursor: "pointer",
  },
  walletIcon: {
    height: "36px",
    verticalAlign: "middle" as const,
  },
  walletName: {
    verticalAlign: "middle" as const,
  },
};

type Props = {
  onConnectSuccess: () => void;
  onConnectError: (error: Error) => void;
};

export const WalletList = ({ onConnectSuccess, onConnectError }: Props) => {
  const wallets = getRegisterdXRPLWallets();
  const { connect } = useConnect();

  const handleConnect = async (wallet: XRPLWallet) => {
    try {
      await connect(wallet);
      onConnectSuccess();
    } catch (error: any) {
      onConnectError(error);
    }
  };

  return (
    <ul style={styles.walletListContainer}>
      {wallets.map((wallet) => (
        <li key={wallet.name} style={styles.walletItem}>
          <button
            style={styles.walletButton}
            onClick={() => handleConnect(wallet)}
          >
            <Image
              src={wallet.icon}
              alt={wallet.name}
              width={36}
              height={36}
              style={styles.walletIcon}
            />
            <span style={styles.walletName}>{wallet.name}</span>
          </button>
        </li>
      ))}
    </ul>
  );
};
