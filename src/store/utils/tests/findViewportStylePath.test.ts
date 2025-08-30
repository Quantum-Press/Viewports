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
	findViewportStylePath,
} from '..';


test( 'can findViewportStylePath() with empty viewportSet', () => {
	const viewportSet = {}

	const result = findViewportStylePath( 768, 'width', viewportSet );

	expect( result ).toStrictEqual( null );
} );


test( 'can findViewportStylePath() with empty viewportStyleSets', () => {
	const viewportSet = {
		0: {}
	}

	const result = findViewportStylePath( 768, 'width', viewportSet );

	expect( result ).toStrictEqual( null );
} );


test( 'can findViewportStylePath() with empty viewportStyleSet', () => {
	const viewportSet = {
		0: {
			0: {}
		}
	}

	const result = findViewportStylePath( 768, 'width', viewportSet );

	expect( result ).toStrictEqual( null );
} );


test( 'can findViewportStylePath() with empty style in viewportStyleSet', () => {
	const viewportSet = {
		0: {
			0: {
				style: {}
			}
		}
	}

	const result = findViewportStylePath( 768, 'width', viewportSet );

	expect( result ).toStrictEqual( null );
} );


test( 'can findViewportStylePath() with some styles in viewportStyleSet', () => {
	const viewportSet = {
		0: {
			0: {
				style: {
					dimensions: {
						padding: '20px 0',
					}
				}
			}
		},
		768: {
			0: {
				style: {
					width: '100%',
				}
			}
		}
	}

	const result = findViewportStylePath( 768, 'width', viewportSet );

	expect( result ).toStrictEqual( [ 768, 0, 'style', 'width' ] );
} );


test( 'can findViewportStylePath() with some styles in viewportStyleSet with maxWidth', () => {
	const viewportSet = {
		0: {
			0: {
				style: {
					dimensions: {
						padding: '20px 0',
					}
				}
			}
		},
		768: {
			1279: {
				style: {
					width: '100%',
				}
			}
		}
	}

	const result = findViewportStylePath( 768, 'width', viewportSet );

	expect( result ).toStrictEqual( [ 768, 1279, 'style', 'width' ] );
} );
