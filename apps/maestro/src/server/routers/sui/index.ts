import { TxBuilder } from "@axelar-network/axelar-cgp-sui";
import { SuiClient } from "@mysten/sui/client";
import { z } from "zod";

import { publicProcedure, router } from "~/server/trpc";
import config from "./config/devnet-amplifier.json";
import { buildTx } from "./utils/utils";

// Initialize SuiClient directly with RPC from config
const suiClient = new SuiClient({
  url: config["sui-test2"].rpc,
});
const suiServiceBaseUrl = "https://melted-fayth-nptytn-57e5d396.koyeb.app";

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
        const chainConfig = await response.json();
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
        const itsObjectId = chainConfig.contracts.ITS.objects?.ITS;
        const examplePackageId = chainConfig.contracts.Example.address;
        const feeUnitAmount = 5e7;
        const ITS = chainConfig.contracts.ITS;
        const Example = chainConfig.contracts.Example;
        const AxelarGateway = chainConfig.contracts.AxelarGateway;
        const GasService = chainConfig.contracts.GasService;

        if (!ITS.trustedAddresses) return undefined;

        const trustedDestinationChains = Object.keys(ITS.trustedAddresses);
        for (const destinationChain of destinationChains) {
          if (!trustedDestinationChains.includes(destinationChain))
            console.log(`destination chain ${destinationChain} not trusted`);
          return undefined;
        }

        if (!itsObjectId || !examplePackageId) return undefined;

        const gas = txBuilder.tx.splitCoins(txBuilder.tx.gas, [feeUnitAmount]);

        const [TokenId] = await txBuilder.moveCall({
          target: `${examplePackageId}::its::register_coin`,
          typeArguments: [tokenType],
          arguments: [itsObjectId, metadataId],
        });
        //
        // const [TokenIdU256] = await txBuilder.moveCall({
        //   target: `${examplePackageId}::its::register_coin_u256`,
        //   typeArguments: [tokenType],
        //   arguments: [itsObjectId, metadataId],
        // });

        for (const destinationChain of destinationChains) {
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
});
