# @axelarjs/maestro

## 0.3.1

### Patch Changes

- [#213](https://github.com/axelarnetwork/axelarjs/pull/213) [`00968627b77307b3ad5787eab23c10ee5ea8d00d`](https://github.com/axelarnetwork/axelarjs/commit/00968627b77307b3ad5787eab23c10ee5ea8d00d) Thanks [@alanrsoares](https://github.com/alanrsoares)! - patch trpc-openapi@1.2.0 to fix integration with trpc@11.x

## 0.3.0

### Minor Changes

- [#211](https://github.com/axelarnetwork/axelarjs/pull/211) [`f4ef92e88669fc0cad487d63d70cda3fa5c69e80`](https://github.com/axelarnetwork/axelarjs/commit/f4ef92e88669fc0cad487d63d70cda3fa5c69e80) Thanks [@alanrsoares](https://github.com/alanrsoares)! - Major upgrade of dependencies:

  - react-query v5.x
  - wagmi v2.x
  - web3modal v4.x
  - tprc v11.x

  Bugfixes:

  - locale related bigint parse issue on token deployment and interchain transfer flows
  - use 'auto' flag for gas multiplier to allow for dynamic multiplier when retrieving gas quotes

  UX:

  - Interhcain token page: new pending section for remote interchain tokens being deployed

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
