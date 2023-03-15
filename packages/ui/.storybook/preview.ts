import type { Preview } from "@storybook/react";

import "../src/base.css";

const preview: Preview = {
  parameters: {
    backgrounds: {},
    actions: {
      argTypesRegex: "^on[A-Z].*",
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;
