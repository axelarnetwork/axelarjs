# Interchain Maestro

Orchestration for cross-chain tokens & contracts

### Getting started

1. Install dependencies

```bash
pnpm i
```

2. Run the application

```bash
pnpm dev
```

### E2E tests

To run the ui end to end tests, you'll need to install [`foundry`](https://getfoundry.sh/)

once you have set up Foundry, on one terminal start the dev server and [`anvil`](https://book.getfoundry.sh/anvil/)

```bash
pnpm dev:e2e
```

on another terminal, run the tests

```
pnpm test:e2e
```
