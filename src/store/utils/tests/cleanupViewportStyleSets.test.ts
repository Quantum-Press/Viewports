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
	cleanupViewportStyleSets,
} from '..';


/**/
test( 'can cleanupViewportStyleSets() with empty maxWidth', () => {
	const viewportStyleSets = {
		0: {}
	}

	const result = cleanupViewportStyleSets( viewportStyleSets );

	expect( result ).toStrictEqual( {} );
} );


test( 'can cleanupViewportStyleSets() with empty style', () => {
	const viewportStyleSets = {
		0: {
			style: {}
		}
	}

	const result = cleanupViewportStyleSets( viewportStyleSets );

	expect( result ).toStrictEqual( {} );
} );


test( 'can cleanupViewportStyleSets() without empty objects', () => {
	const viewportStyleSets = {
		0: {
			style: {
				width: '100%',
				height: 'auto',
				dimensions: {
					padding: {
						left: '20px',
						right: '20px',
					},
					margin: {
						top: '0',
						bottom: '0',
					}
				}
			}
		}
	}

	const result = cleanupViewportStyleSets( viewportStyleSets );

	expect( result ).toStrictEqual( viewportStyleSets );
} );


test( 'can cleanupViewportStyleSets() without empty objects, with multiple viewports', () => {
	const viewportStyleSets = {
		0: {
			style: {
				qpFlex: {
					active: true,
					alignment: "space-between start",
				}
			}
		},
		767: {
			style: {
				qpFlex: {
					active: true,
					direction: 'column',
					alignment: 'stretch start',
				}
			},
		},
	};

	const result = cleanupViewportStyleSets( viewportStyleSets );

	expect( result ).toStrictEqual( viewportStyleSets );
} );
