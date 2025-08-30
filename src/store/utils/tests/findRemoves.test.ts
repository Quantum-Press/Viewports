// Import preparement dependencies.
import * as data from '@wordpress/data';
import * as element from '@wordpress/element';
import * as styleEngine from '@wordpress/style-engine';

// Extend global window object.
global.window[ 'wp' ] = {
	data,
	element,
	styleEngine
};

// Import test environment.
import { describe, expect, test } from '@jest/globals';

// Import store parts.
import {
	findRemoves,
} from '..';


test( 'can findRemoves() with filled attributes from the first entry on', () => {
	const compare = {
		style: {
			dimensions: {
				padding: {
					top: '20px',
					bottom: '20px',
				}
			}
		}
	};
	const keys = [ 'style' ];

	const check = {
		style: {
			dimensions: {
				padding: {
					top: '20px',
					bottom: '20px',
				}
			}
		}
	};
	const result = findRemoves( keys, compare );

	expect( result ).toStrictEqual( check );
} );


test( 'can findRemoves() with filled attributes to the deepest', () => {
	const compare = {
		style: {
			dimensions: {
				padding: {
					top: '20px',
					bottom: '20px',
				}
			}
		}
	};
	const keys = [ 'style', 'dimensions', 'padding', 'top' ];

	const check = {
		style: {
			dimensions: {
				padding: {
					top: '20px',
				}
			}
		}
	};
	const result = findRemoves( keys, compare );

	expect( result ).toStrictEqual( check );
} );