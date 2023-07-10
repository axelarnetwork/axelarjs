# @axelarjs/ui

The interchain design system

### Getting started

clone this repository:

```sh
git clone git@github.com:axelarnetwork/axelar-ui.git && cd $_
```

install dependencies (use [pnpm](https://pnpm.io)):

```sh
pnpm i
```

run storybook:

```sh
pnpm storybook
```

### Features

- tailwindcss for styling
- radix primitives for accessible interactive components
- class-variant-authority for
- tailwind-merge utility for merging classNames
- tailwind-styled-components for styled-components-like component definition syntax
- storybook v7 for interactive docs
- prettier on precommit
- commitlint / conventional commits check on precommit

### Use Nextjs 13+ fonts

1. Import it on `_app.tsx`

```tsx
import { Cabin } from "next/font/google";

const fontSans = Cabin({
  subsets: ["latin"],
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <style jsx global>
        {`
          :root {
            --font-sans: ${fontSans.style.fontFamily};
          }
        `}
      </style>
      <Component {...pageProps} />;
    </>
  );
}

export default MyApp;
```

2. Configure tailwind.config.js

```ts
const { fontFamily } = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require("@axelarjs/ui/preset")],
  // ...
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
    },
  },
  // ...
};
```

### Scripts

The following scripts are available in the project:

- `dev`: Starts the development server using `vite`.
- `build`: Builds the production version of the app using `vite`.
- `lint`: Runs `eslint` to check for linting errors.
- `test`: Runs unit tests using `vitest`.
- `test:watch`: Runs unit tests in watch mode using `vitest`.
- `storybook`: Starts the Storybook development server.
- `build-storybook`: Builds the Storybook production version.
- `test:e2e`: Runs end-to-end tests using `zx`.
- `test:e2e:watch`: Runs end-to-end tests in watch mode using `zx`.
- `test:e2e:debug`: Runs end-to-end tests in debug mode using `zx`.
- `test:e2e:debug-watch`: Runs end-to-end tests in debug mode with watch mode enabled using `zx`.
- `test:e2e:ci`: Runs end-to-end tests in a continuous integration environment using `zx`.
- `format`: Formats the code using `prettier`.
- `format:check`: Checks the code formatting using `prettier`.
- `lint-staged`: Runs `eslint` and `prettier` on staged files using `husky` and `lint-staged`.
