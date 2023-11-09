import BASE_INTERCHAIN_TOKEN_ABI from "./base-interchain-token.abi";
import ERC20_PERMIT_ABI from "./erc20-permit.abi";
import ERC20_ABI from "./erc20.abi";
import INTERCHAIN_TOKEN_FACTORY_ABI from "./interchain-token-factory.abi";
import INTERCHAIN_TOKEN_SERVICE_ABI from "./interchain-token-service.abi";
import INTERCHAIN_TOKEN_ABI from "./interchain-token.abi";
import TOKEN_MANAGER_LIQUIDITY_POOL_ABI from "./token-manager-liquidity-pool.abi";
import TOKEN_MANAGER_LOCK_UNLOCK_FEE_ABI from "./token-manager-lock-unlock-fee.abi";
import TOKEN_MANAGER_LOCK_UNLOCK_ABI from "./token-manager-lock-unlock.abi";
import TOKEN_MANAGER_MINT_BURN_FROM_ABI from "./token-manager-mint-burn-from.abi";
import TOKEN_MANAGER_MINT_BURN_ABI from "./token-manager-mint-burn.abi";
import TOKEN_MANAGER_ABI from "./token-manager.abi";

export const contracts = [
  {
    name: BASE_INTERCHAIN_TOKEN_ABI.contractName,
    abi: BASE_INTERCHAIN_TOKEN_ABI.abi,
    address: undefined, // you can set this as NEXT_PUBLIC_BASE_INTERCHAIN_TOKEN_ADDRESS in .env.local for fixed contract addresses
  },
  {
    name: ERC20_ABI.contractName,
    abi: ERC20_ABI.abi,
    address: undefined, // you can set this as NEXT_PUBLIC_ERC20_ADDRESS in .env.local for fixed contract addresses
  },
  {
    name: ERC20_PERMIT_ABI.contractName,
    abi: ERC20_PERMIT_ABI.abi,
    address: undefined, // you can set this as NEXT_PUBLIC_ERC20_PERMIT_ADDRESS in .env.local for fixed contract addresses
  },
  {
    name: INTERCHAIN_TOKEN_ABI.contractName,
    abi: INTERCHAIN_TOKEN_ABI.abi,
    address: undefined, // you can set this as NEXT_PUBLIC_INTERCHAIN_TOKEN_ADDRESS in .env.local for fixed contract addresses
  },
  {
    name: INTERCHAIN_TOKEN_FACTORY_ABI.contractName,
    abi: INTERCHAIN_TOKEN_FACTORY_ABI.abi,
    address: undefined, // you can set this as NEXT_PUBLIC_INTERCHAIN_TOKEN_FACTORY_ADDRESS in .env.local for fixed contract addresses
  },
  {
    name: INTERCHAIN_TOKEN_SERVICE_ABI.contractName,
    abi: INTERCHAIN_TOKEN_SERVICE_ABI.abi,
    address: "0xF786e21509A9D50a9aFD033B5940A2b7D872C208" as `0x${string}`, // read from .env.local (NEXT_PUBLIC_INTERCHAIN_TOKEN_SERVICE_ADDRESS)
  },
  {
    name: TOKEN_MANAGER_ABI.contractName,
    abi: TOKEN_MANAGER_ABI.abi,
    address: undefined, // you can set this as NEXT_PUBLIC_TOKEN_MANAGER_ADDRESS in .env.local for fixed contract addresses
  },
  {
    name: TOKEN_MANAGER_LIQUIDITY_POOL_ABI.contractName,
    abi: TOKEN_MANAGER_LIQUIDITY_POOL_ABI.abi,
    address: undefined, // you can set this as NEXT_PUBLIC_TOKEN_MANAGER_LIQUIDITY_POOL_ADDRESS in .env.local for fixed contract addresses
  },
  {
    name: TOKEN_MANAGER_LOCK_UNLOCK_ABI.contractName,
    abi: TOKEN_MANAGER_LOCK_UNLOCK_ABI.abi,
    address: undefined, // you can set this as NEXT_PUBLIC_TOKEN_MANAGER_LOCK_UNLOCK_ADDRESS in .env.local for fixed contract addresses
  },
  {
    name: TOKEN_MANAGER_LOCK_UNLOCK_FEE_ABI.contractName,
    abi: TOKEN_MANAGER_LOCK_UNLOCK_FEE_ABI.abi,
    address: undefined, // you can set this as NEXT_PUBLIC_TOKEN_MANAGER_LOCK_UNLOCK_FEE_ADDRESS in .env.local for fixed contract addresses
  },
  {
    name: TOKEN_MANAGER_MINT_BURN_ABI.contractName,
    abi: TOKEN_MANAGER_MINT_BURN_ABI.abi,
    address: undefined, // you can set this as NEXT_PUBLIC_TOKEN_MANAGER_MINT_BURN_ADDRESS in .env.local for fixed contract addresses
  },
  {
    name: TOKEN_MANAGER_MINT_BURN_FROM_ABI.contractName,
    abi: TOKEN_MANAGER_MINT_BURN_FROM_ABI.abi,
    address: undefined, // you can set this as NEXT_PUBLIC_TOKEN_MANAGER_MINT_BURN_FROM_ADDRESS in .env.local for fixed contract addresses
  },
];
