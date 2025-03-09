import { SUI_PACKAGE_ID, TxBuilder } from "@axelar-network/axelar-cgp-sui";
import { keccak256, stringToHex } from "viem";

import { suiClient } from "~/lib/clients/suiClient";

export async function getChainConfig() {
  // TODO: fix this to use chain configs from the s3 instead of the hardcoded url
  const response = await fetch(`https://static.npty.online/axelar/devnet-amplifier-config-1.0.x.json`);
  const _chainConfig = await response.json();
  return _chainConfig.chains['sui-2'];
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
  coinMetadata: any,
  suiChainConfig: any,
  isCanonical: boolean = false
) {
  const { InterchainTokenService: ITS, AxelarGateway } = suiChainConfig.contracts;
  const suiChainId = suiChainConfig.axelarId
  const [ChainNameHash] = await txBuilder.moveCall({
    target: `${AxelarGateway.address}::bytes32::from_bytes`,
    arguments: [
      keccak256(stringToHex(suiChainId)),
    ],
  });
  const [TokenId] = await txBuilder.moveCall({
    target: `${ITS.address}::token_id::from_info`,
    typeArguments: [coinType],
    arguments: [
      ChainNameHash,
      coinMetadata.name,
      coinMetadata.symbol,
      txBuilder.tx.pure.u8(coinMetadata.decimals),
      txBuilder.tx.pure.bool(false),
      txBuilder.tx.pure.bool(!isCanonical), // true for mint_burn, false for lock_unlock as this checks whether an address owns the treasury cap
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

export async function deployRemoteInterchainToken(
  txBuilder: TxBuilder,
  chainConfig: any,
  destinationChain: string,
  coinMetadata: any,
  feeUnitAmount: number,
  sender: string,
  tokenType: string
) {
  const { Example, InterchainTokenService: ITS, AxelarGateway, GasService } = chainConfig.contracts;
  const gas = txBuilder.tx.splitCoins(txBuilder.tx.gas, [feeUnitAmount]);

  const TokenId = await getTokenIdByCoinMetadata(
    txBuilder,
    tokenType,
    coinMetadata,
    chainConfig,
  );

  await txBuilder.moveCall({
    target: `${Example.address}::its::deploy_remote_interchain_token`,
    arguments: [
      ITS.objects.InterchainTokenService,
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

export async function registerToken(
  txBuilder: TxBuilder,
  chainConfig: any,
  tokenType: string,
  metadataId: string,
  treasuryCap: any,
  minterAddress?: string,
  isCanonical: boolean = false
) {
  const { Example, InterchainTokenService: ITS } = chainConfig.contracts;
  const itsObjectId = ITS.objects.InterchainTokenService;

  if (isCanonical) {
    // Register coin and transfer cap to minter
    await txBuilder.moveCall({
      target: `${Example.address}::its::register_coin`,
      typeArguments: [tokenType],
      arguments: [itsObjectId, metadataId],
    });

    if(minterAddress) {
      txBuilder.tx.transferObjects(
        [treasuryCap as string],
        txBuilder.tx.pure.address(minterAddress)
      );
    }
  } else {
    // Register with cap
    await txBuilder.moveCall({
      target: `${Example.address}::its::register_coin_with_cap`,
      typeArguments: [tokenType],
      arguments: [itsObjectId, metadataId, treasuryCap],
    });
  }
}
