import { describe, expect, test } from '@jest/globals';
import { getMergedObject, sanitizeAttributes } from '../';
import {
	aragorn,
	aragornDelivery,
	aragornGeared,
	aragornReversed,
	legolas,
	legolasGeared,
	gimli,
	gimliGeared,
} from './cases';

describe( 'attribute utils', () => {

	/**
	 * Set tests for getMergedObject
	 */
	test( 'can getMergedObject() with empty objects', () => {
		expect( getMergedObject( {}, {} ) ).toStrictEqual( {} );
	});

	test( 'can getMergedObject() with filled attributes and empty merge object', () => {
		const attributes = {
			style: {
				dimensions: {
					padding: '80px',
					margin: {
						top: '20px',
						bottom: '20px',
					}
				}
			}
		};

		expect( getMergedObject( attributes, {} ) ).toStrictEqual( attributes );
	});

	test( 'can getMergedObject() with different filled objects', () => {
		const attributes = {
			style: {
				dimensions: {
					padding: '80px',
					margin: {
						top: '20px',
						bottom: '20px',
					}
				}
			}
		};

		const merge = {
			style: {
				dimensions: {
					margin: '20px',
				}
			}
		}

		const check = {
			style: {
				dimensions: {
					padding: '80px',
					margin: '20px',
				}
			}
		}

		expect( getMergedObject( attributes, merge ) ).toStrictEqual( check );
	});

	test( 'can getMergedObject() with different filled objects reverse', () => {
		const attributes = {
			style: {
				dimensions: {
					margin: '20px',
				}
			}
		};

		const merge = {
			style: {
				dimensions: {
					padding: '80px',
					margin: {
						top: '20px',
						bottom: '20px',
					}
				}
			}
		}

		const check = {
			style: {
				dimensions: {
					padding: '80px',
					margin: {
						top: '20px',
						bottom: '20px',
					}
				}
			}
		}

		expect( getMergedObject( attributes, merge ) ).toStrictEqual( check );
	});

	test( 'can getMergedObject() with different filled objects and an array reorder', () => {
		const attributes = {
			style: {
				dimensions: {
					padding: '0',
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

		const merge = {
			style: {
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

		const check = {
			style: {
				dimensions: {
					padding: '0',
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

		const result = getMergedObject( attributes, merge );

		expect( result ).toStrictEqual( check );
	});


	/**
	 * Set tests for sanitizeAttributes.
	 */
	test( 'sanitizeAttributes:: test empty object', () => {
		expect( sanitizeAttributes( {} ) ).toStrictEqual( {} );
	});

	test( 'sanitizeAttributes:: test filled object without style', () => {
		expect( sanitizeAttributes( aragorn ) ).toStrictEqual( {} );
	});

	test( 'sanitizeAttributes:: test filled object with style', () => {
		expect( sanitizeAttributes( legolas ) ).toStrictEqual( legolas );
	});

	test( 'sanitizeAttributes:: test filled object with style and additionals', () => {
		expect( sanitizeAttributes( legolasGeared ) ).toStrictEqual( legolas );
	});
});