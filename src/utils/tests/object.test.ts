import {
	describe,
	expect,
	test
} from '@jest/globals';

import { omitObjectMatching, findObjectOccurence, subtractObject } from "../object";


test( 'can omitObjectMatching()', () => {

	const savesValue = {
		height: "auto",
	};

	const stylesValue = {
		width: "100%",
	};

	const result = omitObjectMatching( savesValue, stylesValue );

	const check = {
		height: "auto",
	}

	expect( result ).toStrictEqual( check );
} );


test( 'can omitObjectMatching()', () => {

	const savesValue = {
		height: "auto",
	};

	const stylesValue = {
		width: "100%",
		height: "auto",
	};

	const result = omitObjectMatching( savesValue, stylesValue );

	const check = {}

	expect( result ).toStrictEqual( check );
} );



test( 'can findObjectOccurence() with both objects empty', () => {
	const valids = {}

	const styles = {}

	const check = {
		found: {},
		missing: null,
	}

	const result = findObjectOccurence( valids, styles );

	expect( result ).toStrictEqual( check );
} );


test( 'can findObjectOccurence() with both objects the same', () => {
	const valids = {
		dimension: {
			width: "100%",
			height: "auto",
		}
	}

	const styles = {
		dimension: {
			width: "100%",
			height: "auto",
		}
	}

	const check = {
		found: {
			dimension: {
				width: "100%",
				height: "auto",
			}
		},
		missing: null,
	}

	const result = findObjectOccurence( valids, styles );

	expect( result ).toStrictEqual( check );
} );


test( 'can findObjectOccurence() with different objects', () => {
	const valids = {
		dimension: {
			width: "100%",
			height: "auto",
		}
	}

	const styles = {
		dimension: {
			width: "100%"
		}
	}

	const check = {
		found: {
			dimension: {
				width: "100%",
			}
		},
		missing: {
			dimension: {
				height: "auto",
			}
		},
	}

	const result = findObjectOccurence( valids, styles );

	expect( result ).toStrictEqual( check );
} );




describe( 'subtractObject', () => {

	test( 'removes matching values (strict)', () => {
		const a = {
			foo: 1,
			bar: {
				baz: 2,
				qux: 3
			}
		};

		const b = {
			bar: {
				baz: 2
			}
		};

		const result = subtractObject( a, b, true );

		expect( result ).toEqual({
			foo: 1,
			bar: {
				qux: 3
			}
		});
	});

	test( 'returns null if objects are equal (strict)', () => {
		const a = { a: 1 };
		const b = { a: 1 };

		const result = subtractObject( a, b, true );

		expect( result ).toBeNull();
	});

	test( 'removes matching items from arrays (strict)', () => {
		const a = [ 1, 2, 3 ];
		const b = [ 2 ];

		const result = subtractObject( a, b, true );

		expect( result ).toEqual([ 1, 3 ]);
	});

	test( 'non-strict mode preserves original values', () => {
		const a = {
			x: 10,
			y: 20
		};

		const b = {
			y: 20
		};

		const result = subtractObject( a, b, false );

		expect( result ).toEqual({ x: 10 });
	});

	test( 'handles nested arrays of objects', () => {
		const a = [
			{ id: 1 },
			{ id: 2 }
		];

		const b = [
			{ id: 1 }
		];

		const result = subtractObject( a, b, true );

		expect( result ).toEqual([
			{ id: 2 }
		]);
	});

	test( 'handles primitive difference (strict)', () => {
		const result = subtractObject( 5, 5, true );

		expect( result ).toBeNull();
	});

	test( 'handles primitive difference (non-strict)', () => {
		const result = subtractObject( 5, 5, false );

		expect( result ).toBe( 5 );
	});

	test( '', () => {
		const a = {
			foo: {
				id: 1,
				class: "foo",
			},
			bar: {
				id: 2,
				class: "bar",
			}
		};

		const b = {
			foo: {
				class: "foo",
			},
			bar: {
				id: 2,
				class: "foo",
			}
		};

		const result = subtractObject( a, b, false );

		expect( result ).toEqual( {
			foo: {
				id: 1,
			},
		} );
	});

	test( '', () => {
		const a = {
			foo: {
				id: 1,
				class: "foo",
			},
			bar: {
				id: 2,
				class: "bar",
			}
		};

		const b = {
			foo: {
				class: "foo",
			},
			bar: {
				id: 2,
				class: "foo",
			}
		};

		const result = subtractObject( a, b, true );

		expect( result ).toEqual( {
			foo: {
				id: 1,
			},
			bar: {
				class: "bar",
			}
		} );
	});
});