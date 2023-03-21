import React from "react";

import type { Preview } from "@storybook/react";

import { ThemeProvider } from "../src/components/ThemeSwitcher";

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
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
};

export default preview;
