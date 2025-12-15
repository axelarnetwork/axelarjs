import React from "react";

export const WalletProvider = ({
  children,
}: {
  children: React.ReactNode;
  registerWallets?: any;
  autoConnect?: boolean;
}) => <>{children}</>;

export function useAccount(): { address?: string } {
  return { address: undefined };
}

export function useWallet(): { address?: string } {
  return { address: undefined };
}

export function useWallets(): any[] {
  return [];
}

export function useConnect(): { connect: (...args: any[]) => Promise<void> } {
  return {
    connect() {
      return Promise.resolve();
    },
  };
}

export function useDisconnect(): {
  disconnect: (...args: any[]) => Promise<void>;
} {
  return {
    disconnect() {
      return Promise.resolve();
    },
  };
}

export function useSignTransaction(): {
  signTransaction: (...args: any[]) => Promise<any>;
} {
  return {
    signTransaction() {
      return Promise.reject(
        new Error("XRPL signTransaction is not available on the server")
      );
    },
  };
}

export function useSignAndSubmitTransaction(): {
  signAndSubmit: (...args: any[]) => Promise<any>;
} {
  return {
    signAndSubmit() {
      return Promise.reject(
        new Error("XRPL signAndSubmit is not available on the server")
      );
    },
  };
}
