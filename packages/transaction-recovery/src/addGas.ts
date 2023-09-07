import { createGMPNodeClient } from "@axelarjs/api/gmp/node";
import type { AxelarSigningClient } from "@axelarjs/cosmos/signing-client";

const gmpClient = createGMPNodeClient({
  prefixUrl: "https://testnet.api.gmp.axelarscan.io",
});

async function addGas(signingClient: AxelarSigningClient, txHash: string) {
  const tx = await signingClient.getTx(txHash);
  console.log({ tx });

  const fees = await gmpClient.getFees({
    destinationChain: "ethereum-2",
    sourceChain: "polygon",
  });

  console.log({ fees });

  // send ibc transfer with memo field using message ID from tx above
  // todo

  return {};
}

export default addGas;
