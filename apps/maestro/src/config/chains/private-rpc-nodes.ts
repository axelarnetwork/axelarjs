export const PRIVATE_RPC_NODES: Record<
  "mainnet" | "testnet",
  Record<string, string[]>
> = {
  mainnet: {
    Ethereum: [
      "https://small-twilight-patina.quiknode.pro/ab22185836b8b42e8413b9832932346e326f35e1/",
    ], // Ethereum Mainnet
    flow: [
      "https://muddy-delicate-pool.flow-mainnet.quiknode.pro/7c83477d4a68b7ff3b31060a11dd041f2228e983/",
    ], // Flow Mainnet
    Moonbeam: [
      "https://moonbeam.blastapi.io/2cc01d78-1fbe-4cba-9032-31b85adfdba1",
    ], // Moonbeam Mainnet
    Fantom: [
      "https://solitary-serene-valley.fantom.quiknode.pro/0343e84a49e018d96704b81c86b416784f95eab8/",
    ], // Fantom Mainnet
    immutable: [
      "https://maximum-cosmopolitan-scion.imx-mainnet.quiknode.pro/b45fc6ae8e637e77c915032377bfd728d7b83556/",
    ], // Immutable zkEVM Mainnet
    Avalanche: [
      "https://yolo-damp-research.avalanche-mainnet.quiknode.pro/48cca0c95e158baa6827e4bfd7284eb908729180/ext/bc/C/rpc/",
    ], // Avalanche Mainnet
    Polygon: [
      "https://old-divine-bush.matic.quiknode.pro/4170c7cd0658b74eb7f1fdd48b348ebf555d140e/",
    ], // Polygon Mainnet
    "polygon-zkevm": [
      "https://damp-responsive-lake.zkevm-mainnet.quiknode.pro/cd52de287787145bed62e018d77120f58817e2dd/",
    ], // Polygon zkEVM Mainnet
    binance: [
      "https://blissful-prettiest-card.bsc.quiknode.pro/a3ce175c0543b6dcb724dcd7d632d32ce1feffc3/",
    ], // BSC Mainnet
    arbitrum: [
      "https://polished-hardworking-general.arbitrum-mainnet.quiknode.pro/184a59ea768ba16416d41d7b2fdded121f203bb0/",
    ], // Arbitrum Mainnet
    celo: [
      "https://summer-patient-vineyard.celo-mainnet.quiknode.pro/51470431fe844342dc21f86eb38e4f8165a396b2/",
    ], // Celo Mainnet
    aurora: [], // Aurora Mainnet
    optimism: [
      "https://wiser-clean-scion.optimism.quiknode.pro/08bd3d920544545d276ffe5281eef3210e1a6634/",
    ], // Optimism Mainnet
    kava: [], // Kava Mainnet
    filecoin: [], // Filecoin Mainnet
    base: [
      "https://indulgent-wispy-meme.base-mainnet.quiknode.pro/59831bb60c3e3dcba7ce6a5003cbb4ef33351a86/",
    ], // Base Mainnet
    linea: [
      "https://green-broken-snowflake.linea-mainnet.quiknode.pro/416c0d3c1a33b68be726cdb19c4a6f463ad29acc/",
    ], // Linea Mainnet
    mantle: [
      "https://small-solitary-needle.mantle-mainnet.quiknode.pro/b36a11196cd631becf7a846640f2aff680b4de23/",
    ], // Mantle Mainnet
    scroll: [
      "https://holy-boldest-gadget.scroll-mainnet.quiknode.pro/508c2a84dbf8ac18c0900dc29ab688286a15712f/",
    ], // Scroll Mainnet
    fraxtal: [], // Fraxtal Mainnet *** Requires $99/m payment
    blast: [
      "https://morning-small-replica.blast-mainnet.quiknode.pro/ac5c87250815afa177f453b554e4ea907c70eb61/",
    ], // Blast Mainnet
  },
  testnet: {
    "ethereum-sepolia": [
      "https://wandering-special-arrow.ethereum-sepolia.quiknode.pro/31aa2b4a47331b5c00fa54e8b33da6b15c5dd040/",
    ], // Ethereum Sepolia
    flow: [
      "https://side-morning-uranium.flow-testnet.quiknode.pro/cd75213eb11bafa160d4308c8b52ef3a657d930b/",
    ], // Flow Testnet
    moonbeam: [
      "https://moonbase-alpha.blastapi.io/8e29a56e-e494-468e-b345-f4d7df1109a3",
    ], // Moonbase Alpha
    Fantom: [
      "https://fantom-testnet.blastapi.io/8e29a56e-e494-468e-b345-f4d7df1109a3",
    ], // Fantom Testnet
    immutable: [
      "https://special-virulent-brook.imx-testnet.quiknode.pro/fcc4baa55701c9ff872e52995c26f7789fb8072f/",
    ], // Immutable zkEVM Testnet
    Avalanche: [
      "https://morning-powerful-market.avalanche-testnet.quiknode.pro/8a0d137d16f2290e6e01e9d8b46c77414eac6704/ext/bc/C/rpc/",
    ], // Avalanche Fuji
    "polygon-sepolia": [
      "https://sly-weathered-hexagon.matic-amoy.quiknode.pro/93e3dabb1995e191df9a75a51ed231b14cb550b4/",
    ], // Polygon Amoy
    "polygon-zkevm": [
      "https://boldest-distinguished-energy.zkevm-cardona.quiknode.pro/a081fe9c40d692067016e481eff2200c03d681d7/",
    ], // Polygon zkEVM Testnet
    binance: [
      "https://fabled-special-isle.bsc-testnet.quiknode.pro/63cb6dfda42694bafebf11a8623c1df38f695fe1/",
    ], // BSC Testnet
    "arbitrum-sepolia": [
      "https://twilight-ultra-panorama.arbitrum-sepolia.quiknode.pro/103d1ea72def959527cae046956acce68aec68a0/",
    ], // Arbitrum Sepolia
    celo: [], // Celo Alfajores
    aurora: [], // Aurora Testnet
    "optimism-sepolia": [
      "https://patient-compatible-reel.optimism-sepolia.quiknode.pro/b3e060d7362151bb0ad9319225dad49facb6f375/",
    ], // Optimism Sepolia
    kava: [], // Kava Testnet
    "filecoin-2": [], // Filecoin Calibration (testnet)
    "base-sepolia": [
      "https://chaotic-delicate-water.base-sepolia.quiknode.pro/0b48238e1e9bf5e268f7e1a8f701d695f5996d61/",
    ], // Base Sepolia
    "linea-sepolia": [
      "https://linea-sepolia.blastapi.io/8e29a56e-e494-468e-b345-f4d7df1109a3",
    ], // Linea Sepolia
    linea: [
      "https://linea-sepolia.blastapi.io/8e29a56e-e494-468e-b345-f4d7df1109a3",
    ], // Linea Testnet
    mantle: [
      "https://solemn-wild-moon.mantle-sepolia.quiknode.pro/411c3f4702109a4d4163d8c643937f32a76c37c4/",
    ], // Mantle Testnet
    scroll: [
      "https://quaint-newest-aura.scroll-testnet.quiknode.pro/4a86c0f5d42d50cd7535dc62d42746704af3760d/",
    ], // Scroll Sepolia
    fraxtal: [], // Fraxtal Testnet *** Requires $99/m payment
    "blast-sepolia": [
      "https://dawn-fluent-aura.blast-sepolia.quiknode.pro/fcb50ae8356a4f679db8559440893e6765897510/",
    ], // Blast Sepolia
    "xrpl-evm": [], // XRPL EVM Testnet
  },
} as const;
