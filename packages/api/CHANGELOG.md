# @axelarjs/api

## 0.4.8

### Patch Changes

- Updated dependencies [[`dd036a5c4dbd67c7e78b9493849cccc4b2010001`](https://github.com/axelarnetwork/axelarjs/commit/dd036a5c4dbd67c7e78b9493849cccc4b2010001)]:
  - @axelarjs/core@0.2.13
  - @axelarjs/cosmos@0.2.14

## 0.4.7

### Patch Changes

- [#553](https://github.com/axelarnetwork/axelarjs/pull/553) [`39b4ce770e3072a0e83bb99c649bbd521eb7604e`](https://github.com/axelarnetwork/axelarjs/commit/39b4ce770e3072a0e83bb99c649bbd521eb7604e) Thanks [@npty](https://github.com/npty)! - Modify chain config types to support sui on devnet-amplifier env

- [#553](https://github.com/axelarnetwork/axelarjs/pull/553) [`39b4ce770e3072a0e83bb99c649bbd521eb7604e`](https://github.com/axelarnetwork/axelarjs/commit/39b4ce770e3072a0e83bb99c649bbd521eb7604e) Thanks [@npty](https://github.com/npty)! - Supported devnet-amplifier

- Updated dependencies [[`39b4ce770e3072a0e83bb99c649bbd521eb7604e`](https://github.com/axelarnetwork/axelarjs/commit/39b4ce770e3072a0e83bb99c649bbd521eb7604e)]:
  - @axelarjs/cosmos@0.2.14
  - @axelarjs/core@0.2.12

## 0.4.6

### Patch Changes

- [#416](https://github.com/axelarnetwork/axelarjs/pull/416) [`d735846abf98f9960311b21c523360f40d6e55e3`](https://github.com/axelarnetwork/axelarjs/commit/d735846abf98f9960311b21c523360f40d6e55e3) Thanks [@SGiaccobasso](https://github.com/SGiaccobasso)! - Add getNativeGasBaseFee to the axelar-query API, migrated it from axelarjs-sdk.

## 0.4.5

### Patch Changes

- [#407](https://github.com/axelarnetwork/axelarjs/pull/407) [`e15a2ca45e3dd2148e103dced4e2dee94b65eae8`](https://github.com/axelarnetwork/axelarjs/commit/e15a2ca45e3dd2148e103dced4e2dee94b65eae8) Thanks [@npty](https://github.com/npty)! - Added `getSymbolFromDenom` and `getDenomFromSymbol` functions

## 0.4.4

### Patch Changes

- [#397](https://github.com/axelarnetwork/axelarjs/pull/397) [`e987e82bfd33c23b46bdbd20b62af16e8b9581d5`](https://github.com/axelarnetwork/axelarjs/commit/e987e82bfd33c23b46bdbd20b62af16e8b9581d5) Thanks [@npty](https://github.com/npty)! - chore: fix rounding issue for estimateGasFee api

## 0.4.3

### Patch Changes

- [#380](https://github.com/axelarnetwork/axelarjs/pull/380) [`1d7f53c0d521a7cb974080c3c51bd3b60fd4f762`](https://github.com/axelarnetwork/axelarjs/commit/1d7f53c0d521a7cb974080c3c51bd3b60fd4f762) Thanks [@npty](https://github.com/npty)! - feat: add evmExecute for transaction-recovery package

## 0.4.2

### Patch Changes

- [#383](https://github.com/axelarnetwork/axelarjs/pull/383) [`1ab5e2790918dc028af93a918c6fdd99704979d0`](https://github.com/axelarnetwork/axelarjs/commit/1ab5e2790918dc028af93a918c6fdd99704979d0) Thanks [@npty](https://github.com/npty)! - make txHash optional for searchGMP api

## 0.4.1

### Patch Changes

- [#379](https://github.com/axelarnetwork/axelarjs/pull/379) [`91125948f65e644a14c1579b6d3e71198aed0256`](https://github.com/axelarnetwork/axelarjs/commit/91125948f65e644a14c1579b6d3e71198aed0256) Thanks [@npty](https://github.com/npty)! - chore: add queryTransactionStatus to transaction-recovery package

## 0.4.0

### Minor Changes

- [#363](https://github.com/axelarnetwork/axelarjs/pull/363) [`234f9255090a7bc735b9229d380ab1725b2f0946`](https://github.com/axelarnetwork/axelarjs/commit/234f9255090a7bc735b9229d380ab1725b2f0946) Thanks [@npty](https://github.com/npty)! - - Added `manualRelayToDestChain` function in the `@axelarjs/transaction-recovery` module for enhanced transaction recovery capabilities.
  - Added `searchBatchedCommands` query for the Axelarscan client in the `@axelarjs/api` module.
  - Added Axelar Recovery client to facilitate server-side signing of Axelar transactions in the `@axelarjs/api` module.
  - Added `AXELAR_LCD_URLS` to `@axelarjs/core` module.
  - Added `connectToFirstAvailable` function to allow passing multiple rpc urls and connect to first available node in the `@axelarjs/cosmos` module.

### Patch Changes

- Updated dependencies [[`234f9255090a7bc735b9229d380ab1725b2f0946`](https://github.com/axelarnetwork/axelarjs/commit/234f9255090a7bc735b9229d380ab1725b2f0946)]:
  - @axelarjs/cosmos@0.2.13
  - @axelarjs/core@0.2.11

## 0.3.15

### Patch Changes

- [#285](https://github.com/axelarnetwork/axelarjs/pull/285) [`dfcf1a1a81ee298323fae4919aa254156c4f7349`](https://github.com/axelarnetwork/axelarjs/commit/dfcf1a1a81ee298323fae4919aa254156c4f7349) Thanks [@npty](https://github.com/npty)! - Improve l1 fee calculation for estimateGasFee

## 0.3.14

### Patch Changes

- [#298](https://github.com/axelarnetwork/axelarjs/pull/298) [`a68c1ec6956d9d7ea8d5ed0c8dc79f1a131e8476`](https://github.com/axelarnetwork/axelarjs/commit/a68c1ec6956d9d7ea8d5ed0c8dc79f1a131e8476) Thanks [@canhtrinh](https://github.com/canhtrinh)! - make axelarjs/utils an explicit dependency

## 0.3.13

### Patch Changes

- [#296](https://github.com/axelarnetwork/axelarjs/pull/296) [`96d2d53db8396c726474141724c339af19072bf2`](https://github.com/axelarnetwork/axelarjs/commit/96d2d53db8396c726474141724c339af19072bf2) Thanks [@canhtrinh](https://github.com/canhtrinh)! - - chore: update packages affected by api/axelar-configs schema change
  - chore: various docs updates: https://github.com/axelarnetwork/axelarjs/pull/291

## 0.3.12

### Patch Changes

- Updated dependencies [[`a5e1a286dd12260d9a9ae09610dd2c5fd6a16e14`](https://github.com/axelarnetwork/axelarjs/commit/a5e1a286dd12260d9a9ae09610dd2c5fd6a16e14)]:
  - @axelarjs/core@0.2.10

## 0.3.11

### Patch Changes

- [`2011bbf4ee3200f1799752bc65147cd2f5325e11`](https://github.com/axelarnetwork/axelarjs/commit/2011bbf4ee3200f1799752bc65147cd2f5325e11) Thanks [@alanrsoares](https://github.com/alanrsoares)! - apps/maestro:
  - optimize searchGMP calls
  - fix token details line height
  - fix search results to center lookup token to origin token
  - move direct calls to searchGMP to trpc queries
  - upgrade dependencies

  packages/api:
  - update searchGMP params to support array of contract methods

## 0.3.10

### Patch Changes

- [`8af9be960271e3f668495db662583d545b69e502`](https://github.com/axelarnetwork/axelarjs/commit/8af9be960271e3f668495db662583d545b69e502) Thanks [@canhtrinh](https://github.com/canhtrinh)! - add native asset support for deposit address package

## 0.3.9

### Patch Changes

- [`81e1156303ded74b1e20ee9e2bd638c04562591d`](https://github.com/axelarnetwork/axelarjs/commit/81e1156303ded74b1e20ee9e2bd638c04562591d) Thanks [@alanrsoares](https://github.com/alanrsoares)! - fix: update BaseChainConfig type

## 0.3.8

### Patch Changes

- [#95](https://github.com/axelarnetwork/axelarjs/pull/95) [`6c6912ca1ce5bb6d9bdcd6cd16fe79c93cd01ad0`](https://github.com/axelarnetwork/axelarjs/commit/6c6912ca1ce5bb6d9bdcd6cd16fe79c93cd01ad0) Thanks [@alanrsoares](https://github.com/alanrsoares)! - feat: migrate recent transactions event mapping for interchain transfers and token deployments

## 0.3.7

### Patch Changes

- [`e8ac19df`](https://github.com/axelarnetwork/axelarjs/commit/e8ac19df530670f4f7b5b6a35565c2d79c1e0201) Thanks [@alanrsoares](https://github.com/alanrsoares)! - upgrade dependencies

## 0.3.6

### Patch Changes

- [`c2ebc082`](https://github.com/axelarnetwork/axelarjs/commit/c2ebc082d4517e7f920c707e23fd0d00884ed0a1) Thanks [@alanrsoares](https://github.com/alanrsoares)! - "chore: restructure axelarjs/api exports"

## 0.3.5

### Patch Changes

- [`007badef`](https://github.com/axelarnetwork/axelarjs/commit/007badefffc11047e4d50aeb5052fbc2ad91cb57) Thanks [@alanrsoares](https://github.com/alanrsoares)! - Update AssetConfig.module to use 'axelarnet' instead of 'cosmos'

## 0.3.4

### Patch Changes

- [`22607518`](https://github.com/axelarnetwork/axelarjs/commit/226075180e5443cf7ad1a2aeb10e6ba9d347e693) Thanks [@alanrsoares](https://github.com/alanrsoares)! - Update @axelarjs/api/axelar-config types

## 0.3.3

### Patch Changes

- Updated dependencies [[`7376c166`](https://github.com/axelarnetwork/axelarjs/commit/7376c16636b0dc165d26545fc4d094e9917cbcea)]:
  - @axelarjs/core@0.2.9

## 0.3.2

### Patch Changes

- [`9d629a90`](https://github.com/axelarnetwork/axelarjs/commit/9d629a900e3597d0ddf4944112225873e0e4ca0e) Thanks [@alanrsoares](https://github.com/alanrsoares)! - Move http client to packages/utils

## 0.3.1

### Patch Changes

- [`42204ed7`](https://github.com/axelarnetwork/axelarjs/commit/42204ed79efac23a74b4333a452bb29cb6dfe020) Thanks [@alanrsoares](https://github.com/alanrsoares)! - Remove `"type": "module"` from packages

- Updated dependencies [[`42204ed7`](https://github.com/axelarnetwork/axelarjs/commit/42204ed79efac23a74b4333a452bb29cb6dfe020)]:
  - @axelarjs/core@0.2.8

## 0.3.0

### Minor Changes

- [`4b8adb6f`](https://github.com/axelarnetwork/axelarjs/commit/4b8adb6f18b69745aad3045519d870e880ec226a) Thanks [@alanrsoares](https://github.com/alanrsoares)! - - Migrage api clients to use minimalistic isomorphic http client based on `isomorphic-unfetc`
  - upgrade dependencies

### Patch Changes

- Updated dependencies [[`4b8adb6f`](https://github.com/axelarnetwork/axelarjs/commit/4b8adb6f18b69745aad3045519d870e880ec226a)]:
  - @axelarjs/core@0.2.7

## 0.2.11

### Patch Changes

- [`4b3af121`](https://github.com/axelarnetwork/axelarjs/commit/4b3af121ead0b04685252f0aad8cbc36d7472766) Thanks [@alanrsoares](https://github.com/alanrsoares)! - fix module exports

## 0.2.10

### Patch Changes

- [`15f35e76`](https://github.com/axelarnetwork/axelarjs/commit/15f35e762ce7506ebb80db9eaba6b2f0ad142814) Thanks [@alanrsoares](https://github.com/alanrsoares)! - Standardize isomorphic client package exports

## 0.2.9

### Patch Changes

- [#59](https://github.com/axelarnetwork/axelarjs/pull/59) [`72df92de`](https://github.com/axelarnetwork/axelarjs/commit/72df92de09c0d41156708ce3f93263c039370675) Thanks [@alanrsoares](https://github.com/alanrsoares)! - Introduce typesafe native cosmos messages via AxelarSigningStargateClient

## 0.2.8

### Patch Changes

- [`a7457a7b`](https://github.com/axelarnetwork/axelarjs/commit/a7457a7b5ad7d0b5bcc1dfcf483dc335ea61cb86) Thanks [@canhtrinh](https://github.com/canhtrinh)! - update build settings for deposit-address module

- Updated dependencies [[`a7457a7b`](https://github.com/axelarnetwork/axelarjs/commit/a7457a7b5ad7d0b5bcc1dfcf483dc335ea61cb86)]:
  - @axelarjs/core@0.2.6

## 0.2.7

### Patch Changes

- [`59d3ff8f`](https://github.com/axelarnetwork/axelarjs/commit/59d3ff8fa77fefe3639a8fb1f7cf3263162c360e) Thanks [@canhtrinh](https://github.com/canhtrinh)! - bumping all dependencies

- Updated dependencies [[`59d3ff8f`](https://github.com/axelarnetwork/axelarjs/commit/59d3ff8fa77fefe3639a8fb1f7cf3263162c360e)]:
  - @axelarjs/core@0.2.5

## 0.2.6

### Patch Changes

- [`2d76167d`](https://github.com/axelarnetwork/axelarjs/commit/2d76167d40b2a58d753c585d955e0e77c7c028cf) Thanks [@canhtrinh](https://github.com/canhtrinh)! - fix regression issues related to deposit-address-api rename

## 0.2.5

### Patch Changes

- [`c9efbb15`](https://github.com/axelarnetwork/axelarjs/commit/c9efbb1523ca6cf06d56865a0115cf214e16b1c7) Thanks [@alanrsoares](https://github.com/alanrsoares)! - Do not use path aliases in publishable packages

- Updated dependencies [[`c9efbb15`](https://github.com/axelarnetwork/axelarjs/commit/c9efbb1523ca6cf06d56865a0115cf214e16b1c7)]:
  - @axelarjs/core@0.2.4

## 0.2.4

### Patch Changes

- [`c2b0fa7c`](https://github.com/axelarnetwork/axelarjs/commit/c2b0fa7c3920102a30e3e6d205e5574586c47d98) Thanks [@alanrsoares](https://github.com/alanrsoares)! - - @axelarjs/cosmos: Implement AxelarSigningStargateClient
  - @axelarjs/utils: Add `memoize` util to `functions` module
  - @axelarjs/proto: Upgrade protobuf dependencies
  - all: upgrade vitest
- Updated dependencies [[`c2b0fa7c`](https://github.com/axelarnetwork/axelarjs/commit/c2b0fa7c3920102a30e3e6d205e5574586c47d98)]:
  - @axelarjs/core@0.2.3

## 0.2.3

### Patch Changes

- [`7aed955f`](https://github.com/axelarnetwork/axelarjs/commit/7aed955f4282d10df4e222a402b5701f9b874a88) Thanks [@alanrsoares](https://github.com/alanrsoares)! - Add eslint config & scripts to all packages

- Updated dependencies [[`7aed955f`](https://github.com/axelarnetwork/axelarjs/commit/7aed955f4282d10df4e222a402b5701f9b874a88)]:
  - @axelarjs/core@0.2.2

## 0.2.2

### Patch Changes

- initial release of deposit-address package

- Updated dependencies []:
  - @axelarjs/core@0.2.1

## 0.2.1

### Patch Changes

- 0075481: Avoid circular references between browser and node clients

## 0.2.0

### Minor Changes

- aac5d21: Refactor api, transaction-recovery & core modules to support isomorphic clients

### Patch Changes

- Updated dependencies [aac5d21]
  - @axelarjs/core@0.2.0

## 0.1.15

### Patch Changes

- add getRecentLinkTransactions endpoint to axelarscan client

## 0.1.14

### Patch Changes

- Updated dependencies
  - @axelarjs/core@0.1.3

## 0.1.13

### Patch Changes

- trigger rebuild

## 0.1.12

### Patch Changes

- update SearchGMPResponse with SearchGMPGasPaid types; change logic that checks for valid base fee

## 0.1.11

### Patch Changes

- trigger rebuild

## 0.1.10

### Patch Changes

- converting base fee to wei

## 0.1.9

### Patch Changes

- fix bigint issue

## 0.1.8

### Patch Changes

- wrapping bigint class to BigNumberUtils

## 0.1.7

### Patch Changes

- updating api package.json to include wildcard exports

## 0.1.6

### Patch Changes

- adding typesVersions entry to api package.json

## 0.1.5

### Patch Changes

- export browser and node clients in axelar-query api

## 0.1.4

### Patch Changes

- add estimateGasFee query

## 0.1.3

### Patch Changes

- 0346444: upgrade dependencies

## 0.1.2

### Patch Changes

- Initial release

## 0.1.1

### Patch Changes

- ded7e8f: Validating the integration with changesets
