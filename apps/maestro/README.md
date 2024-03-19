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

### Scripts

The following scripts are available in the project:

- `dev`: Starts the development server using `next dev`.
- `build`: Runs the `build.sh` script to build the production version of the app.
- `build:analyze`: Runs the `build` script with the `ANALYZE` environment variable set to `true`, which generates a report of the bundle size and dependencies.
- `start`: Starts the production server using `next start`.
- `lint`: Runs `next lint` to check for linting errors.
- `dev:e2e`: Starts the development server with end-to-end testing enabled.
- `test:e2e`: Runs end-to-end tests using `playwright`.
- `ci:e2e`: Runs end-to-end tests in a continuous integration environment using `playwright`.
- `test`: Runs unit tests using `vitest`.
- `test:coverage`: Runs unit tests with coverage reporting using `vitest`.
- `sync`: Runs the `sync.cjs` script to sync the app with other environments.
- `codegen`: Runs the `wagmi generate` command to generate typesafe react-query client for interacting with the ITS contracts.

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

### Docs

- [lib](/apps/maestro/src/lib/) libraries and application specific utilities
  - [auth](/apps/maestro/src/lib/auth) auth utilities and hooks
  - [drizle](/apps/maestro/src/lib/drizzle) drizzle setup
    - [schema](/apps/maestro/src/lib/drizzle/schema) relational db schema
