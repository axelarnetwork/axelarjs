import { PublicContractClient } from "../PublicContractClient";
import ABI_FILE from "./interchain-token-service.abi";

export class InterchainTokenClient extends PublicContractClient<
  typeof ABI_FILE.abi
> {}
