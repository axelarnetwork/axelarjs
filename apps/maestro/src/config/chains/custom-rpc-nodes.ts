export const CUSTOM_RPC_NODES: Record<
  "mainnet" | "testnet" | "devnet-amplifier",
  Record<string, string[]>
> = {
  mainnet: {
    arbitrum: ["https://arbitrum.drpc.org"], // Arbitrum Mainnet
    aurora: ["https://aurora.drpc.org"], // Aurora Mainnet
    avalanche: ["https://avalanche.drpc.org"], // Avalanche Mainnet
    base: ["https://base.drpc.org"], // Base Mainnet
    binance: ["https://bsc.drpc.org"], // BSC Mainnet
    blast: ["https://blast.drpc.org"], // Blast Mainnet
    celo: ["https://celo.drpc.org"], // Celo Mainnet
    ethereum: ["https://eth.drpc.org"], // Ethereum Mainnet
    fantom: ["https://fantom.drpc.org"], // Fantom Mainnet
    filecoin: ["https://filecoin.drpc.org"], // Filecoin Mainnet
    flow: [
      // No known public DRPC endpoint
    ], // Flow Mainnet
    fraxtal: ["https://fraxtal.drpc.org"], // Fraxtal Mainnet
    immutable: ["https://immutable-zkevm.drpc.org"], // Immutable zkEVM Mainnet
    kava: ["https://kava.drpc.org"], // Kava Mainnet
    linea: ["https://linea.drpc.org"], // Linea Mainnet
    mantle: ["https://mantle.drpc.org"], // Mantle Mainnet
    moonbeam: ["https://moonbeam.drpc.org"], // Moonbeam Mainnet
    optimism: ["https://optimism.drpc.org"], // Optimism Mainnet
    polygon: ["https://polygon.drpc.org"], // Polygon Mainnet
    "polygon-zkevm": ["https://polygon-zkevm.drpc.org"], // Polygon zkEVM Mainnet
    scroll: ["https://scroll.drpc.org"], // Scroll Mainnet
    stellar: [
      // No known public DRPC endpoint
    ], // Stellar Mainnet
    sui: [
      // No known public DRPC endpoint
    ], // Sui Mainnet
  },
  testnet: {
    "arbitrum-sepolia": ["https://arbitrum-sepolia.drpc.org"], // Arbitrum Sepolia
    aurora: ["https://aurora-testnet.drpc.org"], // Aurora Testnet
    avalanche: ["https://avalanche-fuji.drpc.org"], // Avalanche Fuji
    "base-sepolia": ["https://base-sepolia.drpc.org"], // Base Sepolia
    binance: ["https://bsc-testnet.drpc.org"], // BSC Testnet
    "blast-sepolia": ["https://rpc.ankr.com/blast"], // Blast Sepolia
    celo: ["https://celo-alfajores.drpc.org"], // Celo Alfajores
    ethereum: ["https://sepolia.drpc.org"], // Ethereum Sepolia
    "ethereum-sepolia": ["https://sepolia.drpc.org"], // Ethereum Sepolia
    "filecoin-2": [], // Filecoin Calibration
    fantom: [], // No known public DRPC endpoint for Fantom Testnet
    flow: [], // No known public DRPC endpoint for Flow Testnet
    fraxtal: ["https://fraxtal-testnet.drpc.org"], // Fraxtal Testnet
    immutable: [], // Immutable zkEVM Testnet
    kava: ["https://kava-testnet.drpc.org"], // Kava Testnet
    linea: ["https://linea-sepolia.drpc.org"], // Linea Sepolia
    "linea-sepolia": ["https://linea-sepolia.drpc.org"], // Linea Sepolia
    mantle: ["https://mantle-sepolia.drpc.org"], // Mantle Testnet
    moonbeam: ["https://moonbase-alpha.drpc.org"], // Moonbase Alpha
    optimism: ["https://optimism-sepolia.drpc.org"], // Optimism Sepolia
    "optimism-sepolia": ["https://optimism-sepolia.drpc.org"], // Optimism Sepolia
    "polygon-sepolia": ["https://polygon-amoy.drpc.org"], // Polygon Amoy
    "polygon-zkevm": ["https://polygon-zkevm-cardona.drpc.org"], // Polygon zkEVM Testnet
    scroll: [], // No known public DRPC endpoint for Scroll Sepolia
    stellar: [
      // No known public DRPC endpoint
    ], // Stellar Testnet
    sui: [
      // No known public DRPC endpoint
    ], // Sui Testnet
    "xrpl-evm": [
      // No known public DRPC endpoint
    ], // XRPL EVM Testnet
  },
  "devnet-amplifier": {
    "avalanche-fuji": ["https://avalanche-fuji.drpc.org"], // Avalanche Fuji
    "eth-sepolia": ["https://ethereum-sepolia.drpc.org"], // Ethereum Sepolia
    "optimism-sepolia": ["https://optimism-sepolia.drpc.org"], // Optimism Sepolia
    "sui-2": [
      // No known public DRPC endpoint
    ], // Sui Devnet
    "stellar-2025-q1": [
      // No known public DRPC endpoint
    ], // Stellar Devnet
  },
} as const;
