import { Chain } from "viem";

import { PublicContractClient } from "../PublicContractClient";
import ABI_FILE from "./erc-20.abi";

export class ERC20Client extends PublicContractClient<typeof ABI_FILE.abi> {
  static ABI = ABI_FILE.abi;

  constructor(options: { chain: Chain; address: `0x${string}` }) {
    super({
      chain: options.chain,
      abi: ERC20Client.ABI,
      address: options.address,
    });
  }
}
