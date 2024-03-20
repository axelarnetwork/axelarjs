# @axelarjs/maestro

## 0.3.9

### Patch Changes

- Updated dependencies [[`a68c1ec6956d9d7ea8d5ed0c8dc79f1a131e8476`](https://github.com/axelarnetwork/axelarjs/commit/a68c1ec6956d9d7ea8d5ed0c8dc79f1a131e8476)]:
  - @axelarjs/api@0.3.14

## 0.3.8

### Patch Changes

- [#296](https://github.com/axelarnetwork/axelarjs/pull/296) [`96d2d53db8396c726474141724c339af19072bf2`](https://github.com/axelarnetwork/axelarjs/commit/96d2d53db8396c726474141724c339af19072bf2) Thanks [@canhtrinh](https://github.com/canhtrinh)! - - chore: update packages affected by api/axelar-configs schema change
  - chore: various docs updates: https://github.com/axelarnetwork/axelarjs/pull/291
- Updated dependencies [[`96d2d53db8396c726474141724c339af19072bf2`](https://github.com/axelarnetwork/axelarjs/commit/96d2d53db8396c726474141724c339af19072bf2)]:
  - @axelarjs/api@0.3.13

## 0.3.7

### Patch Changes

- [#293](https://github.com/axelarnetwork/axelarjs/pull/293) [`8e01374c5630271ceeab5c6d670b52c6a0ca225c`](https://github.com/axelarnetwork/axelarjs/commit/8e01374c5630271ceeab5c6d670b52c6a0ca225c) Thanks [@canhtrinh](https://github.com/canhtrinh)! - bump axelarjs-sdk version to 0.15.0-alpha.5

## 0.3.6

### Patch Changes

- [#289](https://github.com/axelarnetwork/axelarjs/pull/289) [`83e3d2a1b94e0a278050ea186206e659a51c03f2`](https://github.com/axelarnetwork/axelarjs/commit/83e3d2a1b94e0a278050ea186206e659a51c03f2) Thanks [@canhtrinh](https://github.com/canhtrinh)! -
- feat: added blast and fraxtal mainnet https://github.com/axelarnetwork/axelarjs/compare/%40axelarjs/maestro%400.3.4...main
- feat: added l2 sepolia testnets https://github.com/axelarnetwork/axelarjs/commit/9665458984f9994fdc24c43424245b4e37d30731
- feat: posted final results for its competition (https://github.com/axelarnetwork/axelarjs/commit/6473340dcb417abc6badda0d2dc559b792dc5c7f, https://github.com/axelarnetwork/axelarjs/commit/6c586fb29185e85ed1739d698e3555a58afb8419)
- fix: remove support for Coinbase and other wallets until proper wallet handling is done https://github.com/axelarnetwork/axelarjs/commit/9665458984f9994fdc24c43424245b4e37d30731
- fix: fix for canonical token id lookup https://github.com/axelarnetwork/axelarjs/commit/0e631079e7ab5b5c50888623367ff2bbf14d8043
- fix: validation on token logo upload https://github.com/axelarnetwork/axelarjs/commit/d1d9f477f5638cda5236ed28ec0562a79fec42ee
- fix: allow token deployer to deploy icon (vs. only a designated "minter" was only allowed before) https://github.com/axelarnetwork/axelarjs/commit/f6f74400d007358c6e5a7b019100a07d9dae19f3
- fix: tx status indicator not showing pending transaction on click https://github.com/axelarnetwork/axelarjs/commit/0336678d27beabe415369c8ffec6b8cba2e5d911

## 0.3.5

### Patch Changes

- Updated dependencies [[`a5e1a286dd12260d9a9ae09610dd2c5fd6a16e14`](https://github.com/axelarnetwork/axelarjs/commit/a5e1a286dd12260d9a9ae09610dd2c5fd6a16e14)]:
  - @axelarjs/core@0.2.10
  - @axelarjs/api@0.3.12

## 0.3.4

### Patch Changes

- [`2011bbf4ee3200f1799752bc65147cd2f5325e11`](https://github.com/axelarnetwork/axelarjs/commit/2011bbf4ee3200f1799752bc65147cd2f5325e11) Thanks [@alanrsoares](https://github.com/alanrsoares)! - apps/maestro:

  - optimize searchGMP calls
  - fix token details line height
  - fix search results to center lookup token to origin token
  - move direct calls to searchGMP to trpc queries
  - upgrade dependencies

  packages/api:

  - update searchGMP params to support array of contract methods

- Updated dependencies [[`2011bbf4ee3200f1799752bc65147cd2f5325e11`](https://github.com/axelarnetwork/axelarjs/commit/2011bbf4ee3200f1799752bc65147cd2f5325e11)]:
  - @axelarjs/api@0.3.11

## 0.3.3

### Patch Changes

- [`e4e1664fc4a6616f30b2a6749a35a0c30746908b`](https://github.com/axelarnetwork/axelarjs/commit/e4e1664fc4a6616f30b2a6749a35a0c30746908b) Thanks [@alanrsoares](https://github.com/alanrsoares)! - Bug fixes:

  - fix: polyfill BigInt.prototype.toJSON
  - fix: eligible target chains state derivation

## 0.3.2

### Patch Changes

- [`aaa737d71de784ef3cc0dbbfea723a08be85360c`](https://github.com/axelarnetwork/axelarjs/commit/aaa737d71de784ef3cc0dbbfea723a08be85360c) Thanks [@alanrsoares](https://github.com/alanrsoares)! - fix: canonical interchain transfer transaction

- Updated dependencies [[`aaa737d71de784ef3cc0dbbfea723a08be85360c`](https://github.com/axelarnetwork/axelarjs/commit/aaa737d71de784ef3cc0dbbfea723a08be85360c)]:
  - @axelarjs/evm@0.2.3

## 0.3.1

### Patch Changes

- [#213](https://github.com/axelarnetwork/axelarjs/pull/213) [`00968627b77307b3ad5787eab23c10ee5ea8d00d`](https://github.com/axelarnetwork/axelarjs/commit/00968627b77307b3ad5787eab23c10ee5ea8d00d) Thanks [@alanrsoares](https://github.com/alanrsoares)! - patch trpc-openapi@1.2.0 to fix integration with trpc@11.x

## 0.3.0

### Minor Changes

- [#211](https://github.com/axelarnetwork/axelarjs/pull/211) [`f4ef92e88669fc0cad487d63d70cda3fa5c69e80`](https://github.com/axelarnetwork/axelarjs/commit/f4ef92e88669fc0cad487d63d70cda3fa5c69e80) Thanks [@alanrsoares](https://github.com/alanrsoares)!

  - Major dependency upgrades:
    - react-query v5.x
    - wagmi v2.x
    - web3modal v4.x
    - tprc v11.x

  Bugfixes:

  - [#206](https://github.com/axelarnetwork/axelarjs/issues/206) locale related bigint parse issue on token deployment and interchain transfer flows -
  - [#204](https://github.com/axelarnetwork/axelarjs/pull/204) use 'auto' flag for gas multiplier to allow for dynamic multiplier when retrieving gas quotes

  UX:

  - Interhcain token page: new pending section for remote interchain tokens being deployed
  - [#210](https://github.com/axelarnetwork/axelarjs/pull/210) Token manager address for each registered token now appears in the card on the token details page
  - [#209](https://github.com/axelarnetwork/axelarjs/pull/209) Indexing custom token deployments now appears in leaderboard
  - [#203](https://github.com/axelarnetwork/axelarjs/issues/203) Enable feature for users to add their own logos

## 0.2.4

### Patch Changes

- [#152](https://github.com/axelarnetwork/axelarjs/pull/152) [`ff123516679e503597caeb94353f05e361102714`](https://github.com/axelarnetwork/axelarjs/commit/ff123516679e503597caeb94353f05e361102714) Thanks [@alanrsoares](https://github.com/alanrsoares)! - Upgrade evm clients with missing read functions

- Updated dependencies [[`ff123516679e503597caeb94353f05e361102714`](https://github.com/axelarnetwork/axelarjs/commit/ff123516679e503597caeb94353f05e361102714)]:
  - @axelarjs/evm@0.2.2

## 0.2.3

### Patch Changes

- Updated dependencies [[`8af9be960271e3f668495db662583d545b69e502`](https://github.com/axelarnetwork/axelarjs/commit/8af9be960271e3f668495db662583d545b69e502)]:
  - @axelarjs/api@0.3.10

## 0.2.2

### Patch Changes

- [`843bdbcfadd989dea5350267a12a4625ddbec6a3`](https://github.com/axelarnetwork/axelarjs/commit/843bdbcfadd989dea5350267a12a4625ddbec6a3) Thanks [@alanrsoares](https://github.com/alanrsoares)! -
  - Add token name disclaimers to Interchain and Canonical token deployment flows
  - Tweak haiku sharing ux
  - Upgrade nextjs to v14.1

## 0.2.1

### Patch Changes

- Updated dependencies
  - @axelarjs/api@0.1.2
  - @axelarjs/core@0.1.2
  - @axelarjs/evm@0.1.2
  - @axelarjs/utils@0.1.1
  - @axelarjs/ui@0.1.1

## 0.1.1

### Patch Changes

- Updated dependencies [ded7e8f]
  - @axelarjs/api@0.1.1
  - @axelarjs/core@0.1.1
  - @axelarjs/evm@0.1.1
