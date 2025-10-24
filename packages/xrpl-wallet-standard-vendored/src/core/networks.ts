import type { IdentifierString } from '@wallet-standard/core'

export const XRPL_MAINNET = 'xrpl:0' as const
export const XRPL_TESTNET = 'xrpl:1' as const
export const XRPL_DEVNET = 'xrpl:2' as const
export const XAHAU_MAINNET = 'xrpl:21337' as const
export const XAHAU_TESTNET = 'xrpl:21338' as const

export const XRPL_NETWORKS = [XRPL_MAINNET, XRPL_TESTNET, XRPL_DEVNET] as const

export const XAHAU_NETWORKS = [XAHAU_MAINNET, XAHAU_TESTNET] as const

export const XRPL_PROTOCOL_NETWORKS = [...XRPL_NETWORKS, ...XAHAU_NETWORKS] as const

export type XRPLProtorcolNetwork = (typeof XRPL_PROTOCOL_NETWORKS)[number]

export function isXRPLNetworks(network: IdentifierString): network is XRPLProtorcolNetwork {
  return XRPL_PROTOCOL_NETWORKS.includes(network as XRPLProtorcolNetwork)
}

export type XRPLStandardIdentifier = `xrpl:${number}`
export type XRPLReserverdIdentifier =
  | 'xrpl:mainnet'
  | 'xrpl:testnet'
  | 'xrpl:devnet'
  | 'xrpl:xahau-mainnet'
  | 'xrpl:xahau-testnet'

export type XRPLIdentifierString = XRPLStandardIdentifier | XRPLReserverdIdentifier

export function convertNetworkToChainId(network: XRPLIdentifierString): `xrpl:${number}` {
  switch (network) {
    case 'xrpl:mainnet':
      return XRPL_MAINNET
    case 'xrpl:testnet':
      return XRPL_TESTNET
    case 'xrpl:devnet':
      return XRPL_DEVNET
    case 'xrpl:xahau-mainnet':
      return XAHAU_MAINNET
    case 'xrpl:xahau-testnet':
      return XAHAU_TESTNET
  }
  return network
}

export function getNetworkWssEndpoint(network: XRPLIdentifierString): string | undefined {
  const chainId = convertNetworkToChainId(network)
  switch (chainId) {
    case XRPL_MAINNET:
      return 'wss://xrplcluster.com'
    case XRPL_TESTNET:
      return 'wss://s.altnet.rippletest.net:51233/'
    case XRPL_DEVNET:
      return 'wss://s.devnet.rippletest.net:51233/'
    case XAHAU_MAINNET:
      return 'wss://xahau.org'
    case XAHAU_TESTNET:
      return 'wss://xahau-test.net'
    default:
      return undefined
  }
}
