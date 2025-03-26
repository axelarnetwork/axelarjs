# @axelarjs/sui

[![NPM Version](https://img.shields.io/npm/v/%40axelarjs%2Fsui)](https://www.npmjs.com/package/@axelarjs/evm)
[![Changelog](https://img.shields.io/badge/changelog-Changesets-48B8F3.svg)](/packages/sui/CHANGELOG.md)
[![Typedoc](https://img.shields.io/badge/docs-Typedoc-C87BFF.svg)](https://axelarnetwork.github.io/axelarjs/sui)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](./LICENSE)

Sui Typescript Code Generation for Axelar Network

## Installation

```bash
npm install @axelarjs/sui
```

## Code Generation

The following command will generate the typescript code for the contracts on testnet or mainnet. It will fetches the ABIs from the fullnode using the contract addresses and generate the typescript code. The contract addresses is fetched from the s3 file.

```bash
pnpm codegen testnet|mainnet
```

