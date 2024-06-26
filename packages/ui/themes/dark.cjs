/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
const darkTheme = require("daisyui/src/theming/themes")["dark"];

const base = require("./base.cjs");

/** @type {import('daisyui').CustomTheme} */
const BASE_THEME = { ...darkTheme, ...base };

/** @type {import('daisyui').CustomTheme} */
const theme = {
  ...BASE_THEME,
  "base-200": "#0F1214",
  "base-300": "#000000",
  /// Add your custom theme overrides here
};

module.exports = theme;
