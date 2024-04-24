# @axelarjs/cosmos

type-safe clients for axelar's cosmos node

[![NPM Version](https://img.shields.io/npm/v/%40axelarjs%2Fcosmos)](https://www.npmjs.com/package/@axelarjs/cosmos)
[![Changelog](https://img.shields.io/badge/changelog-Changesets-48B8F3.svg)](/packages/cosmos/CHANGELOG.md)
[![Typedoc](https://img.shields.io/badge/docs-Typedoc-C87BFF.svg)](https://axelarnetwork.github.io/axelarjs/cosmos)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](./LICENSE)

## Install

```bash
pnpm add @axelarjs/cosmos

```

## Usage

Simulate a `link` transaction

```ts
import { AXELAR_RPC_URLS } from "@axelarjs/core";
import { STANDARD_FEE } from "@axelarjs/cosmos/constants";
import { createAxelarSigningClient } from "@axelarjs/cosmos/constants/stargateClient";

import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { toAccAddress } from "@cosmjs/stargate/build/queryclient/utils";

const offlineSigner = await DirectSecp256k1HdWallet.fromMnemonic(
  process.env["COSMOS_WALLET_MNEMONIC"] as string,
  { prefix: "axelar" }
);

const client = await createAxelarSigningClient(
  AXELAR_RPC_URLS.testnet,
  offlineSigner
);

const [accData] = await offlineSigner.getAccounts();

if (!accData) {
  throw new Error("Invalid response from offlineSigner.getAccounts()");
}

const estimateGas = await client.tx.evm.link.simulate(accData.address, {
  sender: toAccAddress(String(accData.address)),
  recipientAddr: "0xB8Cd93C83A974649D76B1c19f311f639e62272BC",
  recipientChain: "avalanche",
  asset: "wavax-wei",
  chain: "fantom",
});

console.log({ estimateGas });
```

Broadcast a `link` transaction

```ts
import { AXELAR_RPC_URLS } from "@axelarjs/core";
import { STANDARD_FEE } from "@axelarjs/cosmos/constants";
import { createAxelarSigningClient } from "@axelarjs/cosmos/constants/stargateClient";

import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { toAccAddress } from "@cosmjs/stargate/build/queryclient/utils";

const offlineSigner = await DirectSecp256k1HdWallet.fromMnemonic(
  process.env["COSMOS_WALLET_MNEMONIC"] as string,
  { prefix: "axelar" }
);

const client = await createAxelarSigningClient(
  AXELAR_RPC_URLS.testnet,
  offlineSigner
);

const [accData] = await offlineSigner.getAccounts();

if (!accData) {
  throw new Error("Invalid response from offlineSigner.getAccounts()");
}

const txResponse = await client.tx.evm.link.signAndBroadcast(
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

console.log({ txResponse });
```
