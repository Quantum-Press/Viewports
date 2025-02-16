import { describe, expect, test } from '@jest/globals';
import { getMergedAttributes, sanitizeAttributes, fillEmpty } from '../attributes';
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
	 * Set tests for getMergedAttributes
	 */
	test( 'can getMergedAttributes() with empty objects', () => {
		expect( getMergedAttributes( {}, {} ) ).toStrictEqual( {} );
	});

	test( 'can getMergedAttributes() with filled attributes and empty merge object', () => {
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

		expect( getMergedAttributes( attributes, {} ) ).toStrictEqual( attributes );
	});

	test( 'can getMergedAttributes() with different filled objects', () => {
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

		expect( getMergedAttributes( attributes, merge ) ).toStrictEqual( check );
	});

	test( 'can getMergedAttributes() with different filled objects reverse', () => {
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

		expect( getMergedAttributes( attributes, merge ) ).toStrictEqual( check );
	});

	test( 'can getMergedAttributes() with different filled objects and an array reorder', () => {
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

		const result = getMergedAttributes( attributes, merge );

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


	/**
	 * Set tests for fillEmpty.
	 */
	test( 'fillEmpty:: test empty object', () => {
		expect( fillEmpty( {}, {} ) ).toStrictEqual( {} );
	});

	test( 'fillEmpty:: test empty object and filled object', () => {
		expect( fillEmpty( {}, gimliGeared ) ).toStrictEqual( {} );
	});

	test( 'fillEmpty:: test filled object and empty object', () => {
		expect( fillEmpty( gimliGeared, {} ) ).toStrictEqual( gimliGeared );
	});

	test( 'fillEmpty:: test filled different filled objects', () => {
		expect( fillEmpty( gimli, gimliGeared ) ).toStrictEqual( gimliGeared );
	});

});