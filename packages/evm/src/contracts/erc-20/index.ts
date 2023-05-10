import { PublicContractClient } from "../PublicContractClient";
import ABI_FILE from "./erc-20.abi";

export class ERC20Client extends PublicContractClient<typeof ABI_FILE.abi> {}
