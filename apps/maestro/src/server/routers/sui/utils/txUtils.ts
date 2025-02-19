import { TxBuilder } from "@axelar-network/axelar-cgp-sui";
import { CoinMetadata } from "@mysten/sui/client";

import { suiClient } from "~/lib/clients/suiClient";
import { suiServiceBaseUrl } from "./utils";

export async function getChainConfig() {
  const response = await fetch(`${suiServiceBaseUrl}/chain/devnet-amplifier`);
  const _chainConfig = await response.json();
  return _chainConfig.chains.sui;
}

export function setupTxBuilder(sender: string, chainConfig: any) {
  const txBuilder = new TxBuilder(suiClient);
  txBuilder.tx.setSenderIfNotSet(sender);

  const ITS = chainConfig.contracts.ITS;
  const Example = chainConfig.contracts.Example;
  const AxelarGateway = chainConfig.contracts.AxelarGateway;
  const GasService = chainConfig.contracts.GasService;

  return { txBuilder, ITS, Example, AxelarGateway, GasService };
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
  ITS: any,
  AxelarGateway: any,
  GasService: any,
  Example: any,
  destinationChain: string,
  TokenId: any,
  feeUnitAmount: number,
  sender: string,
  tokenType: string
) {
  const gas = txBuilder.tx.splitCoins(txBuilder.tx.gas, [feeUnitAmount]);

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
