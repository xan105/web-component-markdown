import eslint from "@eslint/js";
import globals from "globals";

const rules = {
  ...eslint.configs.recommended.rules,
  "no-alert": "warn",
  "no-eval": "error",
  "require-await": "warn",
  "no-useless-escape": "warn"
}

export default [
  {
    files: ["lib/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: { 
        ...globals.browser
      }
    },
    rules
  }
];