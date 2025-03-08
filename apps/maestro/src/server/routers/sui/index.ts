import {
  CLOCK_PACKAGE_ID,
  SUI_PACKAGE_ID,
  TxBuilder,
} from "@axelar-network/axelar-cgp-sui";
import type { PaginatedCoins } from "@mysten/sui/client";
import { z } from "zod";

import { NEXT_PUBLIC_NETWORK_ENV } from "~/config/env";
import { suiClient } from "~/lib/clients/suiClient";
import { publicProcedure, router } from "~/server/trpc";
import {
  deployRemoteInterchainToken,
  getChainConfig,
  getTokenId,
  mintToken,
  registerToken,
  setupTxBuilder,
} from "./utils/txUtils";
import { buildTx, getTreasuryCap, suiServiceBaseUrl } from "./utils/utils";

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
        const response = await fetch(`${suiServiceBaseUrl}/deploy-token`, {
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
        });

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

  getRegisterAndDeployTokenTx: publicProcedure
    .input(
      z.object({
        sender: z.string(),
        symbol: z.string(),
        destinationChains: z.array(z.string()),
        tokenPackageId: z.string(),
        metadataId: z.string(),
        minterAddress: z.string().optional(),
        gasValues: z.array(z.bigint()),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const chainConfig = await getChainConfig();
        const {
          sender,
          symbol,
          tokenPackageId,
          metadataId,
          destinationChains,
          gasValues,
        } = input;

        const tokenType = `${tokenPackageId}::${symbol.toLowerCase()}::${symbol.toUpperCase()}`;
        const { txBuilder } = setupTxBuilder(sender);

        const coinMetadata = await suiClient.getCoinMetadata({
          coinType: tokenType,
        });

        if (!coinMetadata) {
          return undefined;
        }

        const { Example, ITS } = chainConfig.contracts;
        const itsObjectId = ITS.objects.ITS;
        const treasuryCap = await getTreasuryCap(tokenPackageId);

        if (input.minterAddress) {
          await txBuilder.moveCall({
            target: `${Example.address}::its::register_coin`,
            typeArguments: [tokenType],
            arguments: [itsObjectId, metadataId],
          });
          txBuilder.tx.transferObjects(
            [treasuryCap as string],
            txBuilder.tx.pure.address(input.minterAddress)
          );
        } else {
          await txBuilder
            .moveCall({
              target: `${Example.address}::its::register_coin_with_cap`,
              typeArguments: [tokenType],
              arguments: [itsObjectId, metadataId, treasuryCap],
            })
            .catch((e) => console.log("error with register coin treasury", e));
        }

        for (let i = 0; i < destinationChains.length; i++) {
          await deployRemoteInterchainToken(
            txBuilder,
            chainConfig,
            destinationChains[i],
            coinMetadata,
            Number(gasValues[i]),
            sender,
            tokenType
          );
        }

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

  getMintTx: publicProcedure
    .input(
      z.object({
        sender: z.string(),
        tokenTreasuryCap: z.string(),
        amount: z.bigint(),
        tokenPackageId: z.string(),
        symbol: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { sender, tokenTreasuryCap, amount, tokenPackageId, symbol } =
        input;
      const tokenType = `${tokenPackageId}::${symbol.toLowerCase()}::${symbol.toUpperCase()}`;

      const txBuilder = new TxBuilder(suiClient);
      const [coin] = await txBuilder.moveCall({
        target: `${SUI_PACKAGE_ID}::coin::mint`,
        typeArguments: [tokenType],
        arguments: [tokenTreasuryCap, amount.toString()],
      });
      txBuilder.tx.transferObjects([coin], txBuilder.tx.pure.address(sender));

      const tx = await buildTx(sender, txBuilder);
      const txJSON = await tx.toJSON();
      return txJSON;
    }),

  getSendTokenTx: publicProcedure
    .input(
      z.object({
        sender: z.string(),
        tokenId: z.string(),
        tokenAddress: z.string(),
        amount: z.string(),
        destinationChain: z.string(),
        destinationAddress: z.string(),
        gas: z.string(),
        coinType: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const response = await fetch(
          `${suiServiceBaseUrl}/chain/devnet-amplifier`
        );
        const _chainConfig = await response.json();
        const chainConfig = _chainConfig.chains.sui;

        const { txBuilder } = setupTxBuilder(input.sender);
        const tx = txBuilder.tx;

        // Split coins for gas
        const Gas = tx.splitCoins(tx.gas, [BigInt(input.gas)]);

        // Get all coins of the specified type
        let primaryCoin: string = "";
        let coins: PaginatedCoins;
        let otherCoins: string[] = [];
        let cursor: string | null | undefined;

        do {
          coins = await suiClient.getCoins({
            cursor: cursor,
            owner: input.sender,
            coinType: input.coinType,
          });

          if (coins.data.length === 0) {
            throw new Error("No coins found");
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

        // TODO: checks if this work properly. I'll comment mergeCoins for now
        // if (otherCoins.length > 0) {
        //   tx.mergeCoins(primaryCoin, otherCoins);
        // }

        // Split token to transfer to the destination chain
        const Coin = tx.splitCoins(primaryCoin, [BigInt(input.amount)]);

        const { Example, AxelarGateway, GasService, ITS } =
          chainConfig.contracts;

        const TokenId = await getTokenId(txBuilder, input.tokenId, ITS);

        await txBuilder.moveCall({
          target: `${Example.address}::its::send_interchain_transfer_call`,
          arguments: [
            Example.objects.ItsSingleton,
            ITS.objects.ITS,
            AxelarGateway.objects.Gateway,
            GasService.objects.GasService,
            TokenId,
            Coin,
            input.destinationChain,
            input.destinationAddress,
            "0x",
            input.sender,
            Gas,
            "0x",
            CLOCK_PACKAGE_ID,
          ],
          typeArguments: [input.coinType],
        });

        const tx2 = await buildTx(input.sender, txBuilder);
        const txJSON = await tx2.toJSON();
        return txJSON;
      } catch (error) {
        console.error("Failed to prepare send token transaction:", error);
        throw new Error(
          `Send token transaction preparation failed: ${(error as Error).message}`
        );
      }
    }),

  getRegisterRemoteInterchainTokenTx: publicProcedure
    .input(
      z.object({
        tokenAddress: z.string(),
        destinationChainIds: z.array(z.string()),
        originChainId: z.number(),
        sender: z.string(),
        symbol: z.string(),
        gasValues: z.array(z.bigint()),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const response = await fetch(
          `${suiServiceBaseUrl}/chain/${NEXT_PUBLIC_NETWORK_ENV}`
        );
        const _chainConfig = await response.json();
        const chainConfig = _chainConfig.chains.sui;
        const { sender, symbol, tokenAddress, destinationChainIds, gasValues } =
          input;

        const txBuilder = new TxBuilder(suiClient);

        txBuilder.tx.setSenderIfNotSet(sender);

        const tokenType = `${tokenAddress}::${symbol.toLowerCase()}::${symbol.toUpperCase()}`;

        const coinMetadata = await suiClient.getCoinMetadata({
          coinType: tokenType,
        });

        if (!coinMetadata) {
          throw new Error(`Coin metadata not found for ${tokenType}`);
        }

        for (let i = 0; i < destinationChainIds.length; i++) {
          const destinationChain = destinationChainIds[i];
          await deployRemoteInterchainToken(
            txBuilder,
            chainConfig,
            destinationChain,
            coinMetadata,
            Number(gasValues[i]),
            sender,
            tokenType
          );
        }

        const tx = await buildTx(sender, txBuilder);
        const txJSON = await tx.toJSON();
        return txJSON;
      } catch (error) {
        console.error(
          "Failed to prepare register remote token transaction:",
          error
        );
        throw new Error(
          `Register remote token transaction preparation failed: ${
            (error as Error).message
          }`
        );
      }
    }),

  getTransferTreasuryCapTx: publicProcedure
    .input(
      z.object({
        sender: z.string(),
        tokenAddress: z.string(),
        recipientAddress: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const { sender, tokenAddress, recipientAddress } = input;
        const treasuryCap = await getTreasuryCap(tokenAddress);
        if (!treasuryCap) {
          throw new Error("Treasury cap not found");
        }

        const txBuilder = new TxBuilder(suiClient);

        const tx = await buildTx(sender, txBuilder);
        tx.transferObjects([treasuryCap], tx.pure.address(recipientAddress));
        const txJSON = await tx.toJSON();
        return txJSON;
      } catch (error) {
        console.error(
          "Failed to prepare transfer treasury cap transaction:",
          error
        );
        throw new Error(
          `Transfer treasury cap transaction preparation failed: ${
            (error as Error).message
          }`
        );
      }
    }),
  getMintAndRegisterAndDeployTokenTx: publicProcedure
    .input(
      z.object({
        sender: z.string(),
        symbol: z.string(),
        tokenPackageId: z.string(),
        metadataId: z.string(),
        destinationChains: z.array(z.string()),
        amount: z.bigint(),
        minterAddress: z.string().optional(),
        gasValues: z.array(z.bigint()),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const {
          sender,
          symbol,
          tokenPackageId,
          metadataId,
          destinationChains,
          amount,
          minterAddress,
          gasValues,
        } = input;

        const chainConfig = await getChainConfig();
        const txBuilder = new TxBuilder(suiClient);
        txBuilder.tx.setSenderIfNotSet(sender);

        const tokenType = `${tokenPackageId}::${symbol.toLowerCase()}::${symbol.toUpperCase()}`;

        const coinMetadata = await suiClient.getCoinMetadata({
          coinType: tokenType,
        });

        if (!coinMetadata) {
          throw new Error(`Coin metadata not found for ${tokenType}`);
        }

        const treasuryCap = await getTreasuryCap(tokenPackageId);

        // Mint coins
        await mintToken(txBuilder, tokenType, treasuryCap, amount, sender);

        // Register coin
        await registerToken(
          txBuilder,
          chainConfig,
          tokenType,
          metadataId,
          treasuryCap,
          minterAddress
        );

        for (let i = 0; i < destinationChains.length; i++) {
          await deployRemoteInterchainToken(
            txBuilder,
            chainConfig,
            destinationChains[i],
            coinMetadata,
            Number(gasValues[i]),
            sender,
            tokenType
          );
        }

        const tx = await buildTx(sender, txBuilder);
        const txJSON = await tx.toJSON();
        return txJSON;
      } catch (error) {
        console.error(
          "Failed to finalize combined mint and deployment:",
          error
        );
        throw new Error(
          `Combined mint, register, and deploy failed: ${
            (error as Error).message
          }`
        );
      }
    }),
});
