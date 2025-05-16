import type { StellarWalletsKit } from "@creit.tech/stellar-wallets-kit";
import {
  Address,
  Contract,
  nativeToScVal,
  rpc,
  Transaction,
  TransactionBuilder,
  xdr,
  BASE_FEE,
} from "@stellar/stellar-sdk";
import { DeployAndRegisterTransactionState } from "~/features/InterchainTokenDeployment";

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
function _bigIntToScValI128(num: bigint | string): xdr.ScVal {
  return nativeToScVal(BigInt(num), { type: "i128" });
}

function _buildGasPaymentMapScVal(
  gasTokenAddress: string,
  gasValue: bigint
): xdr.ScVal {
  const mapEntries: xdr.ScMapEntry[] = [
    new xdr.ScMapEntry({
      key: _symbolToScVal("address"),
      val: _addressToScVal(gasTokenAddress),
    }),
    new xdr.ScMapEntry({
      key: _symbolToScVal("amount"),
      val: _bigIntToScValI128(gasValue), 
    }),
  ];
  return xdr.ScVal.scvMap(mapEntries);
}

export interface MulticallDeployRemoteResult {
  hash: string;
  status: string;
}

export async function multicall_deploy_remote_interchain_tokens({
  caller,
  kit,
  salt,
  destinationChainIds,
  gasValues,
  itsContractAddress,
  multicallContractAddress,
  gasTokenAddress,
  rpcUrl,
  networkPassphrase,
  minterAddress, 
  onStatusUpdate,
}: {
  caller: string;
  kit: StellarWalletsKit;
  salt: string; 
  destinationChainIds: string[];
  gasValues: bigint[];
  itsContractAddress: string;
  multicallContractAddress: string;
  gasTokenAddress: string;
  rpcUrl: string;
  networkPassphrase: string;
  minterAddress?: string;
  onStatusUpdate?: (status: DeployAndRegisterTransactionState) => void;
}): Promise<MulticallDeployRemoteResult> {
  if (destinationChainIds.length !== gasValues.length) {
    const errMessage = "destinationChainIds and gasValues must have the same length";
    onStatusUpdate?.({ type: "idle"});
    throw new Error(errMessage);
  }
  if (destinationChainIds.length === 0) {
    const errMessage = "destinationChainIds cannot be empty";
    onStatusUpdate?.({ type: "idle"});
    throw new Error(errMessage);
  }

  const effectiveMinter = minterAddress || caller;

  try {
    const server = new rpc.Server(rpcUrl, {
      allowHttp: rpcUrl.startsWith("http://"),
    });

    const individualCalls: xdr.ScVal[] = destinationChainIds.map((chainId, index) => {
      const gasValue = gasValues[index];
      const gasPaymentScVal = _buildGasPaymentMapScVal(gasTokenAddress, gasValue);

      const deployRemoteArgs: xdr.ScVal[] = [
        _addressToScVal(effectiveMinter),
        _bytesToScVal(salt),
        _stringToScVal(chainId),
        gasPaymentScVal,
      ];

      const callArgsVec = xdr.ScVal.scvVec(deployRemoteArgs);

      const callMapEntries: xdr.ScMapEntry[] = [
        new xdr.ScMapEntry({ key: _symbolToScVal("approver"), val: _addressToScVal(caller) }),
        new xdr.ScMapEntry({ key: _symbolToScVal("args"), val: callArgsVec }),
        new xdr.ScMapEntry({ key: _symbolToScVal("contract"), val: _addressToScVal(itsContractAddress) }),
        new xdr.ScMapEntry({ key: _symbolToScVal("function"), val: _symbolToScVal("deploy_remote_interchain_token") }),
      ];
      return xdr.ScVal.scvMap(callMapEntries);
    });

    const multicallArgs = xdr.ScVal.scvVec(individualCalls);

    const sourceAccount = await server.getAccount(caller);
    console.log(`[remoteTokenDeployments] Fetched source account ${caller} initial sequence: ${sourceAccount.sequenceNumber()}`);
    const multicallContract = new Contract(multicallContractAddress);

    const txBuilder = new TransactionBuilder(sourceAccount, {
      fee: BASE_FEE, 
      networkPassphrase,
    }).addOperation(multicallContract.call("multicall", multicallArgs)).setTimeout(300); // Set timeout to 5 minutes

    const builtTx = txBuilder.build();
    console.log(`[remoteTokenDeployments] builtTx sequence: ${builtTx.sequence.toString()}`); // SDK v11+ Transaction.sequence is BigInt
    console.log("Multicall transaction before prepare (raw build):", builtTx.toEnvelope().toXDR('base64'));
    // Prepare the transaction to get the correct fee and footprint
    const preparedTx = await server.prepareTransaction(builtTx);
    console.log(`[remoteTokenDeployments] preparedTx sequence: ${preparedTx.sequence.toString()}`); // SDK v11+ Transaction.sequence is BigInt
    console.log("Multicall transaction after prepare (prepared):", preparedTx.toEnvelope().toXDR("base64"));
    const transactionXDR = preparedTx.toEnvelope().toXDR("base64");

    onStatusUpdate?.({ type: "pending_approval", step: 2, totalSteps: 2 });

    const { signedTxXdr } = await kit.signTransaction(transactionXDR, {
      networkPassphrase,
    });

    const finalTx = new Transaction(signedTxXdr, networkPassphrase);
    const txHash = finalTx.hash().toString('hex');

    onStatusUpdate?.({
      type: "deploying",
      txHash: txHash,
    });
    console.log(`Submitting multicall transaction ${txHash}...`);

    const sendTxResponse = await server.sendTransaction(finalTx);
    console.log("Transaction submitted:", sendTxResponse);

    if (sendTxResponse.status === "ERROR" || sendTxResponse.status === "DUPLICATE" || sendTxResponse.status === "TRY_AGAIN_LATER" || !sendTxResponse.hash) {
      const errorResultField = (sendTxResponse as any).errorResult;
      const errorResultXDR = errorResultField?.toXDR ? errorResultField.toXDR('base64') : JSON.stringify(errorResultField);
      const errorMessage = `Stellar transaction submission failed with status: ${sendTxResponse.status}. Error detail: ${errorResultXDR || 'N/A'}`;
      console.error(errorMessage, sendTxResponse);
      onStatusUpdate?.({ type: "idle"});
      throw new Error(errorMessage);
    }

    onStatusUpdate?.({ type: "idle"});
    console.log(`Transaction ${txHash} PENDING, starting polling...`);

    let getTxResponse: rpc.Api.GetTransactionResponse | undefined;
    const maxPollingAttempts = 20; 
    const pollingIntervalMs = 3000; 

    for (let i = 0; i < maxPollingAttempts; i++) {
      await new Promise(resolve => setTimeout(resolve, pollingIntervalMs));
      try {
        getTxResponse = await server.getTransaction(txHash);
        console.log(`Polling attempt ${i + 1} for ${txHash}: Status = ${getTxResponse.status}`);

        if (getTxResponse.status === rpc.Api.GetTransactionStatus.SUCCESS) {
          console.log("Transaction SUCCESS:", getTxResponse);
          return {
            hash: txHash,
            status: "SUCCESS",
          };
        } else if (getTxResponse.status === rpc.Api.GetTransactionStatus.FAILED) {
          const resultXdrBase64 = getTxResponse.resultXdr ? getTxResponse.resultXdr.toXDR("base64") : 'N/A';
          const errorDetail = getTxResponse.resultXdr?.result().switch().name;
          const failReason = `Transaction FAILED on-chain. Status: ${getTxResponse.status}, Error Detail from XDR: ${errorDetail}, Result XDR (base64): ${resultXdrBase64}`;
          console.error("Transaction FAILED:", failReason, getTxResponse);
          onStatusUpdate?.({ type: "idle"});
          throw new Error(failReason);
        } else if (getTxResponse.status === rpc.Api.GetTransactionStatus.NOT_FOUND) {
          console.log("Transaction NOT_FOUND, continuing polling...");
        }
      } catch (pollingError) {
        console.error(`Error during getTransaction polling:`, pollingError);
        const message = pollingError instanceof Error ? pollingError.message : String(pollingError);
        onStatusUpdate?.({ type: "idle"});
        throw new Error(`Polling with getTransaction failed: ${message}`);
      }
    }

    const finalErrorMsg = `Transaction did not succeed after ${maxPollingAttempts} polling attempts. Last status: ${getTxResponse?.status ?? 'unknown'}`;
    onStatusUpdate?.({ type: "idle"});
    throw new Error(finalErrorMsg);
  } catch (error) { 
    console.error("multicall_deploy_remote_interchain_tokens failed:", error);
    const message = error instanceof Error ? error.message : String(error);
    console.error("Error details:", message);
    if (!(error instanceof Error && (error.message.startsWith("Polling with getTransaction failed") || error.message.startsWith("Transaction did not succeed") || error.message.startsWith("Stellar transaction submission failed") || error.message.startsWith("destinationChainIds and gasValues must have the same length") || error.message.startsWith("destinationChainIds cannot be empty")))) {
      onStatusUpdate?.({ type: "idle"});
    }
    throw error; 
  }
}