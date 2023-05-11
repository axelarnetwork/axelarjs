import { Chain } from "viem";

import { PublicContractClient } from "../PublicContractClient";
import ABI_FILE from "./erc-20.abi";

export class ERC20Client extends PublicContractClient<typeof ABI_FILE.abi> {
  constructor(options: { chain: Chain; address: `0x${string}` }) {
    super({
      chain: options.chain,
      abi: ABI_FILE.abi,
      address: options.address,
    });
  }
}
