const darkTheme = require("daisyui/src/theming/themes")["[data-theme=dark]"];
const base = require("./base.cjs");

/** @type {import('daisyui').CustomTheme} */
const BASE_THEME = { ...darkTheme, ...base };

/** @type {import('daisyui').CustomTheme} */
const theme = {
  ...BASE_THEME,

  /// Add your custom theme overrides here
};

module.exports = theme;
