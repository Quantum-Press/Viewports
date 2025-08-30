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
	cleanupViewportSet,
} from '..';


test( 'can cleanupViewportSet() with empty viewport', () => {
	const viewportStyleSet = {
		0: {}
	}

	const result = cleanupViewportSet( viewportStyleSet );

	expect( result ).toStrictEqual( {} );
} );


test( 'can cleanupViewportSet() with empty maxWidth', () => {
	const viewportStyleSet = {
		0: {
			0: {}
		}
	}

	const result = cleanupViewportSet( viewportStyleSet );

	expect( result ).toStrictEqual( {} );
} );


test( 'can cleanupViewportSet() with empty style', () => {
	const viewportStyleSet = {
		0: {
			0: {
				style: {}
			}
		}
	}

	const result = cleanupViewportSet( viewportStyleSet );

	expect( result ).toStrictEqual( {} );
} );


test( 'can cleanupViewportSet() without empty objects', () => {
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

	const result = cleanupViewportSet( viewportStyleSet );

	expect( result ).toStrictEqual( viewportStyleSet );
} );


test( 'can cleanupViewportSet() without empty objects, with multiple viewports', () => {
	const viewportStyleSet = {
		0: {
			767: {
				style: {
					qpFlex: {
						active: true,
						direction: 'column',
						alignment: 'stretch start',
					}
				},
			},
		},
		768: {
			0: {
				style: {
					qpFlex: {
						active: true,
						alignment: "space-between start",
					}
				}
			}
		}
	}

	const result = cleanupViewportSet( viewportStyleSet );

	expect( result ).toStrictEqual( viewportStyleSet );
} );
