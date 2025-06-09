import { createLocalStorageStateManager } from "@axelarjs/utils/react";

export const STELLAR_CONNECTION_CHANGE = "stellar-wallet-connection-change";
const STORAGE_KEY = "stellar-wallet-connected";

export const {
  setState: setStellarConnectionState,
  getState: getStellarConnectionState,
} = createLocalStorageStateManager<boolean>(
  STORAGE_KEY,
  STELLAR_CONNECTION_CHANGE
);
