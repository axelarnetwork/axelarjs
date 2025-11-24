# @axelarjs/core

## 0.2.13

### Patch Changes

- [#577](https://github.com/axelarnetwork/axelarjs/pull/577) [`dd036a5c4dbd67c7e78b9493849cccc4b2010001`](https://github.com/axelarnetwork/axelarjs/commit/dd036a5c4dbd67c7e78b9493849cccc4b2010001) Thanks [@npty](https://github.com/npty)! - update rpc url for stellar mainnet

## 0.2.12

### Patch Changes

- [#553](https://github.com/axelarnetwork/axelarjs/pull/553) [`39b4ce770e3072a0e83bb99c649bbd521eb7604e`](https://github.com/axelarnetwork/axelarjs/commit/39b4ce770e3072a0e83bb99c649bbd521eb7604e) Thanks [@npty](https://github.com/npty)! - Supported devnet-amplifier

## 0.2.11

### Patch Changes

- [#363](https://github.com/axelarnetwork/axelarjs/pull/363) [`234f9255090a7bc735b9229d380ab1725b2f0946`](https://github.com/axelarnetwork/axelarjs/commit/234f9255090a7bc735b9229d380ab1725b2f0946) Thanks [@npty](https://github.com/npty)! - - Added `manualRelayToDestChain` function in the `@axelarjs/transaction-recovery` module for enhanced transaction recovery capabilities.
  - Added `searchBatchedCommands` query for the Axelarscan client in the `@axelarjs/api` module.
  - Added Axelar Recovery client to facilitate server-side signing of Axelar transactions in the `@axelarjs/api` module.
  - Added `AXELAR_LCD_URLS` to `@axelarjs/core` module.
  - Added `connectToFirstAvailable` function to allow passing multiple rpc urls and connect to first available node in the `@axelarjs/cosmos` module.

## 0.2.10

### Patch Changes

- [#257](https://github.com/axelarnetwork/axelarjs/pull/257) [`a5e1a286dd12260d9a9ae09610dd2c5fd6a16e14`](https://github.com/axelarnetwork/axelarjs/commit/a5e1a286dd12260d9a9ae09610dd2c5fd6a16e14) Thanks [@npty](https://github.com/npty)! - update core rpc config and add optional rpc parameter for deposit addr module

## 0.2.9

### Patch Changes

- [`7376c166`](https://github.com/axelarnetwork/axelarjs/commit/7376c16636b0dc165d26545fc4d094e9917cbcea) Thanks [@alanrsoares](https://github.com/alanrsoares)! - Update packages/core module exports

## 0.2.8

### Patch Changes

- [`42204ed7`](https://github.com/axelarnetwork/axelarjs/commit/42204ed79efac23a74b4333a452bb29cb6dfe020) Thanks [@alanrsoares](https://github.com/alanrsoares)! - Remove `"type": "module"` from packages

## 0.2.7

### Patch Changes

- [`4b8adb6f`](https://github.com/axelarnetwork/axelarjs/commit/4b8adb6f18b69745aad3045519d870e880ec226a) Thanks [@alanrsoares](https://github.com/alanrsoares)! - - Migrage api clients to use minimalistic isomorphic http client based on `isomorphic-unfetc`
  - upgrade dependencies

## 0.2.6

### Patch Changes

- [`a7457a7b`](https://github.com/axelarnetwork/axelarjs/commit/a7457a7b5ad7d0b5bcc1dfcf483dc335ea61cb86) Thanks [@canhtrinh](https://github.com/canhtrinh)! - update build settings for deposit-address module

## 0.2.5

### Patch Changes

- [`59d3ff8f`](https://github.com/axelarnetwork/axelarjs/commit/59d3ff8fa77fefe3639a8fb1f7cf3263162c360e) Thanks [@canhtrinh](https://github.com/canhtrinh)! - bumping all dependencies

## 0.2.4

### Patch Changes

- [`c9efbb15`](https://github.com/axelarnetwork/axelarjs/commit/c9efbb1523ca6cf06d56865a0115cf214e16b1c7) Thanks [@alanrsoares](https://github.com/alanrsoares)! - Do not use path aliases in publishable packages

## 0.2.3

### Patch Changes

- [`c2b0fa7c`](https://github.com/axelarnetwork/axelarjs/commit/c2b0fa7c3920102a30e3e6d205e5574586c47d98) Thanks [@alanrsoares](https://github.com/alanrsoares)! - - @axelarjs/cosmos: Implement AxelarSigningStargateClient
  - @axelarjs/utils: Add `memoize` util to `functions` module
  - @axelarjs/proto: Upgrade protobuf dependencies
  - all: upgrade vitest

## 0.2.2

### Patch Changes

- [`7aed955f`](https://github.com/axelarnetwork/axelarjs/commit/7aed955f4282d10df4e222a402b5701f9b874a88) Thanks [@alanrsoares](https://github.com/alanrsoares)! - Add eslint config & scripts to all packages

## 0.2.1

### Patch Changes

- initial release of deposit-address package

## 0.2.0

### Minor Changes

- aac5d21: Refactor api, transaction-recovery & core modules to support isomorphic clients

## 0.1.3

### Patch Changes

- add s3 links for testnet/mainnet

## 0.1.2

### Patch Changes

- Initial release

## 0.1.1

### Patch Changes

- ded7e8f: Validating the integration with changesets
