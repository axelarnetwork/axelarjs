import { TxBuilder } from "@axelar-network/axelar-cgp-sui";

import { suiClient } from "~/lib/clients/suiClient";
import {
  getCoinAddressFromType,
  getTokenOwner,
  suiServiceBaseUrl,
} from "./utils";

export async function getChainConfig() {
  const response = await fetch(`${suiServiceBaseUrl}/chain/devnet-amplifier`);
  const _chainConfig = await response.json();
  return _chainConfig.chains.sui;
}

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
  ITS: any,
  coinMetadata: any
) {
  const address = getCoinAddressFromType(coinType);
  const tokenOwner = await getTokenOwner(address);
  const [TokenId] = await txBuilder.moveCall({
    target: `${ITS.address}::token_id::from_info`,
    typeArguments: [coinType],
    arguments: [
      coinMetadata.name,
      coinMetadata.symbol,
      txBuilder.tx.pure.u8(coinMetadata.decimals),
      txBuilder.tx.pure.bool(false),
      txBuilder.tx.pure.bool(!tokenOwner), // true for mint_burn, false for lock_unlock as this checks whether an address owns the treasury cap
    ],
  });
  return TokenId;
}

export async function deployRemoteInterchainToken(
  txBuilder: TxBuilder,
  chainConfig: any,
  destinationChain: string,
  coinMetadata: any,
  feeUnitAmount: number,
  sender: string,
  tokenType: string
) {
  const { Example, ITS, AxelarGateway, GasService } = chainConfig.contracts;
  const gas = txBuilder.tx.splitCoins(txBuilder.tx.gas, [feeUnitAmount]);

  const TokenId = await getTokenIdByCoinMetadata(
    txBuilder,
    tokenType,
    ITS,
    coinMetadata
  );

  await txBuilder.moveCall({
    target: `${Example.address}::its::deploy_remote_interchain_token`,
    arguments: [
      ITS.objects.ITS,
      AxelarGateway.objects.Gateway,
      GasService.objects.GasService,
      destinationChain,
      TokenId,
      gas,
      "0x",
      sender,
    ],
    typeArguments: [tokenType],
  });
}
