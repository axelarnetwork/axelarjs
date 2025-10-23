export const CUSTOM_RPC_NODES: Record<
  "mainnet" | "testnet" | "devnet-amplifier",
  Record<string, string[]>
> = {
  mainnet: {
    arbitrum: ["https://arb1.lava.build"], // Arbitrum Mainnet (was: https://arbitrum.drpc.org)
    aurora: ["https://aurora.drpc.org"], // Aurora Mainnet
    avalanche: ["https://avalanche-c-chain-rpc.publicnode.com"], // Avalanche Mainnet (was: https://avalanche.drpc.org)
    base: ["https://developer-access-mainnet.base.org"], // Base Mainnet (was: https://base.drpc.org)
    binance: ["https://api.zan.top/bsc-mainnet"], // BSC Mainnet (was: https://bsc.drpc.org)
    blast: ["https://rpc.blast.io"], // Blast Mainnet (was: https://blast.drpc.org)
    celo: ["https://forno.celo.org"], // Celo Mainnet (was: https://celo.drpc.org)
    ethereum: ["https://eth1.lava.build"], // Ethereum Mainnet (was: https://eth.drpc.org)
    fantom: ["https://rpc.fantom.network"], // Fantom Mainnet (was: https://fantom.drpc.org)
    filecoin: ["https://api.chain.love/rpc/v2"], // Filecoin Mainnet (was: https://filecoin.drpc.org)
    flow: [
      // No known public DRPC endpoint
    ], // Flow Mainnet
    fraxtal: ["https://rpc.frax.com"], // Fraxtal Mainnet (was: https://fraxtal.drpc.org)
    hedera: ["https://hedera-mainnet.rpc.axelar.dev"], // Hedera Mainnet
    immutable: ["https://rpc.immutable.com"], // Immutable zkEVM Mainnet (was: https://immutable-zkevm.drpc.org)
    kava: ["https://evm.data.axelar.kava.io"], // Kava Mainnet (was: https://kava.drpc.org)
    linea: ["https://rpc.linea.build"], // Linea Mainnet (was: https://linea.drpc.org)
    mantle: ["https://rpc.mantle.xyz"], // Mantle Mainnet (was: https://mantle.drpc.org)
    moonbeam: ["https://rpc.api.moonbeam.network"], // Moonbeam Mainnet (was: https://moonbeam.drpc.org)
    optimism: ["https://optimism-rpc.publicnode.com"], // Optimism Mainnet (was: https://optimism.drpc.org)
    polygon: ["https://polygon.lava.build"], // Polygon Mainnet (was: https://polygon.drpc.org)
    "polygon-zkevm": ["https://polygon-zkevm.drpc.org"], // Polygon zkEVM Mainnet
    scroll: ["https://rpc.scroll.io"], // Scroll Mainnet (was: https://scroll.drpc.org)
    stellar: [
      // No known public DRPC endpoint
    ], // Stellar Mainnet
    sui: [
      // No known public DRPC endpoint
    ], // Sui Mainnet
  },
  testnet: {
    "arbitrum-sepolia": ["https://sepolia-rollup.arbitrum.io/rpc"], // Arbitrum Sepolia (was: https://arbitrum-sepolia.blockpi.network/v1/rpc/public)
    aurora: ["https://aurora-testnet.drpc.org"], // Aurora Testnet
    avalanche: ["https://api.avax-test.network/ext/bc/C/rpc"], // Avalanche Fuji (was: https://avalanche-fuji.drpc.org)
    "base-sepolia": ["https://base-sepolia-rpc.publicnode.com"], // Base Sepolia (was: https://base-sepolia.blockpi.network/v1/rpc/public)
    binance: ["https://data-seed-prebsc-1-s1.bnbchain.org:8545"], // BSC Testnet (was: https://bsc-testnet.drpc.org)
    "blast-sepolia": ["https://sepolia.blast.io"], // Blast Sepolia (was: https://rpc.ankr.com/blast)
    ethereum: ["https://ethereum-sepolia.publicnode.com"], // Ethereum Sepolia (was: https://sepolia.drpc.org)
    "ethereum-sepolia": ["https://ethereum-sepolia.publicnode.com"], // Ethereum Sepolia (was: https://sepolia.drpc.org)
    "filecoin-2": [], // Filecoin Calibration
    fantom: [], // No known public DRPC endpoint for Fantom Testnet
    flow: [], // No known public DRPC endpoint for Flow Testnet
    fraxtal: ["https://rpc.testnet.frax.com"], // Fraxtal Testnet (was: https://fraxtal-testnet.drpc.org)
    hedera: ["https://hedera-testnet.rpc.axelar.dev"], // Hedera Testnet
    immutable: [], // Immutable zkEVM Testnet
    kava: ["https://evm.testnet.kava.io"], // Kava Testnet (was: https://kava-testnet.drpc.org)
    linea: ["https://rpc.sepolia.linea.build"], // Linea Sepolia (was: https://linea-sepolia.drpc.org)
    "linea-sepolia": ["https://rpc.sepolia.linea.build"], // Linea Sepolia (was: https://linea-sepolia.drpc.org)
    mantle: ["https://rpc.sepolia.mantle.xyz"], // Mantle Testnet (was: https://mantle-sepolia.drpc.org)
    moonbeam: ["https://rpc.api.moonbase.moonbeam.network"], // Moonbase Alpha (was: https://moonbase-alpha.drpc.org)
    optimism: ["https://sepolia.optimism.io"], // Optimism Sepolia (was: https://optimism-sepolia.drpc.org)
    "optimism-sepolia": ["https://sepolia.optimism.io"], // Optimism Sepolia (was: https://optimism-sepolia.drpc.org)
    "polygon-sepolia": ["https://rpc-amoy.polygon.technology"], // Polygon Amoy (was: https://polygon-amoy.drpc.org)
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
    "avalanche-fuji": ["https://api.avax-test.network/ext/bc/C/rpc"], // Avalanche Fuji (was: https://avalanche-fuji.drpc.org)
    "eth-sepolia": ["https://ethereum-sepolia.publicnode.com"], // Ethereum Sepolia (was: https://ethereum-sepolia.drpc.org)
    "optimism-sepolia": ["https://sepolia.optimism.io"], // Optimism Sepolia (was: https://optimism-sepolia.drpc.org)
    "sui-2": [
      // No known public DRPC endpoint
    ], // Sui Devnet
    "stellar-2025-q1": [
      // No known public DRPC endpoint
    ], // Stellar Devnet
  },
} as const;
