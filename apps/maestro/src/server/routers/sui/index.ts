import {
  CLOCK_PACKAGE_ID,
  SUI_PACKAGE_ID,
  TxBuilder,
} from "@axelar-network/axelar-cgp-sui";
import { SuiClient } from "@mysten/sui/client";
import { z } from "zod";

import { publicProcedure, router } from "~/server/trpc";
import { SUI_RPC_URLS } from '@axelarjs/core'
import { buildTx, suiServiceBaseUrl } from "./utils/utils";
import { NEXT_PUBLIC_NETWORK_ENV } from "~/config/env";

// Initialize SuiClient directly with RPC from config
export const suiClient = new SuiClient({
  url: SUI_RPC_URLS[NEXT_PUBLIC_NETWORK_ENV],
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
      })
    )
    .mutation(async ({ input }) => {
      try {
        //TODO: use chain config from ui
        const response = await fetch(
          `${suiServiceBaseUrl}/chain/devnet-amplifier`
        );
        const _chainConfig = await response.json();
        const chainConfig = _chainConfig.chains.sui;
        const {
          sender,
          symbol,
          tokenPackageId,
          metadataId,
          destinationChains,
        } = input;

        const tokenType = `${tokenPackageId}::${symbol.toLowerCase()}::${symbol.toUpperCase()}`;

        const txBuilder = new TxBuilder(suiClient);

        txBuilder.tx.setSenderIfNotSet(sender);
        const examplePackageId = chainConfig.contracts.Example.address;
        const feeUnitAmount = 5e7;
        const ITS = chainConfig.contracts.ITS;
        const Example = chainConfig.contracts.Example;
        const AxelarGateway = chainConfig.contracts.AxelarGateway;
        const GasService = chainConfig.contracts.GasService;

        const itsObjectId = ITS.objects.ITS;

        // const trustedDestinationChains = Object.keys(ITS.trustedAddresses);
        // for (const destinationChain of destinationChains) {
        //   if (!trustedDestinationChains.includes(destinationChain)) {
        //     console.log(`destination chain ${destinationChain} not trusted`);
        //     return undefined;
        //   }
        // }

        const coinMetadata = await suiClient.getCoinMetadata({
          coinType: tokenType,
        });

        if (!coinMetadata) {
          return undefined;
        }

        // TODO: handle register type properly, whether it's mint/burn or lock/unlock.
        await txBuilder.moveCall({
          target: `${examplePackageId}::its::register_coin`,
          typeArguments: [tokenType],
          arguments: [itsObjectId, metadataId],
        });

        for (const destinationChain of destinationChains) {
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

          const gas = txBuilder.tx.splitCoins(txBuilder.tx.gas, [
            feeUnitAmount,
          ]);

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

        const txBuilder = new TxBuilder(suiClient);
        const tx = txBuilder.tx;

        // Split coins for gas
        const Gas = tx.splitCoins(tx.gas, [BigInt(input.gas)]);

        const coins = await suiClient.getCoins({
          owner: input.sender,
          coinType: input.coinType,
        });
        const coinObjectId = coins.data[0].coinObjectId;

        // Split token to transfer to the destination chain
        const Coin = tx.splitCoins(coinObjectId, [BigInt(input.amount)]);

        const [TokenId] = await txBuilder.moveCall({
          target: `${chainConfig.contracts.ITS.address}::token_id::from_u256`,
          arguments: [input.tokenId],
        });

        await txBuilder.moveCall({
          target: `${chainConfig.contracts.Example.address}::its::send_interchain_transfer_call`,
          arguments: [
            chainConfig.contracts.Example.objects.ItsSingleton,
            chainConfig.contracts.ITS.objects.ITS,
            chainConfig.contracts.AxelarGateway.objects.Gateway,
            chainConfig.contracts.GasService.objects.GasService,
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
});
