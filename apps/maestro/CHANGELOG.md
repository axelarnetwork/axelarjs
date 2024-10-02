# @axelarjs/maestro

## 0.3.27

### Patch Changes

- [#460](https://github.com/axelarnetwork/axelarjs/pull/460) [`2212d30216b3af7b6d2c2bfce0318bb3de62678b`](https://github.com/axelarnetwork/axelarjs/commit/2212d30216b3af7b6d2c2bfce0318bb3de62678b) Thanks [@SGiaccobasso](https://github.com/SGiaccobasso)! - allow making transfers for tokens with 0 decimals

## 0.3.26

### Patch Changes

- [#454](https://github.com/axelarnetwork/axelarjs/pull/454) [`649ec35ad543c44fd6eb73ee18a184952b9e7598`](https://github.com/axelarnetwork/axelarjs/commit/649ec35ad543c44fd6eb73ee18a184952b9e7598) Thanks [@SGiaccobasso](https://github.com/SGiaccobasso)! - fix search interchain tokens query issue where it was only looking at the results for the first chain searched

## 0.3.25

### Patch Changes

- [#447](https://github.com/axelarnetwork/axelarjs/pull/447) [`590054af2f65d980e23494d607623a2e8aac9107`](https://github.com/axelarnetwork/axelarjs/commit/590054af2f65d980e23494d607623a2e8aac9107) Thanks [@SGiaccobasso](https://github.com/SGiaccobasso)! - only try to recover deployment message id once

## 0.3.24

### Patch Changes

- [#443](https://github.com/axelarnetwork/axelarjs/pull/443) [`1dc6b79a47c8cad509b7c061bba47117232745ce`](https://github.com/axelarnetwork/axelarjs/commit/1dc6b79a47c8cad509b7c061bba47117232745ce) Thanks [@SGiaccobasso](https://github.com/SGiaccobasso)! - add backup rpc urls to all mainnet chains

## 0.3.23

### Patch Changes

- [#437](https://github.com/axelarnetwork/axelarjs/pull/437) [`517aa840340bc6132f7f4f7bc8ad3ffd01d483aa`](https://github.com/axelarnetwork/axelarjs/commit/517aa840340bc6132f7f4f7bc8ad3ffd01d483aa) Thanks [@SGiaccobasso](https://github.com/SGiaccobasso)! - add support for polygon amoy and linea sepolia, update viem dependency

- Updated dependencies [[`517aa840340bc6132f7f4f7bc8ad3ffd01d483aa`](https://github.com/axelarnetwork/axelarjs/commit/517aa840340bc6132f7f4f7bc8ad3ffd01d483aa)]:
  - @axelarjs/evm@0.2.6

## 0.3.22

### Patch Changes

- [#431](https://github.com/axelarnetwork/axelarjs/pull/431) [`d55c7cf40167ce6092461e2dc42a48686817d687`](https://github.com/axelarnetwork/axelarjs/commit/d55c7cf40167ce6092461e2dc42a48686817d687) Thanks [@SGiaccobasso](https://github.com/SGiaccobasso)! - create a trpc to recover deployment message ids and use it in token details page to automatically check and recover the missing ids.

## 0.3.21

### Patch Changes

- [#424](https://github.com/axelarnetwork/axelarjs/pull/424) [`6f38bf8c9e1df3090e86d5b240f6e5c9d7df8146`](https://github.com/axelarnetwork/axelarjs/commit/6f38bf8c9e1df3090e86d5b240f6e5c9d7df8146) Thanks [@npty](https://github.com/npty)! - fix: token details disappear

## 0.3.20

### Patch Changes

- [#418](https://github.com/axelarnetwork/axelarjs/pull/418) [`35bd4f6c6266bdbeb809c12a9aba5fb8c2a241f2`](https://github.com/axelarnetwork/axelarjs/commit/35bd4f6c6266bdbeb809c12a9aba5fb8c2a241f2) Thanks [@SGiaccobasso](https://github.com/SGiaccobasso)! - Change search erc20 query config so it does not retry on error, make RPC calls in getERC20TokenDetails and searchInterchainToken methods concurrent..

- Updated dependencies [[`d735846abf98f9960311b21c523360f40d6e55e3`](https://github.com/axelarnetwork/axelarjs/commit/d735846abf98f9960311b21c523360f40d6e55e3)]:
  - @axelarjs/api@0.4.6
  - @axelarjs/evm@0.2.5

## 0.3.19

### Patch Changes

- [#410](https://github.com/axelarnetwork/axelarjs/pull/410) [`775cc3c563d3b0c74b4c015fcaa50dcad974a0e3`](https://github.com/axelarnetwork/axelarjs/commit/775cc3c563d3b0c74b4c015fcaa50dcad974a0e3) Thanks [@SGiaccobasso](https://github.com/SGiaccobasso)! - Added Immutable chain support to both testnet and mainnet.

- [#409](https://github.com/axelarnetwork/axelarjs/pull/409) [`8480aa6b0d744cd13528117f934498d6576624ee`](https://github.com/axelarnetwork/axelarjs/commit/8480aa6b0d744cd13528117f934498d6576624ee) Thanks [@SGiaccobasso](https://github.com/SGiaccobasso)! - Added cookie consent banner to interchain.axelar.dev

- Updated dependencies [[`e15a2ca45e3dd2148e103dced4e2dee94b65eae8`](https://github.com/axelarnetwork/axelarjs/commit/e15a2ca45e3dd2148e103dced4e2dee94b65eae8)]:
  - @axelarjs/api@0.4.5
  - @axelarjs/evm@0.2.5

## 0.3.18

### Patch Changes

- [#399](https://github.com/axelarnetwork/axelarjs/pull/399) [`857e7e2cfef16ea6d023df7e188c161bb9d8c762`](https://github.com/axelarnetwork/axelarjs/commit/857e7e2cfef16ea6d023df7e188c161bb9d8c762) Thanks [@SGiaccobasso](https://github.com/SGiaccobasso)! - changed background animation from video to canvas

- [#403](https://github.com/axelarnetwork/axelarjs/pull/403) [`805d4e04362d2e1fc648894d1d2cc8fc001530f3`](https://github.com/axelarnetwork/axelarjs/commit/805d4e04362d2e1fc648894d1d2cc8fc001530f3) Thanks [@SGiaccobasso](https://github.com/SGiaccobasso)! - Fix first time visitors modal appearing only after connecting wallet. Update about button in footer to show the new modal.

## 0.3.17

### Patch Changes

- Updated dependencies [[`e987e82bfd33c23b46bdbd20b62af16e8b9581d5`](https://github.com/axelarnetwork/axelarjs/commit/e987e82bfd33c23b46bdbd20b62af16e8b9581d5)]:
  - @axelarjs/api@0.4.4
  - @axelarjs/evm@0.2.5

## 0.3.16

### Patch Changes

- [#393](https://github.com/axelarnetwork/axelarjs/pull/393) [`f7b306a04d3e5adb2b4cc0dda28c6013fc4ee47c`](https://github.com/axelarnetwork/axelarjs/commit/f7b306a04d3e5adb2b4cc0dda28c6013fc4ee47c) Thanks [@SGiaccobasso](https://github.com/SGiaccobasso)! - create first time visitor modal, add twitter conversion tracking code

- Updated dependencies [[`1d7f53c0d521a7cb974080c3c51bd3b60fd4f762`](https://github.com/axelarnetwork/axelarjs/commit/1d7f53c0d521a7cb974080c3c51bd3b60fd4f762)]:
  - @axelarjs/api@0.4.3
  - @axelarjs/evm@0.2.5

## 0.3.15

### Patch Changes

- Updated dependencies [[`1ab5e2790918dc028af93a918c6fdd99704979d0`](https://github.com/axelarnetwork/axelarjs/commit/1ab5e2790918dc028af93a918c6fdd99704979d0)]:
  - @axelarjs/api@0.4.2

## 0.3.14

### Patch Changes

- Updated dependencies [[`91125948f65e644a14c1579b6d3e71198aed0256`](https://github.com/axelarnetwork/axelarjs/commit/91125948f65e644a14c1579b6d3e71198aed0256)]:
  - @axelarjs/api@0.4.1

## 0.3.13

### Patch Changes

- [#363](https://github.com/axelarnetwork/axelarjs/pull/363) [`234f9255090a7bc735b9229d380ab1725b2f0946`](https://github.com/axelarnetwork/axelarjs/commit/234f9255090a7bc735b9229d380ab1725b2f0946) Thanks [@npty](https://github.com/npty)! - - Added `manualRelayToDestChain` function in the `@axelarjs/transaction-recovery` module for enhanced transaction recovery capabilities.
  - Added `searchBatchedCommands` query for the Axelarscan client in the `@axelarjs/api` module.
  - Added Axelar Recovery client to facilitate server-side signing of Axelar transactions in the `@axelarjs/api` module.
  - Added `AXELAR_LCD_URLS` to `@axelarjs/core` module.
  - Added `connectToFirstAvailable` function to allow passing multiple rpc urls and connect to first available node in the `@axelarjs/cosmos` module.
- Updated dependencies [[`234f9255090a7bc735b9229d380ab1725b2f0946`](https://github.com/axelarnetwork/axelarjs/commit/234f9255090a7bc735b9229d380ab1725b2f0946)]:
  - @axelarjs/api@0.4.0
  - @axelarjs/core@0.2.11

## 0.3.12

### Patch Changes

- [#374](https://github.com/axelarnetwork/axelarjs/pull/374) [`9dc9a7fe22f04ab9d505aa877526ee40e75e386a`](https://github.com/axelarnetwork/axelarjs/commit/9dc9a7fe22f04ab9d505aa877526ee40e75e386a) Thanks [@canhtrinh](https://github.com/canhtrinh)! - adding recent deployment tab; various bugfixes

## 0.3.11

### Patch Changes

- [#330](https://github.com/axelarnetwork/axelarjs/pull/330) [`52da903753e7c9aa1ebd2440e91b4169afbe4c6c`](https://github.com/axelarnetwork/axelarjs/commit/52da903753e7c9aa1ebd2440e91b4169afbe4c6c) Thanks [@npty](https://github.com/npty)! - - feat: prefill claim token ownership form https://github.com/axelarnetwork/axelarjs/pull/327
  - chore: update axelarjs-sdk to 0.15.0 and pass executeData for more accurate gas estimation https://github.com/axelarnetwork/axelarjs/pull/324
  - chore: add report bug at the footer https://github.com/axelarnetwork/axelarjs/pull/321
  - chore: improve clarity in the root page that user can change the chain https://github.com/axelarnetwork/axelarjs/pull/320
  - chore: update axelar logo to improve branding prominence https://github.com/axelarnetwork/axelarjs/pull/319
  - feat: add whitelist token on squid link https://github.com/axelarnetwork/axelarjs/pull/315
  - chore: add provide liquidity button to dex for each chain in the token details page https://github.com/axelarnetwork/axelarjs/pull/317
  - chore: update ITS contracts to v1.2.4 https://github.com/axelarnetwork/axelarjs/pull/307
  - chore: add note that logo only works at ITS portal https://github.com/axelarnetwork/axelarjs/pull/336
  - chore: update squid link tooltip https://github.com/axelarnetwork/axelarjs/pull/335
  - chore: update marketing form label https://github.com/axelarnetwork/axelarjs/pull/334
- Updated dependencies [[`52da903753e7c9aa1ebd2440e91b4169afbe4c6c`](https://github.com/axelarnetwork/axelarjs/commit/52da903753e7c9aa1ebd2440e91b4169afbe4c6c)]:
  - @axelarjs/evm@0.2.4

## 0.3.10

### Patch Changes

- Updated dependencies [[`dfcf1a1a81ee298323fae4919aa254156c4f7349`](https://github.com/axelarnetwork/axelarjs/commit/dfcf1a1a81ee298323fae4919aa254156c4f7349)]:
  - @axelarjs/api@0.3.15

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
