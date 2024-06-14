/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */
import type {Config} from '@jest/types';

const config: Config.InitialOptions = {
  roots: ['<rootDir>/tests', '<rootDir>/src'],
  testMatch: [
    "**/__tests__/**/*.+(ts|tsx|js)",
    "**/?(*.)+(spec|test).+(ts|tsx|js)",
  ], 
  testPathIgnorePatterns: [".*user-router\\.test\\.ts", ".*level-router\\.test\\.ts"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  setupFilesAfterEnv: ["<rootDir>/tests/database/setupTests.ts"],
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  maxWorkers:1
};

export default config;
