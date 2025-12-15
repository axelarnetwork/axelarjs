# Interchain Maestro

Orchestration for cross-chain tokens & contracts.

### Getting started

0. Install tools

You need to have [node.js](https://nodejs.org/en) installed. Then, you need to enable pnpm, e.g. via corepack:

```
corepack enable pnpm
```

1. Install dependencies

On the root of the `axelarjs` repo, run:
```bash
pnpm i
```

2. Build the packages

On the root of the `axelarjs` repo, run:
```bash
pnpm run build:packages
```

3. On the `maestro` directory, copy `.env.example` into `.env.local`.

4. Set up Redis and Postgres ([see Environment Setup](#environment-setup)) and add their env vars to the `.env.local` you created.

5. Run the migrations

On the `maestro` directory, run:

```bash
pnpm drizzle:push
```

6. Run the application

On the `maestro` directory, run:

```bash
pnpm dev
```

Or, on the root of the `axelarjs` repo, run:

```bash
pnpm dev:maestro
```

### Scripts

The following scripts are available in the project:

- `dev`: Starts the development server using `next dev`.
- `build`: Runs the `build.sh` script to build the production version of the app.
- `build:analyze`: Runs the `build` script with the `ANALYZE` environment variable set to `true`, which generates a report of the bundle size and dependencies.
- `start`: Starts the production server using `next start`.
- `lint`: Runs `next lint` to check for linting errors.
- `lint:fix`: Automatically fixes linting errors using `next lint --fix`.
- `dev:e2e`: Starts the development server with end-to-end testing enabled.
- `test:e2e`: Runs end-to-end tests using `playwright`.
- `ci:e2e`: Runs end-to-end tests in a continuous integration environment using `playwright`.
- `test`: Runs unit tests using `vitest`.
- `test:coverage`: Runs unit tests with coverage reporting using `vitest`.
- `sync`: Runs the `sync.cjs` script to sync the app with other environments.
- `codegen`: Runs the `wagmi generate` command to generate typesafe react-query client for interacting with the ITS contracts.
- `codegen:env`: Runs the `scripts/env.ts` script to generate a TypeScript file with type-safe environment variable exports.
- `release`: Creates a github release from the latest [changelog](/apps/maestro/CHANGELOG.md) entry.

### Database Migrations

This app uses Drizzle ORM for database management. The following migration commands are available:

- `drizzle:generate`: Generates new migration files based on schema changes
- `drizzle:up`: Applies all pending migrations to the database
- `drizzle:push`: Pushes schema changes directly to database (use with caution in production)
- `drizzle:studio`: Opens Drizzle Studio to view and manage your database

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

### Environment Setup

#### Upstash Redis Setup

1. **Create Upstash Redis Database:**
   Either via [Vercel](https://vercel.com) or [Upstash Console](https://console.upstash.com/).

2. **Add to .env.local:**
```bash
# Redis Configuration (Upstash)
KV_REST_API_READ_ONLY_TOKEN="your-upstash-read-only-token"
KV_REST_API_TOKEN="your-upstash-api-token"
KV_REST_API_URL="your-upstash-rest-api-url"
KV_URL="redis://default:your-upstash-password@your-upstash-host:your-upstash-port"
```

#### Neon PostgreSQL Setup

1. **Create Neon Database:**
   Either via [Vercel](https://vercel.com) or [Neon Console](https://console.neon.tech/).

2. **Add to .env.local:**
```bash
# PostgreSQL Configuration (Neon)
POSTGRES_URL="postgresql://username:password@hostname/database?sslmode=require"
POSTGRES_URL_NON_POOLING="postgresql://username:password@hostname/database?sslmode=require"
POSTGRES_USER="username"
POSTGRES_HOST="hostname"
POSTGRES_PASSWORD="password"
POSTGRES_DATABASE="database"
POSTGRES_URL_NO_SSL="postgresql://username:password@hostname/database"
POSTGRES_PRISMA_URL="postgresql://username:password@hostname/database?sslmode=require"
```

### Docs

- [lib](/apps/maestro/src/lib/) libraries and application specific utilities
  - [auth](/apps/maestro/src/lib/auth) auth utilities and hooks
  - [drizle](/apps/maestro/src/lib/drizzle) drizzle setup
    - [schema](/apps/maestro/src/lib/drizzle/schema) relational db schema
- [server](/apps/maestro/src/server/) tRPC routers/procedures
- [config](/apps/maestro/src/config/) application configuration and environment setup
- [features](/apps/maestro/src/features/) feature components and business logic
- [pages](/apps/maestro/src/pages/) Next.js page components and routing
- [services](/apps/maestro/src/services/) external service integrations and API clients
- [styles](/apps/maestro/src/styles/) global styles and CSS configuration
- [ui](/apps/maestro/src/ui/) reusable UI components and layouts
  - [components](/apps/maestro/src/ui/components/) reusable UI components
  - [compounds](/apps/maestro/src/ui/compounds/) complex composite components
  - [layouts](/apps/maestro/src/ui/layouts/) layout and structure components
