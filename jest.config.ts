import type { Config } from 'jest';

const config: Config = {
	// roots: [ '<rootDir>/src' ],
	roots: [ '<rootDir>/src/temp' ],
	preset: 'ts-jest',
	testEnvironment: 'jsdom',
	setupFiles: [ '<rootDir>/src/setup/jest.global.ts' ],
	moduleNameMapper: {
		'^@viewports/(.*)$': '<rootDir>/src/$1',
	}
};

export default config;
