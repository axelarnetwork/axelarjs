import {
  CLOCK_PACKAGE_ID,
  STD_PACKAGE_ID,
  SUI_PACKAGE_ID,
  TxBuilder,
} from "@axelar-network/axelar-cgp-sui";
import { z } from "zod";

import { suiClient } from "~/lib/clients/suiClient";
import { publicProcedure, router } from "~/server/trpc";
import {
  deployRemoteInterchainToken,
  getTokenId,
  getTokenIdByCoinMetadata,
  mintToken,
  mintTokenAsDistributor,
  setupTxBuilder,
} from "./utils/txUtils";
import {
  buildTx,
  getChannelId,
  getSuiChainConfig,
  getTreasuryCap,
  mergeAllCoinsOfSameType,
  suiServiceBaseUrl,
} from "./utils/utils";

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
    .mutation(async ({ input, ctx }) => {
      try {
        const { symbol, name, decimals, walletAddress } = input;
        // TODO: create a service client if we plan to keep this
        const chainConfig = await getSuiChainConfig(ctx);

        const { AxelarGateway } = chainConfig.config.contracts;

        const response = await fetch(
          `${suiServiceBaseUrl}/deploy-token-with-channel`,
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
              gatewayAddress: AxelarGateway.address,
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

  getRegisterAndDeployTokenTx: publicProcedure
    .input(
      z.object({
        sender: z.string(),
        symbol: z.string(),
        destinationChains: z.array(z.string()),
        tokenPackageId: z.string(),
        tokenId: z.string(),
        amount: z.bigint(),
        minterAddress: z.string().optional(),
        gasValues: z.array(z.bigint()),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const {
          sender,
          symbol,
          tokenPackageId,
          destinationChains,
          gasValues,
          amount,
        } = input;
        const minterAddress = input.minterAddress || sender; // TODO: update this later

        const tokenType = `${tokenPackageId}::${symbol.toLowerCase()}::${symbol.toUpperCase()}`;
        const { txBuilder } = setupTxBuilder(sender);

        // Retry logic for getting coin metadata, sometimes it takes a while for the coin to be available
        let coinMetadata = null;
        let attempts = 0;
        const maxAttempts = 5;

        while (!coinMetadata && attempts < maxAttempts) {
          attempts++;
          coinMetadata = await suiClient.getCoinMetadata({
            coinType: tokenType,
          });

          if (!coinMetadata && attempts < maxAttempts) {
            // Wait a short time before retrying
            await new Promise((resolve) => setTimeout(resolve, 300));
          }
        }

        const chainConfig = await getSuiChainConfig(ctx);

        if (!coinMetadata) {
          throw new Error("Failed to get coin metadata");
        }

        const { InterchainTokenService: ITS } = chainConfig.config.contracts;
        const itsObjectId = ITS.objects.InterchainTokenService;
        const treasuryCap = await getTreasuryCap(tokenPackageId);

        if (!treasuryCap) {
          throw new Error("Treasury cap not found");
        }
        const coinInfo = await txBuilder.moveCall({
          target: `${ITS.address}::coin_info::from_info`,
          typeArguments: [tokenType],
          arguments: [
            coinMetadata.name,
            coinMetadata.symbol,
            coinMetadata.decimals.toString(),
          ],
        });

        // Mint initial coins supply
        await mintToken(
          txBuilder,
          tokenType,
          treasuryCap,
          amount,
          minterAddress
        );

        let coinManagement = null;
        if (minterAddress) {
          coinManagement = await txBuilder.moveCall({
            target: `${ITS.address}::coin_management::new_with_cap`,
            typeArguments: [tokenType],
            arguments: [treasuryCap],
          });
          const channelId = await getChannelId(sender, chainConfig);

          if (!channelId) {
            throw new Error("Channel not found");
          }

          if (input.minterAddress) {
            await txBuilder.moveCall({
              target: `${ITS.address}::coin_management::add_distributor`,
              typeArguments: [tokenType],
              arguments: [coinManagement, channelId],
            });

            await txBuilder.moveCall({
              target: `${ITS.address}::coin_management::add_operator`,
              typeArguments: [tokenType],
              arguments: [coinManagement, sender],
            });

            if (minterAddress !== sender) {
              txBuilder.tx.transferObjects([channelId], minterAddress);
            }
          }
        } else {
          coinManagement = await txBuilder.moveCall({
            target: `${ITS.address}::coin_management::new_locked`,
            typeArguments: [tokenType],
          });
        }

        const tokenId = await txBuilder.moveCall({
          target: `${ITS.address}::interchain_token_service::register_coin`,
          typeArguments: [tokenType],
          arguments: [itsObjectId, coinInfo, coinManagement],
        });

        for (let i = 0; i < destinationChains.length; i++) {
          await deployRemoteInterchainToken(
            txBuilder,
            chainConfig,
            destinationChains[i],
            tokenId,
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
    .mutation(async ({ input, ctx }) => {
      try {
        const chainConfig = await getSuiChainConfig(ctx);

        const { txBuilder } = setupTxBuilder(input.sender);
        const tx = txBuilder.tx;

        // Split coins for gas
        const Gas = tx.splitCoins(tx.gas, [BigInt(input.gas)]);

        const mergedCoin = await mergeAllCoinsOfSameType(
          txBuilder,
          input.sender,
          input.coinType
        );

        // Split token to transfer to the destination chain
        const Coin = tx.splitCoins(mergedCoin, [BigInt(input.amount)]);

        const {
          AxelarGateway,
          GasService,
          InterchainTokenService: ITS,
        } = chainConfig.config.contracts;

        const TokenId = await getTokenId(txBuilder, input.tokenId, ITS);
        const channelId = await txBuilder.moveCall({
          target: `${AxelarGateway.address}::channel::new`,
        });

        const interchainTransferTicket = await txBuilder.moveCall({
          target: `${ITS.address}::interchain_token_service::prepare_interchain_transfer`,
          typeArguments: [input.coinType],
          arguments: [
            TokenId,
            Coin,
            input.destinationChain,
            input.destinationAddress,
            "0x",
            channelId,
          ],
        });

        const messageTicket = await txBuilder.moveCall({
          target: `${ITS.address}::interchain_token_service::send_interchain_transfer`,
          typeArguments: [input.coinType],
          arguments: [
            ITS.objects.InterchainTokenService,
            interchainTransferTicket,
            CLOCK_PACKAGE_ID,
          ],
        });

        await txBuilder.moveCall({
          target: `${GasService.address}::gas_service::pay_gas`,
          typeArguments: [`0x2::sui::SUI`],
          arguments: [
            GasService.objects.GasService,
            messageTicket,
            Gas,
            input.sender,
            "0x",
          ],
        });

        await txBuilder.moveCall({
          target: `${AxelarGateway.address}::gateway::send_message`,
          arguments: [AxelarGateway.objects.Gateway, messageTicket],
        });

        await txBuilder.moveCall({
          target: `${AxelarGateway.address}::channel::destroy`,
          arguments: [channelId],
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
        tokenManagerType: z.enum(["lock_unlock", "mint_burn"]), // Only supported types for sui
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const chainConfig = await getSuiChainConfig(ctx);
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

        const tokenId = await getTokenIdByCoinMetadata(
          txBuilder,
          tokenType,
          coinMetadata,
          chainConfig,
          input.tokenManagerType === "lock_unlock"
        );

        for (let i = 0; i < destinationChainIds.length; i++) {
          const destinationChain = destinationChainIds[i];
          await deployRemoteInterchainToken(
            txBuilder,
            chainConfig,
            destinationChain,
            tokenId,
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

  getTransferOperatorshipTx: publicProcedure
    .input(
      z.object({
        sender: z.string(),
        tokenAddress: z.string(),
        recipientAddress: z.string(),
        symbol: z.string(),
        tokenId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const { sender, tokenAddress, recipientAddress, tokenId, symbol } =
          input;
        const chainConfig = await getSuiChainConfig(ctx);
        const { InterchainTokenService: ITS } = chainConfig.config.contracts;
        const txBuilder = new TxBuilder(suiClient);
        const TokenId = await getTokenId(txBuilder, tokenId, ITS);

        const coinType = `${tokenAddress}::${symbol.toLowerCase()}::${symbol.toUpperCase()}`;

        const channelId = (await getChannelId(sender, chainConfig)) as string;

        const optionAddress = txBuilder.tx.moveCall({
          target: `${STD_PACKAGE_ID}::option::some`,
          typeArguments: ["address"],
          arguments: [txBuilder.tx.pure.address(recipientAddress)],
        });

        await txBuilder.moveCall({
          target: `${ITS.address}::interchain_token_service::transfer_operatorship`,
          typeArguments: [coinType],
          arguments: [
            ITS.objects.InterchainTokenService,
            channelId,
            TokenId,
            optionAddress,
          ],
        });

        const tx = await buildTx(sender, txBuilder);
        const txJSON = await tx.toJSON();
        return txJSON;
      } catch (error) {
        console.error(
          "Failed to prepare transfer ownership transaction:",
          error
        );
        throw new Error(
          `Transfer ownership transaction preparation failed: ${
            (error as Error).message
          }`
        );
      }
    }),

  getMintAsDistributorTx: publicProcedure
    .input(
      z.object({
        sender: z.string(),
        tokenId: z.string(),
        tokenPackageId: z.string(),
        amount: z.bigint(),
        symbol: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { sender, tokenId, tokenPackageId, amount, symbol } = input;
      const tokenType = `${tokenPackageId}::${symbol.toLowerCase()}::${symbol.toUpperCase()}`;
      const chainConfig = await getSuiChainConfig(ctx);
      const txBuilder = new TxBuilder(suiClient);
      const channelId = await getChannelId(sender, chainConfig);

      await mintTokenAsDistributor(
        txBuilder,
        chainConfig,
        tokenType,
        tokenId,
        channelId as string,
        amount,
        sender
      );
      const tx = await buildTx(sender, txBuilder);
      const txJSON = await tx.toJSON();
      return txJSON;
    }),
});
