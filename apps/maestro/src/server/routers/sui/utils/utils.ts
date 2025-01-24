import { TxBuilder } from "@axelar-network/axelar-cgp-sui";
import { getFullnodeUrl, SuiClient, SuiObjectChange } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";

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
  const client = new SuiClient({ url: getFullnodeUrl("testnet") }); // TODO: make this configurable
  const modules = await client.getNormalizedMoveModulesByPackage({
    package: tokenAddress,
  });
  const coinSymbol = Object.keys(modules)[0];
  const coinType = `${tokenAddress}::${coinSymbol?.toLowerCase()}::${coinSymbol?.toUpperCase()}`;
  return coinType;
};

// get token owner from token address
export const getTokenOwner = async (tokenAddress: string) => {
  const client = new SuiClient({ url: getFullnodeUrl("testnet") }); // TODO: make this configurable
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
