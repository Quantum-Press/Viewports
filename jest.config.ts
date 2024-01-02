import type { Config } from 'jest';

const config: Config = {
	roots: [ '<rootDir>/src' ],
	preset: 'ts-jest',
	testEnvironment: 'jsdom',
};

export default config;