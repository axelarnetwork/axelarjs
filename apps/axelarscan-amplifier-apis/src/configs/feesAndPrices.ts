const getFeesAndPrices = (isMainnet: boolean) =>  isMainnet ? feesAndPrices.mainnet : feesAndPrices.testnet

export const feesAndPrices = {
  testnet: [
    {
      name: "Avalanche",
      amplifierChainId: "avalanche",
      description: null,
      gasPriceGwei: 25,
      approvalCost: 425000,
      updated: "2024-07-31",
    },
    {
      name: "fantom",
      amplifierChainId: "fantom",
      description: null,
      gasPriceGwei: 1.03,
      approvalCost: 1300000,
      updated: "2024-07-31",
    },
    {
      name: "ethereum-sepolia",
      amplifierChainId: "ethereum-sepolia",
      description: null,
      gasPriceGwei: 10,
      approvalCost: 200000,
      updated: "2024-07-31",
    },
    {
      name: "op-sepolia",
      amplifierChainId: "op-sepolia",
      description: null,
      gasPriceGwei: 0.001,
      approvalCost: 300000,
      updated: "2024-07-31",
    },
  ],
  mainnet: [],
};

export default getFeesAndPrices;
