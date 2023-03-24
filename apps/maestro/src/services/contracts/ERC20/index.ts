import { createPublicClient, http } from "viem";

import { CHAIN_CONFIGS } from "~/config/wagmi";
import { ERC20 } from "~/lib/contract/abis";

export type ERC20ClientContractReadAction = {
  method: "decimals" | "symbol" | "name";
  address: `0x${string}`;
};
export class ERC20Client {
  private client: ReturnType<typeof createPublicClient>;

  constructor(chainConfig: (typeof CHAIN_CONFIGS)[number]) {
    this.client = createPublicClient({
      chain: chainConfig,
      transport: http(),
    });
  }

  public readContract(action: ERC20ClientContractReadAction) {
    return this.client.readContract({
      address: action.address,
      abi: ERC20.abi,
      functionName: action.method,
    });
  }
}
