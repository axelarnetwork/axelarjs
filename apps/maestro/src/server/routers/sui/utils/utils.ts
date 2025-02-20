import { TxBuilder } from "@axelar-network/axelar-cgp-sui";
import {
  SuiClient,
  SuiObjectChange,
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
export const getTokenOwner = async (tokenAddress: string) => {
  const object = await client.getObject({
    id: tokenAddress,
    options: {
      showOwner: true,
      showPreviousTransaction: true,
    },
  });

  if (object?.data?.owner === "Immutable") {
    const previousTx = object.data.previousTransaction;

    // Fetch the transaction details to find the sender
    const transactionDetails = await client.getTransactionBlock({
      digest: previousTx as string,
      options: { showInput: true, showEffects: true },
    });
    return transactionDetails.transaction?.data.sender;
  } else {
    throw new Error("Coin owner not found");
  }
};

function findTreasuryCap(txData: PaginatedTransactionResponse) {
  // Find the mint transaction
  const mintTx = txData.data.find((tx) => {
    const transactions = (tx.transaction?.data?.transaction as any)
      .transactions;
    return transactions?.some(
      (t: any) =>
        t.MoveCall?.module === "coin" && t.MoveCall?.function === "mint"
    );
  });

  if (!mintTx) {
    console.log("No mint transaction found");
    return null;
  }

  // Get the treasury cap input from the mint transaction
  const treasuryCapInput = (mintTx?.transaction?.data?.transaction as any)
    .inputs[0];

  if (treasuryCapInput?.type === "object") {
    return treasuryCapInput.objectId;
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
        InputObject: tokenAddress,
      },
      cursor: cursor,
      options: {
        showInput: true,
        showEffects: true,
        showEvents: true,
      },
    });
    console.log("txs", txs);
    treasuryCap = await findTreasuryCap(txs);
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
  const addressMatch = objectType.match(/CoinData<(0x[^:]+)/);
  const address = addressMatch?.[1] as string;
  return {
    tokenManager,
    address,
  };
}
