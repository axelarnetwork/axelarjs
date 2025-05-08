import { z } from "zod";
import { randomUUID } from "crypto";
import { Address } from "stellar-sdk";
import { nativeToScVal } from "stellar-sdk";

import { publicProcedure } from "~/server/trpc";
import { getStellarChainConfig } from "./utils";
import {
  INTERCHAIN_TOKEN_SERVICE_CONTRACT,
  fetchStellarAccount,
  createContractTransaction,
  hexToScVal
} from "./utils/transactions";

export const getTransferTokenTx = publicProcedure
  .input(
    z.object({
      tokenId: z.string(),
      senderAddress: z.string(),
      destinationChain: z.string(),
      destinationAddress: z.string(),
      amount: z.string(),
      metadata: z.string().optional(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    try {
      // Get Stellar chain config
      await getStellarChainConfig(ctx);
      
      console.log(`Processing token transfer with parameters:`);
      console.log(`Token ID: ${input.tokenId}`);
      console.log(`Sender Address: ${input.senderAddress}`);
      console.log(`Destination Chain: ${input.destinationChain}`);
      console.log(`Destination Address: ${input.destinationAddress}`);
      console.log(`Amount: ${input.amount}`);
      console.log(`Metadata: ${input.metadata || 'None'}`);
      
      // Fetch the user's account
      const account = await fetchStellarAccount(input.senderAddress);
      console.log(`Account sequence number: ${account.sequenceNumber()}`);
      
      // Prepare the operation arguments
      const sender = new Address(input.senderAddress).toScVal();
      
      // Convert destination address to bytes format
      const destinationAddressBytes = Buffer.from(input.destinationAddress).toString('hex');
      const destinationAddressScVal = hexToScVal(destinationAddressBytes);
      
      // Create and prepare the transaction
      const { transactionXDR } = await createContractTransaction({
        contractAddress: INTERCHAIN_TOKEN_SERVICE_CONTRACT,
        method: 'interchain_transfer',
        account,
        args: [
          sender, // sender
          hexToScVal(input.tokenId), // tokenId
          nativeToScVal(input.destinationChain, { type: 'string' }), // destinationChain
          destinationAddressScVal, // destinationAddress
          nativeToScVal(input.amount, { type: 'i128' }), // amount
          input.metadata 
            ? hexToScVal(input.metadata) 
            : nativeToScVal(null, { type: 'void' }) // metadata (optional)
        ]
      });
      
      // Return the transaction XDR and transfer data
      return {
        transactionXDR,
        transferData: {
          tokenId: input.tokenId,
          senderAddress: input.senderAddress,
          destinationChain: input.destinationChain,
          destinationAddress: input.destinationAddress,
          amount: input.amount,
          metadata: input.metadata,
          transferId: randomUUID()
        }
      };
    } catch (error) {
      console.error("Error in getTransferTokenTx:", error);
      throw error;
    }
  });
