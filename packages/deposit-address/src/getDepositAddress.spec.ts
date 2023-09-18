import { createAxelarConfigNodeClient } from "@axelarjs/api/axelar-config/node";
import { createAxelarscanNodeClient } from "@axelarjs/api/axelarscan/node";
import { createDepositAddressApiNodeClient } from "@axelarjs/api/deposit-address-api/node";
import { createGMPNodeClient } from "@axelarjs/api/gmp/node";
import { ENVIRONMENTS } from "@axelarjs/core";

import {
  getDepositAddress,
  GetDepositAddressDependencies,
} from "./getDepositAddress";

describe("getDepositAddress", () => {
  const DEFAULT_DEPOSIT_ADDRESS_DEPENDENCIES: GetDepositAddressDependencies = {
    configClient: createAxelarConfigNodeClient(ENVIRONMENTS.testnet),
    gmpClient: createGMPNodeClient(ENVIRONMENTS.testnet),
    depositAddressClient: createDepositAddressApiNodeClient(
      ENVIRONMENTS.testnet
    ),
    axelarscanClient: createAxelarscanNodeClient(ENVIRONMENTS.testnet),
  };

  test("get deposit address", async () => {
    const res = await getDepositAddress(
      {
        sourceChain: "Fantom",
        destinationChain: "ethereum-2",
        asset: "uaxl",
        destinationAddress: "0xB8Cd93C83A974649D76B1c19f311f639e62272BC",
        module: "evm",
        environment: ENVIRONMENTS.testnet,
      },
      DEFAULT_DEPOSIT_ADDRESS_DEPENDENCIES
    );
    console.log(res);
    expect(res).toBeTruthy();
  });
});
