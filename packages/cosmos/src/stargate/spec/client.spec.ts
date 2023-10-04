import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { toAccAddress } from "@cosmjs/stargate/build/queryclient/utils";

import { STANDARD_FEE } from "../../constants";
import {
  AxelarSigningStargateClient,
  getSigningAxelarClientOptions,
} from "../stargateClient";
import { MOCK_BROADCAST_RESPONSE } from "./mock";

describe("signing client", () => {
  test("default registry", () => {
    const { registry } = getSigningAxelarClientOptions();

    expect(registry).toBeDefined();

    const typeFound = registry.lookupType("/axelar.evm.v1beta1.LinkRequest");
    expect(typeFound).toBeDefined();
    expect(typeFound?.decode).toBeDefined();
  });

  test("broadcast link transaction", async () => {
    const axelarRpcUrl = "https://axelartest-rpc.quickapi.com";

    const offlineSigner = await DirectSecp256k1HdWallet.fromMnemonic(
      process.env["COSMOS_WALLET_MNEMONIC"] as string,
      { prefix: "axelar" }
    );

    const client = await AxelarSigningStargateClient.connectWithSigner(
      axelarRpcUrl,
      offlineSigner
    );

    vi.spyOn(client, "signAndBroadcast").mockImplementation(() =>
      Promise.resolve(MOCK_BROADCAST_RESPONSE)
    );

    const [accData] = await offlineSigner.getAccounts();

    if (!accData) {
      return;
    }

    const txResponse = await client.messages.evm.link.signAndBroadcast(
      accData.address,
      {
        sender: toAccAddress(String(accData?.address)),
        recipientAddr: "0xB8Cd93C83A974649D76B1c19f311f639e62272BC",
        recipientChain: "avalanche",
        asset: "wavax-wei",
        chain: "fantom",
      },
      STANDARD_FEE
    );

    expect(txResponse.transactionHash).toEqual(
      MOCK_BROADCAST_RESPONSE.transactionHash
    );
  });

  test("simulate link transaction", async () => {
    const axelarRpcUrl = "https://axelartest-rpc.quickapi.com";

    const offlineSigner = await DirectSecp256k1HdWallet.fromMnemonic(
      process.env["COSMOS_WALLET_MNEMONIC"] as string,
      { prefix: "axelar" }
    );

    const client = await AxelarSigningStargateClient.connectWithSigner(
      axelarRpcUrl,
      offlineSigner
    );

    const [accData] = await offlineSigner.getAccounts();

    if (!accData) {
      return;
    }

    const estimateGas = await client.messages.evm.link.simulate(
      accData.address,
      {
        sender: toAccAddress(String(accData?.address)),
        recipientAddr: "0xB8Cd93C83A974649D76B1c19f311f639e62272BC",
        recipientChain: "avalanche",
        asset: "wavax-wei",
        chain: "fantom",
      }
    );

    expect(estimateGas).not.toBeLessThan(10000);
  });
});
