import IERC20_MINTABLE_BURNABLE_ABI from "./IERC20MintableBurnable.abi";
import INTERCHAIN_TOKEN_ABI from "./InterchainToken.abi";
import INTERCHAIN_TOKEN_FACTORY_ABI from "./InterchainTokenFactory.abi";
import INTERCHAIN_TOKEN_SERVICE_ABI from "./InterchainTokenService.abi";
import TOKEN_MANAGER_ABI from "./TokenManager.abi";

export const contracts = [
  {
    name: IERC20_MINTABLE_BURNABLE_ABI.contractName,
    abi: IERC20_MINTABLE_BURNABLE_ABI.abi,
    address: undefined, // you can set this as NEXT_PUBLIC_IERC20_MINTABLE_BURNABLE_ADDRESS in .env.local for fixed contract addresses
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
];
