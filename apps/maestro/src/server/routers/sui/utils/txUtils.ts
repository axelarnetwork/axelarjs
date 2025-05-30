import type { SuiChainConfig } from "@axelarjs/api";

import { SUI_PACKAGE_ID, TxBuilder } from "@axelar-network/axelar-cgp-sui";
import { TransactionResult } from "@mysten/sui/transactions";
import { SUI_TYPE_ARG } from "@mysten/sui/utils";
import { keccak256, stringToHex } from "viem";

import { suiChainConfig } from "~/config/chains";
import { suiClient } from "~/lib/clients/suiClient";

export function setupTxBuilder(sender: string) {
  const txBuilder = new TxBuilder(suiClient);
  txBuilder.tx.setSenderIfNotSet(sender);

  return { txBuilder };
}

export async function getTokenId(
  txBuilder: TxBuilder,
  tokenId: string,
  ITS: any
) {
  const [TokenId] = await txBuilder.moveCall({
    target: `${ITS.address}::token_id::from_u256`,
    arguments: [tokenId.toString()],
  });

  return TokenId;
}

export async function getTokenIdByCoinMetadata(
  txBuilder: TxBuilder,
  coinType: string,
  coinMetadata: any,
  chainConfig: SuiChainConfig,
  isLockUnlock: boolean = false
) {
  const { InterchainTokenService: ITS, AxelarGateway } =
    chainConfig.config.contracts;
  const ChainNameHash = await txBuilder.moveCall({
    target: `${AxelarGateway.address}::bytes32::from_bytes`,
    arguments: [keccak256(stringToHex(suiChainConfig.axelarChainId))],
  });

  const TokenId = await txBuilder.moveCall({
    target: `${ITS.address}::token_id::from_info`,
    typeArguments: [coinType],
    arguments: [
      ChainNameHash,
      coinMetadata.name,
      coinMetadata.symbol,
      txBuilder.tx.pure.u8(coinMetadata.decimals),
      txBuilder.tx.pure.bool(false),
      txBuilder.tx.pure.bool(!isLockUnlock), // true for mint_burn, false for lock_unlock as this checks whether an address owns the treasury cap
    ],
  });
  return TokenId;
}

export async function mintToken(
  txBuilder: TxBuilder,
  tokenType: string,
  treasuryCap: any,
  amount: bigint,
  sender: string
) {
  const [coin] = await txBuilder.moveCall({
    target: `${SUI_PACKAGE_ID}::coin::mint`,
    typeArguments: [tokenType],
    arguments: [treasuryCap, amount.toString()],
  });
  txBuilder.tx.transferObjects([coin], txBuilder.tx.pure.address(sender));
  return coin;
}

export async function mintTokenAsDistributor(
  txBuilder: TxBuilder,
  chainConfig: SuiChainConfig,
  tokenType: string,
  tokenId: string | TransactionResult,
  channelId: string,
  amount: bigint,
  sender: string
) {
  const { InterchainTokenService: ITS } = chainConfig.config.contracts;

  const TokenId =
    typeof tokenId === "string"
      ? await getTokenId(txBuilder, tokenId, ITS)
      : tokenId;

  const [Coin] = await txBuilder.moveCall({
    target: `${ITS.address}::interchain_token_service::mint_as_distributor`,
    typeArguments: [tokenType],
    arguments: [
      ITS.objects.InterchainTokenService,
      channelId,
      TokenId,
      amount.toString(),
    ],
  });

  txBuilder.tx.transferObjects([Coin], txBuilder.tx.pure.address(sender));

  return Coin;
}

export async function deployRemoteInterchainToken(
  txBuilder: TxBuilder,
  chainConfig: SuiChainConfig,
  destinationChain: string,
  tokenId: any,
  feeUnitAmount: number,
  sender: string,
  coinType: string
) {
  const {
    InterchainTokenService: ITS,
    AxelarGateway,
    GasService,
  } = chainConfig.config.contracts;
  // Split coins for gas fee
  const gas = txBuilder.tx.splitCoins(txBuilder.tx.gas, [feeUnitAmount]);

  const messageTicket = await txBuilder.moveCall({
    target: `${ITS.address}::interchain_token_service::deploy_remote_interchain_token`,
    arguments: [ITS.objects.InterchainTokenService, tokenId, destinationChain],
    typeArguments: [coinType],
  });
  await txBuilder.moveCall({
    target: `${GasService.address}::gas_service::pay_gas`,
    typeArguments: [SUI_TYPE_ARG],
    arguments: [
      GasService.objects.GasService,
      messageTicket,
      gas,
      sender,
      "0x",
    ],
  });
  await txBuilder.moveCall({
    target: `${AxelarGateway.address}::gateway::send_message`,
    arguments: [AxelarGateway.objects.Gateway, messageTicket],
  });
}
