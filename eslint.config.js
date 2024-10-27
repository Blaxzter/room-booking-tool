//@ts-check
import eslint from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import pluginVue from 'eslint-plugin-vue';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  // Your linting configuration
  {
    files: ["src/**/*.ts", "src/**/*.vue"],
    ignores: [
      "dist/**",
      "node_modules/**",
      ".github/**",
      ".vscode/**",
      "directus-config/**",
      "directus-extension/**",
      "directus-uploads/**",
      "github-pages/**",
      "telegram-bot/**",
      "uploads/**",
    ],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: "./tsconfig.json",
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      "vue": pluginVue,
    },
    rules: {
      ...eslint.configs.recommended.rules,
      ...tsPlugin.configs.recommended.rules,
      ...pluginVue.configs['flat/recommended'].rules,
      ...eslintConfigPrettier.rules,
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];
