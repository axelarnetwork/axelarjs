import { STELLAR_RPC_URLS } from "@axelarjs/core";

import type { WalletNetwork } from "@creit.tech/stellar-wallets-kit";

import { NEXT_PUBLIC_NETWORK_ENV } from "~/config/env";

export const HORIZON_URLS = {
  mainnet: "https://horizon.stellar.org",
  testnet: "https://horizon-testnet.stellar.org",
  devnet: "https://horizon-testnet.stellar.org",
};

export const STELLAR_HORIZON_URL =
  HORIZON_URLS[NEXT_PUBLIC_NETWORK_ENV as keyof typeof HORIZON_URLS];

export const XLMAssetAddresses = {
  mainnet: "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
  testnet: "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC",
  "devnet-amplifier":
    "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC",
};

export const STELLAR_ITS_CONTRACT_IDS = {
  mainnet: "CBDBMIOFHGWUFRYH3D3STI2DHBOWGDDBCRKQEUB4RGQEBVG74SEED6C6",
  testnet: "CCXT3EAQ7GPQTJWENU62SIFBQ3D4JMNQSB77KRPTGBJ7ZWBYESZQBZRK",
  "devnet-amplifier":
    "CATNQHWMG4VOWPSWF4HXVW7ASDJNX7M7F6JLFC544T7ZMMXXAE2HUDTY",
};

export const STELLAR_NETWORK_PASSPHRASES = {
  mainnet: "Public Global Stellar Network ; September 2015",
  testnet: "Test SDF Network ; September 2015",
  "devnet-amplifier": "Test SDF Network ; September 2015",
};

export const STELLAR_SOURCE_ACCOUNTS = {
  mainnet: "GDMTVHLWJTHSUDMZVVMXXH6VJHA2ZV3HNG5LYNAZ6RTWB7GISM6PGTUV",
  testnet: "GDJEBNB5KVJ3CJE2WNQFJFEO75IT3CUAUOWRVGATXQDBZ7DMCU3MHNWO",
  "devnet-amplifier":
    "GDJEBNB5KVJ3CJE2WNQFJFEO75IT3CUAUOWRVGATXQDBZ7DMCU3MHNWO",
};

// Multicall contract addresses for different environments
export const STELLAR_MULTICALL_CONTRACT_IDS = {
  mainnet: "CC5LVKQA73ZVVUBAOCV5INV4TXPMELBFJ6XTQUBJTP4O2LSUKAA7VHLZ",
  testnet: "CC6BXRCUQFAJ64NDLEZCS4FDL6GN65FL2KDOKCRHFWPMPKRWQNBA4YR2",
  "devnet-amplifier":
    "CDY327IFXISX2WW6OFCCHM5VVQ2W3DFT2LPEWOFERSRFLWGPH3RLZVMK",
};

// SCA Factory contract addresses for different environments
export const STELLAR_SCA_FACTORY_CONTRACT_IDS = {
  mainnet: "CDVEX22YYCFAMYO5WFGOUIOXQFWXA6Y6LQF4TOF7MXFUS3BOEEC7FMQG",
  testnet: "CD6VPAQDZ46F3GI6QBBQVABPORVPPQ7DSCXARDHJUU7RIESDJRCLIEAC",
  "devnet-amplifier":
    "CD6VPAQDZ46F3GI6QBBQVABPORVPPQ7DSCXARDHJUU7RIESDJRCLIEAC",
};

export const STELLAR_SCA_FACTORY_CONTRACT_ID =
  STELLAR_SCA_FACTORY_CONTRACT_IDS[
    NEXT_PUBLIC_NETWORK_ENV as keyof typeof STELLAR_SCA_FACTORY_CONTRACT_IDS
  ];

export const STELLAR_NETWORK_PASSPHRASE = STELLAR_NETWORK_PASSPHRASES[
  NEXT_PUBLIC_NETWORK_ENV
] as WalletNetwork;

export const STELLAR_SOURCE_ACCOUNT =
  STELLAR_SOURCE_ACCOUNTS[NEXT_PUBLIC_NETWORK_ENV];

export const STELLAR_ITS_CONTRACT_ID =
  STELLAR_ITS_CONTRACT_IDS[NEXT_PUBLIC_NETWORK_ENV];

export const XLM_ASSET_ADDRESS = XLMAssetAddresses[NEXT_PUBLIC_NETWORK_ENV];

export const STELLAR_RPC_URL = STELLAR_RPC_URLS[NEXT_PUBLIC_NETWORK_ENV];

export const SOROBAN_RPC_URL = STELLAR_RPC_URLS[NEXT_PUBLIC_NETWORK_ENV];

export const STELLAR_MULTICALL_CONTRACT_ID =
  STELLAR_MULTICALL_CONTRACT_IDS[
    NEXT_PUBLIC_NETWORK_ENV as keyof typeof STELLAR_MULTICALL_CONTRACT_IDS
  ];
