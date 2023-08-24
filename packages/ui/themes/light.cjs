const lightTheme = require("daisyui/src/theming/themes")["[data-theme=light]"];

const base = require("./base.cjs");

/** @type {import('daisyui').CustomTheme} */
const BASE_THEME = {
  ...lightTheme,
  ...base,
};

/** @type {import('daisyui').CustomTheme} */
const theme = {
  ...BASE_THEME,
  /// Add your custom theme overrides here
  "base-200": "#EBF6FC",
  "base-300": "#bfe2f5",
};

module.exports = theme;
