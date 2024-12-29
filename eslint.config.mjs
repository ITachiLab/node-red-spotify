import globals from "globals";
import pluginJs from "@eslint/js";
import html from "eslint-plugin-html";
import stylisticJs from "@stylistic/eslint-plugin-js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  pluginJs.configs.recommended,
  {
    plugins: {
      "@stylistic/js": stylisticJs
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        RED: "readonly",
        "$": "readonly"
      }
    },
    rules: {
      "prefer-const": "error",
      "no-useless-assignment": "error",
      "block-scoped-var": "error",
      "curly": ["error", "all"],
      "no-console": "error",
      "no-var": "error",
      "prefer-arrow-callback": "warn",
      "@stylistic/js/semi": ["error", "always"],
      "@stylistic/js/quotes": ["error", "double"],
      "@stylistic/js/max-len": ["warn", {"code": 100, "tabWidth": 2}],
      "@stylistic/js/no-mixed-operators": "error",
    }
  },
  {
    files: ["**/*.js"],
    languageOptions: {sourceType: "commonjs"}
  },
  {
    files: ["**/*.html"],
    plugins: {html}
  }
];