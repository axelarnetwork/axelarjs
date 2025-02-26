import { TxBuilder } from "@axelar-network/axelar-cgp-sui";
import {
  SuiClient,
  SuiObjectChange,
  SuiObjectResponse,
  type DynamicFieldInfo,
  type DynamicFieldPage,
  type PaginatedTransactionResponse,
} from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";

import { suiClient as client } from "~/lib/clients/suiClient";

export const suiServiceBaseUrl =
  "https://melted-fayth-nptytn-57e5d396.koyeb.app";
export const findPublishedObject = (objectChanges: SuiObjectChange[]) => {
  return objectChanges.find((change) => change.type === "published");
};

export const getObjectIdsByObjectTypes = (
  objectChanges: SuiObjectChange[],
  objectTypes: string[]
) => {
  return objectTypes.map((objectType) => {
    const createdObjects = objectChanges.filter(
      (change) => change.type === "created"
    );

    const objectId = createdObjects.find((change) =>
      change.objectType?.includes(objectType)
    )?.objectId;

    if (!objectId) {
      throw new Error(`No object found for type: ${objectType}`);
    }

    return objectId;
  });
};

export async function buildTx(walletAddress: string, txBuilder: TxBuilder) {
  txBuilder.tx.setSender(walletAddress);

  const txBytes = await txBuilder.tx.build({
    client: txBuilder.client,
  });

  return Transaction.from(txBytes);
}

// get coin type from token address
export const getCoinType = async (tokenAddress: string) => {
  const modules = await client.getNormalizedMoveModulesByPackage({
    package: tokenAddress,
  });
  const coinSymbol = Object.keys(modules)[0];
  const coinType = `${tokenAddress}::${coinSymbol?.toLowerCase()}::${coinSymbol?.toUpperCase()}`;
  return coinType;
};

// get token owner from token address
// TODO: this is wrong the the destination chain is sui where the token owner is axelar relayer
export const getTokenOwner = async (tokenAddress: string) => {
  const treasuryCap = await getTreasuryCap(tokenAddress);
  const object = await client.getObject({
    id: treasuryCap as string,
    options: {
      showOwner: true,
      showPreviousTransaction: true,
    },
  });

  const owner = object?.data?.owner as { AddressOwner: string } | undefined;
  return owner?.AddressOwner;
};

export const getCoinAddressFromType = (coinType: string) => {
  // check for long format
  let addressMatch = coinType.match(/CoinData<(0x[^:]+)/);
  if (addressMatch) return addressMatch?.[1];
  // check for the shorter format {address}::{symbol}::{SYMBOL}
  addressMatch = coinType.match(/0x[^:]+/);
  return addressMatch?.[0] as string;
};

function findTreasuryCap(txData: PaginatedTransactionResponse) {
  for (const tx of txData.data) {
    if (tx.objectChanges) {
      for (const obj of tx.objectChanges) {
        if (obj.type === "created" && obj.objectType.includes("TreasuryCap")) {
          return obj.objectId;
        }
      }
    }
  }

  return null;
}

export const getTreasuryCap = async (tokenAddress: string) => {
  let cursor: string | null | undefined = null;
  let txs: PaginatedTransactionResponse | null;
  let treasuryCap: string | null = null;

  do {
    txs = await client.queryTransactionBlocks({
      filter: {
        ChangedObject: tokenAddress,
      },
      cursor,
      options: {
        showObjectChanges: true,
      },
    });
    treasuryCap = findTreasuryCap(txs);
    cursor = txs.nextCursor;
  } while (txs.hasNextPage && !treasuryCap && cursor);
  return treasuryCap;
};

export const getCoinAddressAndManagerByTokenId = async (input: {
  tokenId: string;
}) => {
  try {
    const response = await fetch(`${suiServiceBaseUrl}/chain/devnet-amplifier`);
    const _chainConfig = await response.json();
    const chainConfig = _chainConfig.chains.sui;

    const registeredCoinsObject = await client.getObject({
      id: chainConfig.contracts.ITS.objects.ITSv0,
      options: {
        showStorageRebate: true,
        showContent: true,
      },
    });

    const registeredCoinsBagId = (registeredCoinsObject.data?.content as any)
      ?.fields?.value?.fields.registered_coins.fields.id.id as string;

    const filteredResult = await findInPaginatedDynamicFields(
      client,
      registeredCoinsBagId,
      (item: any) =>
        item.name.value.id.toString().toLowerCase() ===
        input.tokenId.toLowerCase()
    );

    if (filteredResult) {
      return extractTokenDetails(filteredResult);
    } else {
      console.log("getCoinAddressAndManagerByTokenId: Token ID not found.");
      return null;
    }
  } catch (error) {
    console.error("Failed to get token address:", error);
    throw new Error(
      `Failed to retrieve token address: ${(error as Error).message}`
    );
  }
};

export const getCoinInfoByCoinType = async (
  client: SuiClient,
  coinType: string
) => {
  try {
    const response = await fetch(`${suiServiceBaseUrl}/chain/devnet-amplifier`);
    const _chainConfig = await response.json();
    const chainConfig = _chainConfig.chains.sui;

    const registeredCoinsObject = await client.getObject({
      id: chainConfig.contracts.ITS.objects.ITSv0,
      options: {
        showStorageRebate: true,
        showContent: true,
      },
    });
    const registeredCoinsBagId = (registeredCoinsObject.data?.content as any)
      ?.fields?.value?.fields.registered_coins.fields.id.id as string;

    const filteredResult = await findInPaginatedDynamicFields(
      client,
      registeredCoinsBagId,
      (item: any) => item.objectType.includes(coinType)
    );

    if (filteredResult) {
      const coin = await client.getObject({
        id: filteredResult?.objectId,
        options: {
          showContent: true,
        },
      });
      return extractCoinInfo(coin);
    } else {
      console.log("Token not found.");
      return null;
    }
  } catch (error) {
    console.error("Failed to get token address:", error);
    throw new Error(
      `Failed to retrieve token address: ${(error as Error).message}`
    );
  }
};

export async function findInPaginatedDynamicFields(
  suiClient: SuiClient,
  parentId: string,
  filterFn: (item: DynamicFieldInfo) => boolean
): Promise<DynamicFieldInfo | null> {
  let cursor: string | null = null;
  let result: DynamicFieldPage | null;
  let filteredResult: DynamicFieldInfo[] = [];

  do {
    result = await suiClient
      .getDynamicFields({
        parentId,
        cursor: cursor,
      })
      .catch((error) => {
        console.error("Failed to get dynamic fields:", error);
        return null;
      });
    cursor = result?.nextCursor ?? null;
    filteredResult = result?.data?.filter(filterFn) ?? [];
  } while (result?.hasNextPage && !filteredResult?.length);
  return filteredResult?.length ? filteredResult[0] : null;
}

function extractTokenDetails(filteredResult: DynamicFieldInfo) {
  // Extract the token manager (objectId)
  const tokenManager = filteredResult.objectId;

  // Extract the address from the objectType
  const objectType = filteredResult.objectType;
  const address = getCoinAddressFromType(objectType);
  return {
    tokenManager,
    address,
  };
}

function extractCoinInfo(coin: SuiObjectResponse) {
  const content = coin.data?.content as any;
  const fields = content?.fields?.value?.fields;
  const coinInfo = fields?.coin_info.fields;
  const coinManagement = fields?.coin_management.fields;

  return {
    decimals: coinInfo.decimals,
    name: coinInfo.name,
    symbol: coinInfo.symbol,
    totalSupply: coinManagement.treasury_cap.fields.total_supply.fields.value,
    treasuryCap: coinManagement.treasury_cap.fields.id.id,
  };
}
