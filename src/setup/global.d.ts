import * as _ from '@types/lodash';
import * as React from '@types/react';

declare global {
	interface Window {
		lodash: typeof _;
		React: typeof React;
	}
}

export {};