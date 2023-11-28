/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution")

module.exports = {
  root: true,
  extends: ["eslint:recommended", "plugin:vue/vue3-recommended", "prettier"],
  parserOptions: {
    ecmaVersion: "latest",
  },
  rules: {
    "no-loss-of-precision": "off",
    "prettier/prettier": [
      "error",
      {
        printWidth: 80,
        tabWidth: 2,
        useTabs: false,
        semi: false,
        singleQuote: false,
        quoteProps: "as-needed",
        jsxSingleQuote: true,
        trailingComma: "all",
        bracketSpacing: true,
        bracketSameLine: false,
        arrowParens: "always",
        requirePragma: false,
        insertPragma: false,
        proseWrap: "preserve",
        htmlWhitespaceSensitivity: "ignore",
        vueIndentScriptAndStyle: false,
        endOfLine: "lf",
        singleAttributePerLine: true,
        embeddedLanguageFormatting: "auto",
      },
    ],
  },
  plugins: ["prettier"],
}
