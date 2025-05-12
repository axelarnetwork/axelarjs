import type { StellarChainConfig } from "@axelarjs/api";

import type { StellarWalletsKit } from "@creit.tech/stellar-wallets-kit";
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
import { rpc, Transaction } from "stellar-sdk";

import { stellarChainConfig } from "~/config/chains";
import { NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE } from "~/config/env";
import type { Context } from "~/server/context";
import { createContractTransaction, fetchStellarAccount } from "./transactions";

function hexToScVal(hexString: string) {
  const result = nativeToScVal(Buffer.from(ethers.utils.arrayify(hexString)), {
    type: "bytes",
  });
  return result;
}

function addressToScVal(addressString: string) {
  return nativeToScVal(Address.fromString(addressString), { type: "address" });
}

function tokenToScVal(tokenAddress: string, tokenAmount: number) {
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

export async function interchain_transfer({
  tokenId,
  destinationChain,
  destinationAddress,
  amount,
  gasValue = 10000000,
  caller,
  kit,
}: {
  tokenId: string;
  destinationChain: string;
  destinationAddress: string;
  amount: number;
  gasValue: number;
  caller: string;
  kit: StellarWalletsKit;
}) {
  try {
    const gasTokenAddress =
      "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC";
    const contractId =
      "CCXT3EAQ7GPQTJWENU62SIFBQ3D4JMNQSB77KRPTGBJ7ZWBYESZQBZRK";
    const server = new rpc.Server("https://soroban-testnet.stellar.org");

    const { transactionXDR } = await createContractTransaction({
      contractAddress: contractId,
      method: "interchain_transfer",
      account: await fetchStellarAccount(caller),
      args: [
        addressToScVal(caller),
        hexToScVal(tokenId),
        nativeToScVal(destinationChain, { type: "string" }),
        hexToScVal(destinationAddress),
        nativeToScVal(amount, { type: "i128" }),
        nativeToScVal(null, { type: "void" }),
        tokenToScVal(gasTokenAddress, gasValue),
      ],
    });

    const { signedTxXdr } = await kit.signTransaction(transactionXDR, {
      networkPassphrase: NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE,
    });

    const tx = new Transaction(
      signedTxXdr,
      NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE
    );
    const result = await server.sendTransaction(tx);

    return result;
  } catch (error) {
    console.error("Interchain transfer failed:", error);
    throw error;
  }
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
      networkPassphrase: NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE,
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
  const server = new Horizon.Server("https://horizon-testnet.stellar.org");
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
