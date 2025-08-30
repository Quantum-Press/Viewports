// Import preparement dependencies.
import deepFreeze from 'deep-freeze';
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
import { DEFAULT_STATE } from '../../default';
import {
	isInDesktopRange,
	isInTabletRange,
	isInMobileRange,
} from '..';
import { findObjectChanges } from '../../../utils';

describe( 'store utils', () => {

	test( 'can indicate isInDesktopRange() with falsy viewport', () => {
		expect( isInDesktopRange( 800 ) ).toStrictEqual( false );
	} );

	test( 'can indicate isInDesktopRange() with correct viewport', () => {
		expect( isInDesktopRange( 1380 ) ).toStrictEqual( true );
	} );

	test( 'can indicate isInTabletRange() with falsy viewport', () => {
		expect( isInTabletRange( 1380 ) ).toStrictEqual( false );
	} );

	test( 'can indicate isInTabletRange() with correct viewport', () => {
		expect( isInTabletRange( 800 ) ).toStrictEqual( true );
	} );

	test( 'can indicate isInMobileRange() with falsy viewport', () => {
		expect( isInMobileRange( 800 ) ).toStrictEqual( false );
	} );

	test( 'can indicate isInMobileRange() with correct viewport', () => {
		expect( isInMobileRange( 400 ) ).toStrictEqual( true );
	} );


	test( 'can findObjectChanges() with filled attributes and filled valids', () => {
		const attributes = {
			style: {
				dimensions: {
					padding: {
						top: '80px',
						bottom: '40px',
					},
					margin: {
						left: '40px',
						right: '40px',
					}
				}
			}
		};
		const valids = {
			style: {
				dimensions: {
					padding: {
						top: '40px',
						bottom: '40px',
					},
					margin: {
						left: '40px',
						right: '40px',
					}
				}
			}
		};

		const check = {
			style: {
				dimensions: {
					padding: {
						top: '80px',
					}
				}
			}
		}
		const result = findObjectChanges( attributes, valids );

		expect( result ).toStrictEqual( check );
	} );

	test( 'can findObjectChanges() with filled attributes and filled valids but only attribute array', () => {
		const attributes = {
			style: {
				dimensions: {
					padding: {
						top: '80px',
						bottom: '40px',
					},
					margin: {
						left: '40px',
						right: '40px',
					}
				},
				layers: [
					{
						foo: 'bar',
					},
					{
						bar: 'foo',
					}
				]
			}
		};
		const valids = {
			style: {
				dimensions: {
					padding: {
						top: '40px',
						bottom: '40px',
					},
					margin: {
						left: '40px',
						right: '40px',
					}
				},
			}
		};

		const check = {
			style: {
				dimensions: {
					padding: {
						top: '80px',
					}
				},
				layers: [
					{
						foo: 'bar',
					},
					{
						bar: 'foo',
					}
				]
			}
		}
		const result = findObjectChanges( attributes, valids );

		expect( result ).toStrictEqual( check );
	} );

	test( 'can findObjectChanges() with filled attributes and filled valids including different arrays', () => {
		const attributes = {
			style: {
				dimensions: {
					padding: {
						top: '80px',
						bottom: '40px',
					},
					margin: {
						left: '40px',
						right: '40px',
					}
				},
				layers: [
					{
						foo: 'bar',
					},
					{
						bar: 'foo',
					}
				]
			}
		};
		const valids = {
			style: {
				dimensions: {
					padding: {
						top: '40px',
						bottom: '40px',
					},
					margin: {
						left: '40px',
						right: '40px',
					}
				},
				layers: [
					{
						foo: 'bar',
					}
				]
			}
		};

		const check = {
			style: {
				dimensions: {
					padding: {
						top: '80px',
					}
				},
				layers: [
					{
						foo: 'bar',
					},
					{
						bar: 'foo',
					}
				]
			}
		}
		const result = findObjectChanges( attributes, valids );

		expect( result ).toStrictEqual( check );
	} );

	test( 'can findObjectChanges() with filled attributes and filled valids including different order arrays', () => {
		const attributes = {
			style: {
				dimensions: {
					padding: {
						top: '80px',
						bottom: '40px',
					},
					margin: {
						left: '40px',
						right: '40px',
					}
				},
				layers: [
					{
						bar: 'foo',
					},
					{
						foo: 'bar',
					}
				]
			}
		};
		const valids = {
			style: {
				dimensions: {
					padding: {
						top: '40px',
						bottom: '40px',
					},
					margin: {
						left: '40px',
						right: '40px',
					}
				},
				layers: [
					{
						foo: 'bar',
					},
					{
						foo: 'bar',
					}
				]
			}
		};

		const check = {
			style: {
				dimensions: {
					padding: {
						top: '80px',
					}
				},
				layers: [
					{
						bar: 'foo',
					},
					{
						foo: 'bar',
					}
				]
			}
		}
		const result = findObjectChanges( attributes, valids );

		expect( result ).toStrictEqual( check );
	} );

} );