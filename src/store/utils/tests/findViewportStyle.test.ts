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
	findViewportStyle,
} from '..';


/**
 */
/**/
describe( 'Testsuite - findViewportStyle', () => {
	test( 'can findViewportStyle() with a single ViewportStyle', () => {
		const viewportStyleSet = {
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

		const check = {
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
		};

		const result = findViewportStyle( viewportStyleSet );

		expect( result ).toStrictEqual( check );
	} );


	test( 'can findViewportStyle() with two ViewportStyles', () => {
		const viewportStyleSet = {
			0: {
				style: {
					width: '100%',
					height: 'auto',
				}
			},
			767: {
				style: {
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

		const check = {
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
		};

		const result = findViewportStyle( viewportStyleSet );

		expect( result ).toStrictEqual( check );
	} );
} );
