import js from "@eslint/js";
import tseslint from "typescript-eslint";
import nextPlugin from "@next/eslint-plugin-next";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";

/**
 * Flat ESLint config shared across the whole monorepo (Next 16 removed
 * `next lint`, so we run ESLint directly). Non-type-aware to keep it fast and
 * config-free; the strict TypeScript checking already happens via `tsc`.
 */
export default tseslint.config(
  {
    ignores: [
      "**/.next/**",
      "**/.turbo/**",
      "**/dist/**",
      "**/node_modules/**",
      "**/next-env.d.ts",
      "**/*.tsbuildinfo",
    ],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    rules: {
      // Allow intentionally-unused args/vars prefixed with underscore
      // (e.g. the `_prev` state arg required by useActionState signatures).
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },

  // React hooks rules for app + UI code.
  {
    files: ["apps/**/*.{ts,tsx}", "packages/ui/**/*.{ts,tsx}"],
    plugins: { "react-hooks": reactHooks },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
  },

  // Next.js rules only for the app zones.
  {
    files: ["apps/**/*.{ts,tsx}"],
    plugins: { "@next/next": nextPlugin },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
      // App Router project — the Pages-Router-only link rule doesn't apply.
      "@next/next/no-html-link-for-pages": "off",
    },
  },

  // Node config files (run in Node, not the browser).
  {
    files: ["**/*.config.{js,mjs,ts}", "**/next.config.mjs"],
    languageOptions: { globals: { ...globals.node } },
  },

  // Test files: relax a couple of rules.
  {
    files: ["**/*.test.ts"],
    rules: {
      "@typescript-eslint/no-non-null-assertion": "off",
    },
  },
);
