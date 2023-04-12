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
