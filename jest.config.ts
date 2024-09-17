import type { Config } from 'jest';

const config: Config = {
	roots: [ '<rootDir>/src' ],
	preset: 'ts-jest',
	testEnvironment: 'jsdom',
	setupFiles: [ '<rootDir>/src/setup/jest.global.ts' ],
};

export default config;