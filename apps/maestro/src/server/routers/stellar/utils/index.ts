import type { StellarChainConfig } from "@axelarjs/api";

import {
  Address,
  Contract,
  Horizon,
  nativeToScVal,
  scValToNative,
  TransactionBuilder,
  type Account,
} from "@stellar/stellar-sdk";
import { ethers } from "ethers";
import { rpc } from "stellar-sdk";

import { stellarChainConfig } from "~/config/chains";
import type { Context } from "~/server/context";
import { STELLAR_HORIZON_URL, STELLAR_NETWORK_PASSPHRASE } from "./config";

export const gasTokenAddress =
  "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC";
export const stellarITContractId =
  "CCXT3EAQ7GPQTJWENU62SIFBQ3D4JMNQSB77KRPTGBJ7ZWBYESZQBZRK";
export const sorobanRpcUrl = "https://soroban-testnet.stellar.org";

export function hexToScVal(hexString: string) {
  const result = nativeToScVal(Buffer.from(ethers.utils.arrayify(hexString)), {
    type: "bytes",
  });
  return result;
}

export function addressToScVal(addressString: string) {
  return nativeToScVal(Address.fromString(addressString), { type: "address" });
}

export function tokenToScVal(tokenAddress: string, tokenAmount: number) {
  return tokenAmount === 0
    ? nativeToScVal(null, { type: "null" })
    : nativeToScVal(
        {
          address: Address.fromString(tokenAddress),
          amount: tokenAmount,
        },
        {
          type: {
            address: ["symbol", "address"],
            amount: ["symbol", "i128"],
          },
        }
      );
}

export const formatTokenId = (tokenId: string) => {
  const hex = tokenId.replace(/^0x/, "").padStart(64, "0");
  return Buffer.from(hex, "hex");
};

export const getStellarChainConfig = async (
  ctx: Context
): Promise<StellarChainConfig> => {
  const chainConfigs = await ctx.configs.axelarConfigs();
  const chainConfig = chainConfigs.chains[stellarChainConfig.axelarChainId];
  if (chainConfig.chainType !== "stellar") {
    throw new Error("Invalid chain config");
  }

  return chainConfig;
};

export const stellarEncodedRecipient = (
  destinationAddress: string
): `0x${string}` => `0x${Buffer.from(destinationAddress).toString("hex")}`;

// Helper to simulate a call and decode the result
async function simulateCall(
  method: string,
  account: Account,
  contract: Contract,
  rpcServer: rpc.Server
) {
  try {
    const tx = new TransactionBuilder(account, {
      fee: "1000000",
      networkPassphrase: STELLAR_NETWORK_PASSPHRASE,
    })
      .addOperation(contract.call(method))
      .setTimeout(30)
      .build();
    const sim = (await rpcServer.simulateTransaction(
      tx
    )) as rpc.Api.SimulateTransactionSuccessResponse;

    if (sim.result && sim.result.retval) {
      // Try to decode as string or number
      return scValToNative(sim.result.retval);
    }
    return null;
  } catch (e) {
    return null;
  }
}

export const getStellarAssetMetadata = async (tokenAddress: string) => {
  const server = new Horizon.Server(STELLAR_HORIZON_URL);
  const [asset_code, asset_issuer] = tokenAddress.split("-");
  const asset = await server
    .assets()
    .forCode(asset_code)
    .forIssuer(asset_issuer)
    .call()
    .then((res: any) => res.records[0])
    .catch(() => null);

  if (!asset) {
    throw new Error("Asset not found on Stellar network.");
  }

  return {
    name: asset.asset_code,
    symbol: asset.asset_code,
  };
};

export async function getStellarContractMetadata(
  contractId: string,
  rpcUrl: string
) {
  // Any Stellar account can be used as a source account
  const sourceAccount =
    "GDJEBNB5KVJ3CJE2WNQFJFEO75IT3CUAUOWRVGATXQDBZ7DMCU3MHNWO";

  const rpcServer = new rpc.Server(rpcUrl, { allowHttp: true });
  const account = await rpcServer.getAccount(sourceAccount);
  const contract = new Contract(contractId);

  // Try to fetch standard metadata
  const [symbol, name, decimals] = await Promise.all([
    simulateCall("symbol", account, contract, rpcServer),
    simulateCall("name", account, contract, rpcServer),
    simulateCall("decimals", account, contract, rpcServer),
  ]);

  return {
    tokenAddress: contractId,
    name,
    symbol,
    decimals,
  };
}
