# @axelarjs

![build & test workflow](https://github.com/axelarnetwork/axelarjs/actions/workflows/test.yml/badge.svg)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](/LICENSE)
![TypeScript](https://img.shields.io/badge/TypeScript-blue)

Axelar Network foundations for Javascript/Typescript application development

Packages:

| package                                                  | description                                                                                          |
| -------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| 🎨 [ui](/packages/ui)                                    | shared UI component library (react + tailwindcss)                                                    |
| 📡 [api](/packages/api)                                  | api client for axelar restful services                                                               |
| ⚙️ [core](/packages/core)                                | core utilities, types, constants and data-structures                                                 |
| 🗚 [proto](/packages/proto)                               | generated types from axelar-core protobuf files                                                      |
| 🔷 [evm](/packages//evm)                                 | evm-specific tooling based on [viem](https://github.com/wagmi-dev/viem)                              |
| 🪐 [cosmos](/packages/cosmos)                            | cosmos-specific tooling based on [cosmjs](https://github.com/cosmos/cosmjs)                          |
| 🔧 [utils](/packages/utils)                              | framework-agnostic utilities and helper functions                                                    |
| 🏦 [deposit-address](/packages/deposit-address)          | Get a deposit address to transfer funds from an Axelar-supported source chain to a destination chain |
| 🛟 [transaction-recovery](/packages/transaction-recovery) | Recover GMP transactions, transfers, add gas & more                                                  |

Apps:

| app                           | description                     |
| ----------------------------- | ------------------------------- |
| 🎼 [maestro](/apps/maestro)   | Interchain Token Service Portal |
| 🕵️‍♂️ [registry](/apps/registry) | Axelarjs Chain Registry UI      |
