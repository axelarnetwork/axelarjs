import { z } from "zod";

import { publicProcedure, router } from "~/server/trpc";
import { stellarChainConfig } from "~/config/chains";
import { NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE } from "~/config/env";
import {
  createContractTransaction,
  fetchStellarAccount,
  hexToScVal,
  tokenMetadataToScVal,
} from "./utils/transactions";
import { STELLAR_ITS_CONTRACT_ID } from "./utils/config";
import {
  Address,
  BASE_FEE,
  Contract,
  nativeToScVal,
  rpc,
  TransactionBuilder,
  xdr,
} from "@stellar/stellar-sdk";

// Helper function for converting address to ScVal
function addressToScVal(addressString: string): xdr.ScVal {
  return nativeToScVal(Address.fromString(addressString), { type: "address" });
}

export const stellarRouter = router({
  // Endpoint to get transaction bytes for deploying a token on Stellar
  getDeployTokenTxBytes: publicProcedure
    .input(
      z.object({
        caller: z.string(), // Caller address
        tokenName: z.string(),
        tokenSymbol: z.string(),
        decimals: z.number(),
        initialSupply: z.string(), // Bigint as string
        salt: z.string(), // Hex string
        minterAddress: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const {
        caller,
        tokenName,
        tokenSymbol,
        decimals,
        initialSupply,
        salt,
        minterAddress,
      } = input;

      try {
        const account = await fetchStellarAccount(caller);
        const actualMinterAddress = minterAddress || caller;

        // Prepare arguments for the contract call
        const args: xdr.ScVal[] = [
          addressToScVal(caller),
          hexToScVal(salt),
          tokenMetadataToScVal(decimals, tokenName, tokenSymbol),
          nativeToScVal(initialSupply, { type: "i128" }),
          addressToScVal(actualMinterAddress),
        ];

        // Create the transaction
        const { transactionXDR } = await createContractTransaction({
          contractAddress: STELLAR_ITS_CONTRACT_ID,
          method: "deploy_interchain_token",
          account,
          args,
          rpcUrl: stellarChainConfig.rpcUrls.default.http[0],
          networkPassphrase: NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE,
        });

        return { transactionXDR };
      } catch (error) {
        console.error("Error creating deploy token transaction:", error);
        throw error;
      }
    }),

  // Endpoint to get transaction bytes for deploying tokens to remote chains
  getDeployRemoteTokensTxBytes: publicProcedure
    .input(
      z.object({
        caller: z.string(),
        salt: z.string(), // Hex string
        tokenName: z.string(),
        tokenSymbol: z.string(),
        decimals: z.number(),
        destinationChainIds: z.array(z.string()),
        gasValues: z.array(z.string()), // Array of bigint as strings
        minterAddress: z.string().optional(),
        multicallContractAddress: z.string().optional(),
        gasTokenAddress: z.string().optional(),
        itsContractAddress: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const {
        caller,
        salt,
        destinationChainIds,
        gasValues,
        minterAddress,
        multicallContractAddress = "CC6BXRCUQFAJ64NDLEZCS4FDL6GN65FL2KDOKCRHFWPMPKRWQNBA4YR2",
        gasTokenAddress = "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC",
        itsContractAddress = STELLAR_ITS_CONTRACT_ID,
      } = input;

      if (destinationChainIds.length !== gasValues.length) {
        throw new Error("destinationChainIds and gasValues must have the same length");
      }
      if (destinationChainIds.length === 0) {
        throw new Error("destinationChainIds cannot be empty");
      }

      // Helper functions for ScVal creation
      function _addressToScVal(address: string): xdr.ScVal {
        return Address.fromString(address).toScVal();
      }

      function _bytesToScVal(hexString: string): xdr.ScVal {
        if (hexString.startsWith("0x")) {
          hexString = hexString.slice(2);
        }
        return xdr.ScVal.scvBytes(Buffer.from(hexString, "hex"));
      }

      function _stringToScVal(str: string): xdr.ScVal {
        return xdr.ScVal.scvString(str);
      }

      function _symbolToScVal(sym: string): xdr.ScVal {
        return xdr.ScVal.scvSymbol(sym);
      }

      function _bigIntToScValI128(num: string): xdr.ScVal {
        return nativeToScVal(BigInt(num), { type: "i128" });
      }

      function _buildGasPaymentMapScVal(
        gasTokenAddr: string,
        gasValue: string
      ): xdr.ScVal {
        const mapEntries: xdr.ScMapEntry[] = [
          new xdr.ScMapEntry({
            key: _symbolToScVal("address"),
            val: _addressToScVal(gasTokenAddr),
          }),
          new xdr.ScMapEntry({
            key: _symbolToScVal("amount"),
            val: _bigIntToScValI128(gasValue),
          }),
        ];
        return xdr.ScVal.scvMap(mapEntries);
      }
      
      try {
        const effectiveMinter = minterAddress || caller;
        const rpcUrl = stellarChainConfig.rpcUrls.default.http[0];
        const server = new rpc.Server(rpcUrl, {
          allowHttp: rpcUrl.startsWith("http://"),
        });

        // Create individual calls for each destination chain
        const individualCalls: xdr.ScVal[] = destinationChainIds.map(
          (chainId, index) => {
            const gasValue = gasValues[index];
            const gasPaymentScVal = _buildGasPaymentMapScVal(
              gasTokenAddress,
              gasValue
            );

            const deployRemoteArgs: xdr.ScVal[] = [
              _addressToScVal(effectiveMinter),
              _bytesToScVal(salt),
              _stringToScVal(chainId),
              gasPaymentScVal,
            ];

            const callArgsVec = xdr.ScVal.scvVec(deployRemoteArgs);

            const callMapEntries: xdr.ScMapEntry[] = [
              new xdr.ScMapEntry({
                key: _symbolToScVal("approver"),
                val: _addressToScVal(caller),
              }),
              new xdr.ScMapEntry({ key: _symbolToScVal("args"), val: callArgsVec }),
              new xdr.ScMapEntry({
                key: _symbolToScVal("contract"),
                val: _addressToScVal(itsContractAddress),
              }),
              new xdr.ScMapEntry({
                key: _symbolToScVal("function"),
                val: _symbolToScVal("deploy_remote_interchain_token"),
              }),
            ];
            return xdr.ScVal.scvMap(callMapEntries);
          }
        );

        const multicallArgs = xdr.ScVal.scvVec(individualCalls);

        const sourceAccount = await server.getAccount(caller);
        console.log(
          `[getDeployRemoteTokensTxBytes] Fetched source account ${caller} initial sequence: ${sourceAccount.sequenceNumber()}`
        );
        const multicallContract = new Contract(multicallContractAddress);

        const txBuilder = new TransactionBuilder(sourceAccount, {
          fee: BASE_FEE,
          networkPassphrase: NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE,
        })
          .addOperation(multicallContract.call("multicall", multicallArgs))
          .setTimeout(300); // Set timeout to 5 minutes

        const builtTx = txBuilder.build();
        // Prepare the transaction to get the correct fee and footprint
        const preparedTx = await server.prepareTransaction(builtTx);
        const transactionXDR = preparedTx.toEnvelope().toXDR("base64");

        return { transactionXDR };
      } catch (error) {
        console.error("Error creating deploy remote tokens transaction:", error);
        throw error;
      }
    }),
});
