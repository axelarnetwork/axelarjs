import { TxBuilder } from "@axelar-network/axelar-cgp-sui";
import { CoinMetadata } from "@mysten/sui/client";

import { suiClient } from "~/lib/clients/suiClient";
import { suiServiceBaseUrl } from "./utils";

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
  tokenType: string,
  ITS: any,
  coinMetadata: CoinMetadata
) {
  const [TokenId] = await txBuilder.moveCall({
    target: `${ITS.address}::token_id::from_info`,
    typeArguments: [tokenType],
    arguments: [
      coinMetadata.name,
      coinMetadata.symbol,
      txBuilder.tx.pure.u8(coinMetadata.decimals),
      txBuilder.tx.pure.bool(false),
      txBuilder.tx.pure.bool(false),
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

  const TokenId = await getTokenId(txBuilder, tokenType, ITS, coinMetadata);

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
