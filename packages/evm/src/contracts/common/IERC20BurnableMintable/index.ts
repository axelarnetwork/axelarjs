import { Chain } from "viem";

import { PublicContractClient } from "../../PublicContractClient";
import ABI_FILE from "./IERC20BurnableMintable.abi";
import { createIERC20BurnableMintableReadClient } from "./IERC20BurnableMintable.args";

const createReadClient = createIERC20BurnableMintableReadClient;

export * from "./IERC20BurnableMintable.args";

export const IERC20BurnableMintable_ABI = ABI_FILE.abi;

export class IERC20BurnableMintableClient extends PublicContractClient<
  typeof ABI_FILE.abi
> {
  static ABI = ABI_FILE.abi;
  static contractName = ABI_FILE.contractName;

  public readonly reads: ReturnType<typeof createReadClient>;

  constructor(options: { chain: Chain; address: `0x${string}` }) {
    super({
      abi: IERC20BurnableMintable_ABI,
      address: options.address,
      chain: options.chain,
    });

    this.reads = createReadClient(this);
  }
}
