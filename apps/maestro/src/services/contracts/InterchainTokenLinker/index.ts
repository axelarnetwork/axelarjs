import { createPublicClient, http } from "viem";

import { CHAIN_CONFIGS } from "~/config/wagmi";
import { InterchainTokenLinker } from "~/lib/contract/abis";

export type ContractReadAction =
  | {
      method: "getTokenId" | "getOriginTokenId";
      args: [address: `0x${string}`];
    }
  | {
      method: "getTokenAddress";
      args: [tokenId: `0x${string}`];
    };

export class InterchainTokenLinkerClient {
  private client: ReturnType<typeof createPublicClient>;

  constructor(chainConfig: (typeof CHAIN_CONFIGS)[number]) {
    this.client = createPublicClient({
      chain: chainConfig,
      transport: http(),
    });
  }

  public readContract(action: ContractReadAction) {
    return this.client.readContract({
      address: String(
        process.env.NEXT_PUBLIC_TOKEN_LINKER_ADDRESS
      ) as `0x${string}`,
      abi: InterchainTokenLinker.abi,
      functionName: action.method,
      args: action.args,
    });
  }
}
