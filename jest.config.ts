import type { Config } from 'jest';

const config: Config = {
	roots: [ '<rootDir>/src' ],
	preset: 'ts-jest',
	testEnvironment: 'jsdom',
	setupFiles: [ '<rootDir>/src/setup/jest.global.ts' ],
	moduleNameMapper: {
		'^@quantum-viewports/(.*)$': '<rootDir>/src/$1',
	}
};

export default config;