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
	findViewportStyleProperties,
} from '..';


test( 'can findViewportStyleProperties() with a single style attribute', () => {
	const viewportStyleSet = {
		0: {
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
	}

	const check = [ 'width', 'height', 'dimensions' ];

	const result = findViewportStyleProperties( viewportStyleSet );

	expect( result ).toStrictEqual( check );
} );
