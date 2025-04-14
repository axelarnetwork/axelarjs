import { SuiChainConfig } from "@axelarjs/api";

import { TxBuilder } from "@axelar-network/axelar-cgp-sui";
import {
  SuiClient,
  SuiEvent,
  SuiObjectResponse,
  SuiTransactionBlockResponse,
  type DynamicFieldInfo,
  type DynamicFieldPage,
  type PaginatedCoins,
  type PaginatedTransactionResponse,
  type SuiObjectChange,
} from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";

import { suiChainConfig } from "~/config/chains";
import { SUI_SERVICE } from "~/config/env";
import { suiClient as client, suiClient } from "~/lib/clients/suiClient";
import { isValidSuiTokenAddress } from "~/lib/utils/validation";
import type { Context } from "~/server/context";
import { CoinMetadata, queryCoinMetadata } from "../graphql";

export const suiServiceBaseUrl = SUI_SERVICE;

export const getSuiChainConfig = async (
  ctx: Context
): Promise<SuiChainConfig> => {
  const chainConfigs = await ctx.configs.axelarConfigs();
  const chainConfig = chainConfigs.chains[suiChainConfig.axelarChainId];

  if (chainConfig.chainType !== "sui") {
    throw new Error("Invalid chain config");
  }

  return chainConfig;
};

export type SuiObjectCreated =
  | Extract<SuiObjectChange, { type: "created" }>
  | undefined;

export const findCoinDataObject = (
  registerTokenResult: SuiTransactionBlockResponse
) => {
  return (
    registerTokenResult?.objectChanges?.find(
      (change) =>
        change.type === "created" && change.objectType.includes("coin_data")
    ) as SuiObjectCreated
  )?.objectId;
};

export const findObjectByType = (
  objectChanges: SuiObjectChange[],
  type: string
): SuiObjectCreated => {
  return objectChanges.find(
    (change) => change.type === "created" && change.objectType.includes(type)
  ) as SuiObjectCreated;
};

export const findPublishedObject = (objectChanges: SuiObjectChange[]) => {
  return objectChanges.find((change) => change.type === "published");
};

export const findGatewayEventIndex = (events: SuiEvent[]) => {
  return events.findIndex((event) => event.transactionModule === "gateway");
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

export const getPackageIdFromSuiTokenAddress = (tokenAddress: string) => {
  if (isValidSuiTokenAddress(tokenAddress)) {
    return tokenAddress.split("::")[0];
  }
  return tokenAddress;
};

/**
 * Retrieves coin metadata with retry logic.
 * @param coinType The coin type string.
 * @param maxAttempts Maximum number of retry attempts.
 * @param delayMs Delay between retries in milliseconds.
 * @returns The coin metadata.
 * @throws Error if metadata is not found after retries.
 */
export async function getCoinMetadataWithRetry(
  coinType: string,
  maxAttempts = 5,
  delayMs = 300
): Promise<CoinMetadata> {
  let coinMetadata: CoinMetadata | null = null;
  let attempts = 0;

  while (!coinMetadata && attempts < maxAttempts) {
    attempts++;

    try {
      coinMetadata = await queryCoinMetadata(coinType);
    } catch {
      console.debug("Failed to get coin metadata:", coinType);
    }

    if (!coinMetadata && attempts < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  if (!coinMetadata) {
    throw new Error(
      `Failed to get coin metadata for ${coinType} after ${maxAttempts} attempts.`
    );
  }

  return coinMetadata;
}

/**
 * Normalizes a Sui token address string to the format 0x<PACKAGE_ID>::<module_name>::<STRUCT_NAME>.
 * It ensures the module name is lowercase and the struct name is uppercase.
 * If the input string does not match the expected format, it's returned unchanged.
 *
 * @param tokenAddress The Sui token address string to normalize.
 * @returns The normalized token address string or the original string if normalization is not applicable.
 */
export const normalizeSuiTokenAddress = (tokenAddress: string): string => {
  if (!isValidSuiTokenAddress(tokenAddress)) {
    // Return original if it doesn't match the basic structure
    return tokenAddress;
  }

  const parts = tokenAddress.split("::");

  if (parts.length === 3) {
    const [packageId, moduleName, structName] = parts;
    return `${packageId}::${moduleName.toLowerCase()}::${structName.toUpperCase()}`;
  }

  // Fallback: return original if splitting didn't yield 3 parts (unexpected)
  return tokenAddress;
};

export const getCoinAddressFromType = (
  coinType: string,
  prefix: string = "CoinData"
) => {
  // check for long format
  let addressMatch = coinType.match(new RegExp(`${prefix}<(0x[^:]+)`));
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

export const getTreasuryCap = async (coinType: string) => {
  let cursor: string | null | undefined = null;
  let txs: PaginatedTransactionResponse | null;
  let treasuryCap: string | null = null;
  const address = getCoinAddressFromType(coinType);
  do {
    txs = await client.queryTransactionBlocks({
      filter: {
        ChangedObject: address,
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
  suiChainConfig: SuiChainConfig;
}) => {
  try {
    const { suiChainConfig } = input;

    const registeredCoinsObject = await client.getObject({
      id: suiChainConfig.config.contracts.InterchainTokenService.objects
        .InterchainTokenServicev0,
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

export const getSuiEventsByTxHash = async (
  suiClient: SuiClient,
  txHash: string
) => {
  const eventData = await suiClient
    .queryEvents({
      query: {
        Transaction: txHash,
      },
    })
    .catch(() => null);

  return eventData;
};

export const getCoinInfoByCoinType = async (
  client: SuiClient,
  coinType: string,
  ITSv0: string
) => {
  try {
    const registeredCoinsObject = await client.getObject({
      id: ITSv0,
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
      return await extractCoinInfo(coin);
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
  const tokenAddress = objectType.match(/<([^>]+)>/)?.at(1) as string;
  return {
    tokenManager,
    tokenAddress,
  };
}

async function extractCoinInfo(coin: SuiObjectResponse) {
  const content = coin.data?.content as any;
  const fields = content?.fields?.value?.fields;
  const coinInfo = fields?.coin_info.fields;
  const coinManagement = fields?.coin_management.fields;

  const operator = coinManagement.operator as string | undefined;
  const distributorChannelId = coinManagement.distributor;
  let distributor = null;

  if (distributorChannelId) {
    const channalDetails = await suiClient.getObject({
      id: distributorChannelId,
      options: {
        showOwner: true,
      },
    });

    distributor = (channalDetails.data?.owner as { AddressOwner?: string })
      ?.AddressOwner;
  }

  return {
    decimals: coinInfo.decimals,
    name: coinInfo.name,
    symbol: coinInfo.symbol,
    operator,
    distributor,
    totalSupply:
      coinManagement?.treasury_cap?.fields?.total_supply?.fields?.value,
    treasuryCap: coinManagement?.treasury_cap?.fields?.id?.id,
  };
}

export const getChannelId = async (
  sender: string,
  chainConfig: SuiChainConfig
) => {
  const { AxelarGateway } = chainConfig.config.contracts;
  const ownedObjects = await suiClient.getOwnedObjects({
    owner: sender,
    filter: {
      MoveModule: { module: "channel", package: AxelarGateway.address },
    },
  });

  const channelObjects = ownedObjects.data.map((channel) => channel.data);
  const lastChannel = channelObjects[channelObjects.length - 1];
  const channelId = lastChannel?.objectId;

  return channelId;
};

export async function mergeAllCoinsOfSameType(
  txBuilder: TxBuilder,
  owner: string,
  coinType: string
): Promise<string> {
  const tx = txBuilder.tx;

  // Get all coins of the specified type
  let primaryCoin: string = "";
  let coins: PaginatedCoins;
  let otherCoins: string[] = [];
  let cursor: string | null | undefined;

  do {
    coins = await suiClient.getCoins({
      cursor: cursor,
      owner: owner,
      coinType: coinType,
    });

    if (coins.data.length === 0) {
      throw new Error(`No coins of type ${coinType} found for ${owner}`);
    }

    // If there are multiple coins, merge them first
    if (!primaryCoin) {
      const [first, ...rest] = coins.data;
      primaryCoin = first.coinObjectId;
      otherCoins = [
        ...otherCoins,
        ...rest.map((coin: any) => coin.coinObjectId),
      ];
    } else {
      otherCoins = [
        ...otherCoins,
        ...coins.data.map((coin: any) => coin.coinObjectId),
      ];
    }

    cursor = coins.nextCursor;
  } while (coins.hasNextPage);

  // Merge coins if needed
  if (otherCoins.length > 0) {
    tx.mergeCoins(primaryCoin, otherCoins);
  }

  return primaryCoin;
}
