const lightTheme = require("daisyui/src/colors/themes")["[data-theme=light]"];

const base = require("./base.cjs");

const BASE_THEME = {
  ...lightTheme,
  ...base,
};

/**
 * @type {typeof BASE_THEME}
 */
const theme = {
  ...BASE_THEME,
  /// Add your custom theme overrides here
};

module.exports = theme;
