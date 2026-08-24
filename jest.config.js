// next/jest wires up SWC, the tsconfig `@/` alias, CSS module stubs and
// next/font for us -- no bespoke transform config to keep in sync with Next.
const nextJest = require("next/jest");

const createJestConfig = nextJest({ dir: "./" });

/** @type {import('jest').Config} */
const config = {
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testMatch: ["<rootDir>/src/**/*.test.{ts,tsx}"],
  // Mirrors the `@/*` alias in tsconfig.json. Declared explicitly so
  // `jest.mock("@/...")` resolves the same way a runtime import does.
  moduleNameMapper: { "^@/(.*)$": "<rootDir>/src/$1" },
  collectCoverageFrom: ["src/**/*.{ts,tsx}", "!src/**/*.d.ts", "!src/**/index.ts"],
};

module.exports = createJestConfig(config);
