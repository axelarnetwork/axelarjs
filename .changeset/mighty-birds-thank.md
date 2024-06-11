---
"@axelarjs/transaction-recovery": minor
"@axelarjs/api": minor
"@axelarjs/cosmos": patch
"@axelarjs/core": patch
"@axelarjs/maestro": patch
---

- Added `manualRelayToDestChain` function in the `@axelarjs/transaction-recovery` module for enhanced transaction recovery capabilities.
- Added `searchBatchedCommands` query for the Axelarscan client in the `@axelarjs/api` module.
- Added Axelar Recovery client to facilitate server-side signing of Axelar transactions in the `@axelarjs/api` module.
- Added `AXELAR_LCD_URLS` to `@axelarjs/core` module.
- Added `connectToFirstAvailable` function to allow passing multiple rpc urls and connect to first available node in the `@axelarjs/cosmos` module.
