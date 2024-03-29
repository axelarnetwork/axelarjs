/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * This file was generated by scripts/codegen.ts
 *
 * Original abi file:
 * - node_modules/@axelar-network/interchain-token-service/artifacts/contracts/interfaces/IERC20MintableBurnable.sol/IERC20MintableBurnable.json
 *
 * DO NOT EDIT MANUALLY
 */

import { Chain } from "viem";

import { PublicContractClient } from "../../PublicContractClient";
import ABI_FILE from "./IERC20MintableBurnable.abi";

export * from "./IERC20MintableBurnable.args";

export const IERC20_MINTABLE_BURNABLE_ABI = ABI_FILE.abi;

/**
 * IERC20MintableBurnableClient
 *
 * @description Type-safe contract client for IERC20MintableBurnable
 *
 * @example
 *
 * import { sepolia } from "viem/chains";
 *
 * const client = createIERC20MintableBurnableClient({
 *  chain: sepolia,
 *  address: "0x1234..."
 * });
 */
export class IERC20MintableBurnableClient extends PublicContractClient<
  typeof ABI_FILE.abi
> {
  static ABI = ABI_FILE.abi;
  static contractName = ABI_FILE.contractName;

  constructor(options: { chain: Chain; address: `0x${string}` }) {
    super({
      abi: IERC20_MINTABLE_BURNABLE_ABI,
      address: options.address,
      chain: options.chain,
    });
  }
}

export const createIERC20MintableBurnableClient = (options: {
  chain: Chain;
  address: `0x${string}`;
}) => new IERC20MintableBurnableClient(options);
