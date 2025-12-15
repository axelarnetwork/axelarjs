import { track } from "@vercel/analytics";

export type DeploymentKind = "canonical" | "interchain" | "custom";

export interface RemoteToken {
  axelarChainId?: string;
  [key: string]: unknown;
}

/**
 * Tracks token deployment/registration events in Vercel Analytics
 * @param kind - The type of token (canonical or interchain)
 * @param action - The action performed (created or registered)
 * @param chain - The chain where the token was created/registered
 * @param isRemote - Whether this is a remote token (default: false)
 */
export function trackTokenEvent(
  kind: "canonical" | "interchain" | "custom",
  action: "created" | "registered",
  chain: string,
  isRemote = false
) {
  const eventType = isRemote
    ? `remote_${kind}_token_created`
    : `${kind}_token_${action}`;

  track(eventType, {
    chain,
  });
}

/**
 * Tracks remote token creation events for multiple chains
 * @param deploymentKind - The type of token deployment (canonical, interchain, or custom)
 * @param remoteTokens - Array of remote tokens with axelarChainId property
 */
export function trackRemoteTokenEvents(
  deploymentKind: DeploymentKind,
  remoteTokens: RemoteToken[]
) {
  remoteTokens.forEach((remoteToken) => {
    if (!remoteToken.axelarChainId) return;

    trackTokenEvent(deploymentKind, "created", remoteToken.axelarChainId, true);
  });
}

/**
 * Tracks token transfer events in Vercel Analytics
 * @param originChain - The chain where the transfer originates
 * @param destinationChain - The destination chain for the transfer
 * @param tokenAddress - The address of the token being transferred
 * @param amount - The amount being transferred (as string)
 */
export function trackTokenTransfer(
  originChain: string,
  destinationChain: string,
  tokenAddress: string,
  amount: string
) {
  track("token_transfer", {
    originChain,
    destinationChain,
    tokenAddress,
    amount,
  });
}
