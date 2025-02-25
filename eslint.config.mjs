import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  ...compat.extends("next/core-web-vitals"),
  {
    ignores: ["node_modules/", ".next/", "public/"],
    rules: {
      "no-undef": "off", // Fix 'process' and 'global' not defined errors
      "no-unused-vars": "warn", // Warn but don't fail on unused variables
    },
    languageOptions: {
      globals: {
        process: "readonly",
        global: "readonly",
      },
    },
  },
];
