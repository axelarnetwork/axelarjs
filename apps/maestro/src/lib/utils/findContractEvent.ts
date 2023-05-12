import { Interface } from "ethers/lib/utils";
import { TransactionReceipt } from "viem";

export function getTokenDeployedEventFromTxReceipt(
  receipt: TransactionReceipt
): `0x${string}` | null {
  const abiInterface = new Interface([
    "event TokenDeployed(address indexed tokenAddress, string name, string symbol, uint8 decimals, uint256 cap, address indexed owner)",
  ]);

  for (const log of receipt.logs) {
    try {
      const parsed = abiInterface.parseLog({
        topics: log.topics,
        data: log.data,
      });
      console.log({ parsed });
      if (parsed?.args?.tokenAddress) {
        return parsed.args.tokenAddress;
      }
    } catch (e) {}
  }

  return null;
}
