import { createDepositAddressApiNodeClient } from "@axelarjs/api/deposit-address-api/node";

import getDepositAddress from "./getDepositAddress";
import { getOneTimeCode } from "./helpers";
import { depositAddressClient } from "./services";

describe("getDepositAddress", () => {
  test("get deposit address", async () => {
    // const apiClient = depositAddressClient();
    // const res = await getOneTimeCode(
    //   "0xB8Cd93C83A974649D76B1c19f311f639e62272BC"
    // );
    // console.log({ res });
    const res = await getDepositAddress({
      sourceChain: "Fantom",
      destinationChain: "ethereum-2",
      asset: "uaxl",
      destinationAddress: "0xB8Cd93C83A974649D76B1c19f311f639e62272BC",
      module: "evm",
    });
    console.log({ res });
    expect(res).toBeTruthy();
  });
});
