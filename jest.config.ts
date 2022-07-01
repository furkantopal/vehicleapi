import type { Config } from '@jest/types';

export default async (): Promise<Config.InitialOptions> => {
  return {
    roots: ['<rootDir>'],
    collectCoverage: true,
    collectCoverageFrom: ['./src/**/*.{js,jsx,ts}', '!**/node_modules/**'],
    preset: 'ts-jest',
    testEnvironment: 'node',
    coverageThreshold: {
      global: {
        statements: 85,
        branches: 85,
        functions: 85,
        lines: 85,
      },
    },
  };
};
