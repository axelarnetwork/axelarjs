import {
  Chain,
  ContractFunctionResult,
  createPublicClient,
  createWalletClient,
  http,
  ReadContractParameters,
  WalletClient,
  WriteContractParameters,
} from "viem";
import { mainnet } from "viem/chains";

type PublicClientType = ReturnType<typeof createPublicClient>;

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
    this.address = (options?.address ?? "0x123") as `0x${string}`;
    this.chain = options?.chain ?? mainnet;
  }

  public readContract<
    TMethod extends ReadContractParameters<TAbi>["functionName"]
  >(
    method: TMethod,
    params?: Omit<
      ReadContractParameters<TAbi, TMethod>,
      "address" | "functionName" | "abi"
    > & {
      address?: `0x${string}`;
    }
  ): Promise<ContractFunctionResult<TAbi, TMethod>> {
    const address = params?.address ?? this.address;

    if (!address) {
      throw new Error("No address provided");
    }

    const contractParams = {
      address,
      abi: this.abi,
      functionName: method,
    } as ReadContractParameters<TAbi, TMethod>;

    if (params?.args) {
      contractParams["args"] = params.args;
    }

    return this.client.readContract(contractParams);
  }

  public writeContract<
    TMethod extends ReadContractParameters<TAbi>["functionName"]
  >(
    method: TMethod,
    params?: Omit<
      WriteContractParameters<TAbi, TMethod>,
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
      address,
      abi: this.abi,
      functionName: method,
    } as WriteContractParameters<TAbi, TMethod, undefined>;

    if (params?.args) {
      contractParams["args"] = params.args;
    }

    return this.provider.writeContract(contractParams);
  }
}
