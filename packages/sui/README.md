# @axelarjs/sui

[![NPM Version](https://img.shields.io/npm/v/%40axelarjs%2Fsui)](https://www.npmjs.com/package/@axelarjs/sui)
[![Changelog](https://img.shields.io/badge/changelog-Changesets-48B8F3.svg)](/packages/sui/CHANGELOG.md)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](./LICENSE)

Sui Typescript Code Generation for Axelar Network

## Installation

```bash
npm install @axelarjs/sui
```

## Code Generation

The following command will generate the typescript code for the contracts on devnet-amplifier, testnet, and mainnet envs. It will fetches the ABIs from the fullnode using the contract addresses and generate the typescript code. The contract addresses is fetched from the s3 file.

```bash
pnpm codegen
```

As a result, the typescript code will be generated in the `src` directory as follows:

```
src
├╴ devnet-amplifier
│ ├╴ abis
│ │ ├╴ 0xabcd...0123.json
│ │ ├╴ 0xabcd...0123.json
│ │ └╴ index.ts
│ └╴ types
│   ├╴ 0xabcd...0123.ts
│   ├╴ 0xabcd...0123.ts
│   └╴ index.ts
├╴ mainnet
│ ├╴ abis
│ │ ├╴ 0xabcd...0123.json
│ │ ├╴ 0xabcd...0123.json
│ │ └╴ index.ts
│ └╴ types
│   ├╴ 0xabcd...0123.ts
│   ├╴ 0xabcd...0123.ts
│   └╴ index.ts
├╴ testnet
│ ├╴ abis
│ │ ├╴ 0xabcd...0123.json
│ │ ├╴ 0xabcd...0123.json
│ │ └╴ index.ts
│ └╴ types
│   ├╴ 0xabcd...0123.ts
│   ├╴ 0xabcd...0123.ts
│   └╴ index.ts
```

## License

This project is licensed under the Apache 2.0 License.  
