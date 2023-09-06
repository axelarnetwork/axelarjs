import type { AxelarSigningClient } from "@axelarjs/cosmos/signing-client";

async function addGas(signingClient: AxelarSigningClient, txHash: string) {
  const tx = await signingClient.getTx(txHash);
  console.log({ tx });

  // send ibc transfer with memo field using message ID from tx above
  // todo

  return {};
}

export default addGas;
