export const XRPL_MAINNET = 'xrpl:0';
export const XRPL_TESTNET = 'xrpl:1';
export const XRPL_DEVNET = 'xrpl:2';
export const XAHAU_MAINNET = 'xrpl:21337';
export const XAHAU_TESTNET = 'xrpl:21338';
export const XRPL_NETWORKS = [XRPL_MAINNET, XRPL_TESTNET, XRPL_DEVNET];
export const XAHAU_NETWORKS = [XAHAU_MAINNET, XAHAU_TESTNET];
export const XRPL_PROTOCOL_NETWORKS = [...XRPL_NETWORKS, ...XAHAU_NETWORKS];
export function isXRPLNetworks(network) {
    return XRPL_PROTOCOL_NETWORKS.includes(network);
}
export function convertNetworkToChainId(network) {
    switch (network) {
        case 'xrpl:mainnet':
            return XRPL_MAINNET;
        case 'xrpl:testnet':
            return XRPL_TESTNET;
        case 'xrpl:devnet':
            return XRPL_DEVNET;
        case 'xrpl:xahau-mainnet':
            return XAHAU_MAINNET;
        case 'xrpl:xahau-testnet':
            return XAHAU_TESTNET;
    }
    return network;
}
export function getNetworkWssEndpoint(network) {
    const chainId = convertNetworkToChainId(network);
    switch (chainId) {
        case XRPL_MAINNET:
            return 'wss://xrplcluster.com';
        case XRPL_TESTNET:
            return 'wss://s.altnet.rippletest.net:51233/';
        case XRPL_DEVNET:
            return 'wss://s.devnet.rippletest.net:51233/';
        case XAHAU_MAINNET:
            return 'wss://xahau.org';
        case XAHAU_TESTNET:
            return 'wss://xahau-test.net';
        default:
            return undefined;
    }
}
