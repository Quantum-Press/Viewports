import {
	describe,
	expect,
	test
} from '@jest/globals';

import {
	isObject,
	findChanges,
	findUniqueProperties,
	findEqualProperties,
} from '../';


/**
 * Test suite for the `any` utility functions.
 */
describe( 'utils tests', () => {
	describe( 'any', () => {

		/**
		 * Tests whether `isObject()` returns `false` for `null`.
		 */
		test( 'isObject() returns false for null', () => {
			expect( isObject( null ) ).toBe( false );
		} );

		/**
		 * Tests whether `isObject()` returns `false` for `undefined`.
		 */
		test( 'isObject() returns false for undefined', () => {
			expect( isObject( undefined ) ).toBe( false );
		} );

		/**
		 * Tests whether `isObject()` returns `false` for a string.
		 */
		test( 'isObject() returns false for a string', () => {
			expect( isObject( 'string' ) ).toBe( false );
		} );

		/**
		 * Tests whether `isObject()` returns `false` for a number.
		 */
		test( 'isObject() returns false for a number', () => {
			expect( isObject( 42 ) ).toBe( false );
		} );

		/**
		 * Tests whether `isObject()` returns `false` for a boolean value.
		 */
		test( 'isObject() returns false for a boolean', () => {
			expect( isObject( true ) ).toBe( false );
		} );

		/**
		 * Tests whether `isObject()` returns `false` for a symbol.
		 */
		test( 'isObject() returns false for a symbol', () => {
			expect( isObject( Symbol() ) ).toBe( false );
		} );

		/**
		 * Tests whether `isObject()` returns `false` for an array.
		 */
		test( 'isObject() returns false for an array', () => {
			expect( isObject( [] ) ).toBe( false );
		} );

		/**
		 * Tests whether `isObject()` returns `false` for a function.
		 */
		test( 'isObject() returns false for a function', () => {
			expect( isObject( () => {} ) ).toBe( false );
		} );

		/**
		 * Tests whether `isObject()` returns `false` for a Date object.
		 */
		test( 'isObject() returns false for a date object', () => {
			expect( isObject( new Date() ) ).toBe( false );
		} );

		/**
		 * Tests whether `isObject()` returns `false` for a Map.
		 */
		test( 'isObject() returns false for a Map', () => {
			expect( isObject( new Map() ) ).toBe( false );
		} );

		/**
		 * Tests whether `isObject()` returns `false` for a Set.
		 */
		test( 'isObject() returns false for a Set', () => {
			expect( isObject( new Set() ) ).toBe( false );
		} );

		/**
		 * Tests whether `isObject()` returns `true` for an empty object.
		 */
		test( 'isObject() returns true for an empty object', () => {
			expect( isObject( {} ) ).toBe( true );
		} );

		/**
		 * Tests whether `isObject()` returns `true` for a non-empty object.
		 */
		test( 'isObject() returns true for a non-empty object', () => {
			expect( isObject( { key: 'value' } ) ).toBe( true );
		} );

		/**
		 * Tests whether `isObject()` returns `true` for an object created with `Object.create(null)`.
		 */
		test( 'isObject() returns true for an object created with Object.create()', () => {
			expect( isObject( Object.create( null ) ) ).toBe( true );
		} );


		/**
		 * Tests whether `findChanges()` returns `undefined` for identical primitive values.
		 */
		test( 'findChanges() returns undefined for identical primitive values', () => {
			expect( findChanges( 42, 42 ) ).toBeUndefined();
			expect( findChanges( 'hello', 'hello' ) ).toBeUndefined();
			expect( findChanges( true, true ) ).toBeUndefined();
		} );

		/**
		 * Tests whether `findChanges()` returns the current value for different primitive values.
		 */
		test( 'findChanges() returns the new primitive value when changed', () => {
			expect( findChanges( 99, 42 ) ).toBe( 99 );
			expect( findChanges( 'hello', 'world' ) ).toBe( 'hello' );
			expect( findChanges( false, true ) ).toBe( false );
		} );

		/**
		 * Tests whether `findChanges()` correctly detects changes in arrays.
		 */
		test( 'findChanges() returns a copy of the new array if arrays are different', () => {
			const original = [ 1, 2, 3 ];
			const current = [ 4, 5, 6 ];

			expect( findChanges( current, original ) ).toEqual( current );
			expect( findChanges( current, original ) ).not.toBe( original ); // Ensure it's a copy
		} );

		/**
		 * Tests whether `findChanges()` returns `undefined` for identical arrays.
		 */
		test( 'findChanges() returns undefined for identical arrays', () => {
			const arr = [ 'a', 'b', 'c' ];

			expect( findChanges( arr, arr ) ).toStrictEqual( arr );
			expect( findChanges( [ ... arr ], arr ) ).toStrictEqual( arr );
		} );


		/**
		 * Tests whether `findChanges()` returns `undefined` for identical objects.
		 */
		test( 'findChanges() returns undefined for identical objects', () => {
			const obj = { x: 10, y: 20 };

			expect( findChanges( obj, obj ) ).toStrictEqual( {} );
			expect( findChanges( { ... obj }, obj ) ).toStrictEqual( {} );
		} );


		/**
		 * Tests whether `findChanges()` handles cases where one value is an object and the other is not.
		 */
		test( 'findChanges() returns the new value if one is an object and the other is not', () => {
			expect( findChanges( { a: 1 }, 42 ) ).toStrictEqual( { a: 1 } );
			expect( findChanges( 42, { a: 1 } ) ).toBe( 42 );
		} );

		/**
		 * Tests whether `findChanges()` correctly identifies changes from undefined to a value.
		 */
		test( 'findChanges() detects addition of new values', () => {
			expect( findChanges( 'new', undefined ) ).toBe( 'new' );
			expect( findChanges( [ 1, 2, 3 ], undefined ) ).toEqual( [ 1, 2, 3 ] );
			expect( findChanges( { key: 'value' }, undefined ) ).toEqual( { key: 'value' } );
		} );

		/**
		 * Tests whether `findChanges()` correctly identifies changes from a value to undefined.
		 */
		test( 'findChanges() detects removal of values', () => {
			expect( findChanges( undefined, 'old' ) ).toBeUndefined();
			expect( findChanges( undefined, [ 1, 2, 3 ] ) ).toBeUndefined();
			expect( findChanges( undefined, { key: 'value' } ) ).toBeUndefined();
		} );

		/**
		 * Tests whether `findChanges()` correctly handles empty objects and arrays.
		 */
		test( 'findChanges() treats empty objects and arrays as separate values', () => {
			expect( findChanges( {}, [] ) ).toEqual( {} );
			expect( findChanges( [], {} ) ).toEqual( [] );
		} );

		/**
		 * Tests whether `findChanges()` correctly compares special objects (Date, Map, Set).
		 */
		test( 'findChanges() handles special objects like Date, Map, and Set', () => {
			const originalDate = new Date( '2024-01-01' );
			const currentDate = new Date( '2025-01-01' );

			expect( findChanges( currentDate, originalDate ) ).toBe( currentDate );

			const originalMap = new Map( [ [ 'key', 'value' ] ] );
			const currentMap = new Map( [ [ 'key', 'changed' ] ] );

			expect( findChanges( currentMap, originalMap ) ).toBe( currentMap );

			const originalSet = new Set( [ 1, 2, 3 ] );
			const currentSet = new Set( [ 4, 5, 6 ] );

			expect( findChanges( currentSet, originalSet ) ).toBe( currentSet );
		} );

		/**
		 * Tests whether `findChanges()` correctly compares functions.
		 */
		test( 'findChanges() detects changes in functions', () => {
			const fn1 = () => 42;
			const fn2 = () => 99;

			expect( findChanges( fn2, fn1 ) ).toBe( fn2 );
			expect( findChanges( fn1, fn1 ) ).toBeUndefined();
		} );


		test('findUniqueProperties() should return properties in obj1 that are not in obj2', () => {
			const obj1 = { a: 1, b: 2, c: 3 };
			const obj2 = { a: 1 };

			const result = findUniqueProperties(obj1, obj2);

			expect(result).toEqual({ b: 2, c: 3 });
		});

		test('findUniqueProperties() should return all properties from obj1 when obj2 is empty', () => {
			const obj1 = { a: 1, b: 2, c: 3 };
			const obj2 = {};

			const result = findUniqueProperties(obj1, obj2);

			expect(result).toEqual({ a: 1, b: 2, c: 3 });
		});

		test('findUniqueProperties() should return an empty object when obj1 is empty', () => {
			const obj1 = {};
			const obj2 = { a: 1 };

			const result = findUniqueProperties(obj1, obj2);

			expect(result).toEqual({});
		});

		test('findUniqueProperties() should return an empty object if obj1 and obj2 have the same properties', () => {
			const obj1 = { a: 1, b: 2 };
			const obj2 = { a: 1, b: 2 };

			const result = findUniqueProperties(obj1, obj2);

			expect(result).toEqual({});
		});

		test('findUniqueProperties() should return properties from obj1 that are not in obj2 when obj2 is a subset of obj1', () => {
			const obj1 = { a: 1, b: 2, c: 3, d: 4 };
			const obj2 = { a: 1, c: 3 };

			const result = findUniqueProperties(obj1, obj2);

			expect(result).toEqual({ b: 2, d: 4 });
		});

		test('findUniqueProperties() should return all properties from obj1 when obj2 has no common keys', () => {
			const obj1 = { a: 1, b: 2 };
			const obj2 = { x: 100, y: 200 };

			const result = findUniqueProperties(obj1, obj2);

			expect(result).toEqual({ a: 1, b: 2 });
		});
	} );
} );


describe( "findMatchingProperties", () => {
	test( "should return matching properties when strict is true", () => {
		const baseObj = { a: 1, b: 2, c: { d: 3, e: 4 } };
		const compObj = { a: 1, b: 99, c: { d: 3, e: 5 } };

		const result = findEqualProperties( baseObj, compObj, true );

		expect( result ).toEqual( { a: 1, c: { d: 3 } } );
	} );

	test("should return properties that exist in both objects when strict is false", () => {
		const baseObj = { a: 1, b: 2, c: { d: 3, e: 4 } };
		const compObj = { a: 99, b: 88, c: { d: 77, e: 66 } };

		const result = findEqualProperties( baseObj, compObj, false );

		expect( result ).toEqual( { a: 1, b: 2, c: { d: 3, e: 4 } } );
	} );

	test( "should return an empty object when there are no matching properties in strict mode", () => {
		const baseObj = { a: 1, b: 2, c: { d: 3 } };
		const compObj = { a: 99, b: 88, c: { d: 77 } };

		const result = findEqualProperties( baseObj, compObj, true );

		expect( result ).toEqual( {} );
	} );

	test( "should handle nested objects correctly", () => {
		const baseObj = { a: { b: { c: 5 } } };
		const compObj = { a: { b: { c: 5 } } };
		const result = findEqualProperties( baseObj, compObj, true );

		expect( result ).toEqual( { a: { b: { c: 5 } } } );
	} );

	test( "should return an empty object when baseObj is empty", () => {
		const baseObj = {};
		const compObj = { a: 1, b: 2 };
		const result = findEqualProperties( baseObj, compObj, true );

		expect( result ).toEqual( {} );
	} );

	test( "should return an empty object when compObj is empty", () => {
		const baseObj = { a: 1, b: 2 };
		const compObj = {};
		const result = findEqualProperties( baseObj, compObj, true );

		expect( result ).toEqual( {} );
	} );
} );
