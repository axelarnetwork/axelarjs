import INTERCHAIN_TOKEN_SERVICE_ABI from "./interchain-token-service.abi";
import INTERCHAIN_TOKEN_ABI from "./interchain-token.abi";
import TOKEN_MANAGER_ABI from "./token-manager.abi";

export const contracts = [
  { name: INTERCHAIN_TOKEN_ABI.contractName, abi: INTERCHAIN_TOKEN_ABI.abi },
  {
    name: INTERCHAIN_TOKEN_SERVICE_ABI.contractName,
    abi: INTERCHAIN_TOKEN_SERVICE_ABI.abi,
  },
  { name: TOKEN_MANAGER_ABI.contractName, abi: TOKEN_MANAGER_ABI.abi },
];
