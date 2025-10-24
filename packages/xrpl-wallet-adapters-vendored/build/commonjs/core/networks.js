"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XRPL_PROTOCOL_NETWORKS = exports.XAHAU_NETWORKS = exports.XRPL_NETWORKS = exports.XAHAU_TESTNET = exports.XAHAU_MAINNET = exports.XRPL_DEVNET = exports.XRPL_TESTNET = exports.XRPL_MAINNET = void 0;
exports.isXRPLNetworks = isXRPLNetworks;
exports.convertNetworkToChainId = convertNetworkToChainId;
exports.getNetworkWssEndpoint = getNetworkWssEndpoint;
exports.XRPL_MAINNET = 'xrpl:0';
exports.XRPL_TESTNET = 'xrpl:1';
exports.XRPL_DEVNET = 'xrpl:2';
exports.XAHAU_MAINNET = 'xrpl:21337';
exports.XAHAU_TESTNET = 'xrpl:21338';
exports.XRPL_NETWORKS = [exports.XRPL_MAINNET, exports.XRPL_TESTNET, exports.XRPL_DEVNET];
exports.XAHAU_NETWORKS = [exports.XAHAU_MAINNET, exports.XAHAU_TESTNET];
exports.XRPL_PROTOCOL_NETWORKS = [...exports.XRPL_NETWORKS, ...exports.XAHAU_NETWORKS];
function isXRPLNetworks(network) {
    return exports.XRPL_PROTOCOL_NETWORKS.includes(network);
}
function convertNetworkToChainId(network) {
    switch (network) {
        case 'xrpl:mainnet':
            return exports.XRPL_MAINNET;
        case 'xrpl:testnet':
            return exports.XRPL_TESTNET;
        case 'xrpl:devnet':
            return exports.XRPL_DEVNET;
        case 'xrpl:xahau-mainnet':
            return exports.XAHAU_MAINNET;
        case 'xrpl:xahau-testnet':
            return exports.XAHAU_TESTNET;
    }
    return network;
}
function getNetworkWssEndpoint(network) {
    const chainId = convertNetworkToChainId(network);
    switch (chainId) {
        case exports.XRPL_MAINNET:
            return 'wss://xrplcluster.com';
        case exports.XRPL_TESTNET:
            return 'wss://s.altnet.rippletest.net:51233/';
        case exports.XRPL_DEVNET:
            return 'wss://s.devnet.rippletest.net:51233/';
        case exports.XAHAU_MAINNET:
            return 'wss://xahau.org';
        case exports.XAHAU_TESTNET:
            return 'wss://xahau-test.net';
        default:
            return undefined;
    }
}
