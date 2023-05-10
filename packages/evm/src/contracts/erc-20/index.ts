import { PublicContractClient } from "../PublicContractClient";
import ABI_FILE from "./erc-20.abi";

export class InterchainTokenClient extends PublicContractClient<
  typeof ABI_FILE.abi
> {}
