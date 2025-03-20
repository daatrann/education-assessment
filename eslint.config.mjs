import globals from "globals";
import pluginJs from "@eslint/js";
import eslintPluginPrettier from "eslint-plugin-prettier";
import eslintPluginJest from "eslint-plugin-jest";
import eslintConfigPrettier from "eslint-config-prettier";
/** @type {import('eslint').Linter.Config[]} */
export default [
    { languageOptions: { globals: { ...globals.node, ...globals.jest } } },

    {
        plugins: {
            prettier: eslintPluginPrettier,
            jest: eslintPluginJest,
        },
        rules: { "prettier/prettier": ["error", { endOfLine: "auto" }] },
    },
    pluginJs.configs.recommended,
    eslintConfigPrettier,
];
