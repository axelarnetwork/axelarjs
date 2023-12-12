# @axelarjs/evm

![npm (scoped)](https://img.shields.io/npm/v/%40axelarjs/evm)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](./LICENSE)

EVM sdk for Axelar Network

## Guides

### Upgrading ITS contracts

First, upgrade the [@axelar-network/interchain-token-service](https://www.npmjs.com/package/@axelar-network/interchain-token-service) package.

Then run `codegen` script, this will also build the package

```bash
# this will sync ABI's from the package
# It will also generate stricly typed encoders for contract functions

pnpm codegen
```

Once you're done, you can switch to [apps/maestro](/apps/maestro) and run the following commands to sync contract abis and

```bash
# this will sync the contract ABI's

pnpm sync
```

```bash
# this will use wagmi-cli to generate strictly typed react hooks

pnpm codegen
```

You're good to go 🎉
