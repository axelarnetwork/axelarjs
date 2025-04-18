import {
  createPublicClient,
  createWalletClient,
  http,
  type Chain,
  type ContractFunctionReturnType,
  type ReadContractParameters,
  type WalletClient,
  type WriteContractParameters,
} from "viem";
import { mainnet } from "viem/chains";

type PublicClientType = ReturnType<typeof createPublicClient>;

/**
 * Public contract client
 *
 * A client for interacting with public contracts
 */
export class PublicContractClient<TAbi extends readonly unknown[]> {
  private client: PublicClientType;
  private provider: WalletClient;

  public readonly abi: TAbi;
  public readonly address?: `0x${string}`;
  public readonly chain?: Chain;

  constructor(options?: {
    chain?: Chain;
    abi?: TAbi;
    address?: `0x${string}`;
  }) {
    this.client = createPublicClient({
      chain: options?.chain,
      transport: http(),
    });

    this.provider = createWalletClient({
      chain: options?.chain,
      transport: http(),
    });

    this.abi = (options?.abi ?? []) as TAbi;
    this.address = options?.address as `0x${string}`;
    this.chain = options?.chain ?? mainnet;
  }

  public read<
    TFunctionName extends ReadContractParameters<TAbi>["functionName"],
  >(
    functionName: TFunctionName,
    params?: Omit<
      ReadContractParameters<TAbi, TFunctionName>,
      "address" | "functionName" | "abi"
    > & {
      address?: `0x${string}`;
    }
  ): Promise<ContractFunctionReturnType<TAbi, "view", TFunctionName>> {
    const address = params?.address ?? this.address;

    if (!address) {
      throw new Error("No address provided");
    }

    const contractParams = {
      address,
      abi: this.abi,
      functionName,
    } as ReadContractParameters<TAbi, TFunctionName>;

    if (params?.args) {
      contractParams["args"] = params.args;
    }

    return this.client.readContract(contractParams);
  }

  public write<
    TFunctionName extends WriteContractParameters<TAbi>["functionName"],
  >(
    functionName: TFunctionName,
    params?: Omit<
      WriteContractParameters<TAbi, TFunctionName>,
      "address" | "functionName" | "abi"
    > & {
      address?: `0x${string}`;
    }
  ): Promise<`0x${string}`> {
    const address = params?.address ?? this.address;

    if (!address) {
      throw new Error("No address provided");
    }

    const contractParams = {
      functionName,
      abi: this.abi,
    } as WriteContractParameters<TAbi, TFunctionName>;

    if (params?.args) {
      contractParams["args"] = params.args;
    }

    if (params?.account) {
      contractParams["account"] = params.account;
    }

    if (address) {
      contractParams["address"] = address;
    }

    return this.provider.writeContract(contractParams);
  }
}
