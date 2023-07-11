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
    TFunctionName extends ReadContractParameters<TAbi>["functionName"]
  >(
    functionName: TFunctionName,
    params?: Omit<
      ReadContractParameters<TAbi, TFunctionName>,
      "address" | "functionName" | "abi"
    > & {
      address?: `0x${string}`;
    }
  ): Promise<ContractFunctionResult<TAbi, TFunctionName>> {
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

  /**
   * Batch read contract
   * @param Calls
   */
  public batchRead<
    TFunctionName extends ReadContractParameters<TAbi>["functionName"]
  >(
    calls: {
      functionName: TFunctionName;
      params?: Omit<
        ReadContractParameters<TAbi, TFunctionName>,
        "address" | "functionName" | "abi"
      > & {
        address?: `0x${string}`;
        /**
         * Default result to return if the call fails
         */
        defaultResult?: ContractFunctionResult<TAbi, TFunctionName> | null;
      };
    }[]
  ): Promise<ContractFunctionResult<TAbi, TFunctionName>[]> {
    return Promise.all(
      calls.map(async ({ params, functionName }) => {
        try {
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
          return await this.client.readContract(contractParams);
        } catch (error) {
          if (params && "defaultResult" in params) {
            // return the default result and ignore the error if it exists
            return params.defaultResult as ContractFunctionResult<
              TAbi,
              TFunctionName
            >;
          }

          throw error;
        }
      })
    );
  }

  public writeContract<
    TFunctionName extends ReadContractParameters<TAbi>["functionName"]
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
      address,
      abi: this.abi,
      functionName: functionName,
    } as WriteContractParameters<TAbi, TFunctionName, undefined>;

    if (params?.args) {
      contractParams["args"] = params.args;
    }

    return this.provider.writeContract(contractParams);
  }
}
