/**
 * EIP-6963: Multi Injected Provider Discovery
 *
 * Type definitions based on:
 * - https://eips.ethereum.org/EIPS/eip-6963
 * - https://metamask.io/news/how-to-implement-eip-6963-support-in-your-web3-dapp
 */

/**
 * Represents the assets needed to display a wallet
 */
export interface EIP6963ProviderInfo {
  uuid: string;
  name: string;
  icon: string;
  rdns: string;
}

/**
 * Interface for Ethereum providers based on the EIP-1193 standard.
 */
export interface EIP1193Provider {
  isStatus?: boolean;
  host?: string;
  path?: string;
  sendAsync?: (
    request: { method: string; params?: Array<unknown> },
    callback: (error: Error | null, response: unknown) => void
  ) => void;
  send?: (
    request: { method: string; params?: Array<unknown> },
    callback: (error: Error | null, response: unknown) => void
  ) => void;
  request: (request: {
    method: string;
    params?: Array<unknown>;
  }) => Promise<unknown>;
}

/**
 * Interface detailing the structure of provider information and its Ethereum provider.
 */
export interface EIP6963ProviderDetail {
  info: EIP6963ProviderInfo;
  provider: EIP1193Provider;
}

/**
 * Type representing the event structure for announcing a provider based on EIP-6963.
 */
export type EIP6963AnnounceProviderEvent = CustomEvent<EIP6963ProviderDetail>;

/**
 * Extend the global WindowEventMap to include EIP-6963 events
 */
declare global {
  interface WindowEventMap {
    'eip6963:announceProvider': EIP6963AnnounceProviderEvent;
  }
}
