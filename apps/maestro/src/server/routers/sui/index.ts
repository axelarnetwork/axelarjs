import { TxBuilder } from "@axelar-network/axelar-cgp-sui";
import { SuiClient } from "@mysten/sui/client";
import { z } from "zod";

import { publicProcedure, router } from "~/server/trpc";
import config from "./config/testnet.json";
import {
  buildTx,
  findPublishedObject,
  getObjectIdsByObjectTypes,
} from "./utils/utils";

// Initialize SuiClient directly with RPC from config
const suiClient = new SuiClient({
  url: config.sui.rpc,
});
export const suiRouter = router({
  getDeployTokenTxBytes: publicProcedure
    .input(
      z.object({
        symbol: z.string(),
        name: z.string(),
        decimals: z.number(),
        skipRegister: z.boolean().optional(),
        walletAddress: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const { symbol, name, decimals, walletAddress } = input;
        // TODO: create a service client if we plan to keep this
        const response = await fetch(
          "https://melted-fayth-nptytn-57e5d396.koyeb.app/deploy-token",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              sender: walletAddress,
              name,
              symbol,
              decimals,
            }),
          }
        );

        if (!response.ok) {
          throw new Error(
            `Deploy token request failed: ${response.statusText}`
          );
        }

        const respJSON = await response.json();
        const txBytes = respJSON.data.txBytes;

        return txBytes;
      } catch (error) {
        console.error("Failed to prepare token deployment:", error);
        throw new Error(
          `Token deployment preparation failed: ${(error as Error).message}`
        );
      }
    }),
  getRegisterTokenTx: publicProcedure
    .input(
      z.object({
        sender: z.string(),
        symbol: z.string(),
        transaction: z.any(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        //TODO: use chain config from ui
        const response = await fetch(
          "https://melted-fayth-nptytn-57e5d396.koyeb.app/chain/testnet"
        );
        const { data: chainConfig } = await response.json();
        const { sender, symbol, transaction } = input;

        if (!transaction) return undefined;

        const publishedObject = findPublishedObject(transaction.objectChanges);

        if (!publishedObject) return undefined;

        const packageId = publishedObject?.packageId;
        const tokenType = `${packageId}::${symbol.toLowerCase()}::${symbol.toUpperCase()}`;

        const [Metadata] = getObjectIdsByObjectTypes(
          transaction.objectChanges,
          [`Metadata<${tokenType}>`]
        );

        const txBuilder = new TxBuilder(suiClient);

        txBuilder.tx.setSenderIfNotSet(sender);
        const itsObjectId = chainConfig.contracts.ITS.objects?.ITS;
        const examplePackageId = chainConfig.contracts.Example.address;

        if (!itsObjectId || !examplePackageId) return undefined;

        await txBuilder.moveCall({
          target: `${examplePackageId}::its::register_coin`,
          typeArguments: [tokenType],
          arguments: [itsObjectId, Metadata],
        });
        const tx = await buildTx(sender, txBuilder);
        const txJSON = await tx.toJSON();
        return txJSON;
      } catch (error) {
        console.error("Failed to finalize deployment:", error);
        throw new Error(
          `Deployment finalization failed: ${(error as Error).message}`
        );
      }
    }),

  getSendTokenDeploymentTx: publicProcedure
    .input(
      z.object({
        sender: z.string(),

        symbol: z.string(),
        registerTokenTx: z.any(),
        deployTokenTx: z.any(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const { sender, symbol, registerTokenTx, deployTokenTx } = input;
        //TODO: use chain config from ui
        const response = await fetch(
          "https://melted-fayth-nptytn-57e5d396.koyeb.app/chain/testnet"
        );
        const { data: chainConfig } = await response.json();
        if (!registerTokenTx) return undefined;

        const tokenId = registerTokenTx?.events[0]?.parsedJson?.token_id?.id;
        if (!tokenId) return undefined;

        if (!deployTokenTx) return undefined;

        const publishedObject = findPublishedObject(
          deployTokenTx.objectChanges
        );
        if (!publishedObject) return undefined;

        const packageId = publishedObject?.packageId;
        const tokenType = `${packageId}::${symbol.toLowerCase()}::${symbol.toUpperCase()}`;

        // Fixed fee to 0.05 SUI for now
        const feeUnitAmount = 5e7;
        const ITS = chainConfig.contracts.ITS;
        const Example = chainConfig.contracts.Example;
        const AxelarGateway = chainConfig.contracts.AxelarGateway;
        const GasService = chainConfig.contracts.GasService;

        if (!ITS.trustedAddresses) return undefined;

        const destinationChain = Object.keys(ITS.trustedAddresses)[0];

        if (
          !ITS?.objects ||
          !Example?.objects ||
          !AxelarGateway?.objects ||
          !GasService?.objects
        )
          return undefined;

        if (!destinationChain) return undefined;

        const txBuilder = new TxBuilder(suiClient);
        const tx = txBuilder.tx;
        const gas = tx.splitCoins(tx.gas, [feeUnitAmount]);

        const TokenId = await txBuilder.moveCall({
          target: `${ITS.address}::token_id::from_u256`,
          arguments: [tokenId],
        });

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
        const transaction = await buildTx(sender, txBuilder);
        const txJSON = transaction.toJSON();
        return txJSON;
      } catch (error) {
        console.error("Failed to send token deployment:", error);
        throw new Error(
          `Token deployment send failed: ${(error as Error).message}`
        );
      }
    }),
});
