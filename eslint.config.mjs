import js, { defineConfig } from "@eslint/js";
import globals from "globals";
import importPlugin from 'eslint-plugin-import';
import pluginPromise from 'eslint-plugin-promise'

export default defineConfig([
  js.configs.recommended,
  importPlugin.flatConfigs.recommended,
  pluginPromise.configs['flat/recommended'],
  { files: ["**/*.{js,mjs,cjs}"], 
    plugins: { js }, 
    rules: {
      'no-unused-vars': 'error',
      'import/no-dynamic-require': 'warn',
      'import/no-nodejs-modules': 'warn',
    },
    extends: ["js/recommended"] },
  { files: ["**/*.{js,mjs,cjs}"], languageOptions: { globals: {...globals.browser, ...globals.node} }, }
]);
