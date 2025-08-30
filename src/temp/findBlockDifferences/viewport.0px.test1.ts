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
import { DEFAULT_STATE } from '../../store';
import {
	findBlockDifferences,
	findBlockValids,
} from '../../store/utils';

// Setup test store state.
const TEST_STATE = {
	... DEFAULT_STATE,
}


describe( 'findBlockDifferences on Viewport 0 - Stage 1', () => {
	test( 'Adding property on empty saves and empty changes', () => {
		const state = {
			... TEST_STATE,
		};

		const attributes = {
			style: {
				dimensions: {
					padding: '80px',
				},
			},
		};

		const check = {
			changes: {
				0: {
					0: {
						style: {
							dimensions: {
								padding: '80px',
							},
						},
					},
				},
			},
			removes: {},
		};

		const nextState = {
			... state,
			valids: {
				'client-id': findBlockValids( 'client-id', state ),
			}
		}

		const result = findBlockDifferences(
			'client-id',
			attributes,
			deepFreeze( nextState ),
			state.iframeViewport
		);

		expect( result ).toStrictEqual( check );
	} );

	test( 'Adding property on filled saves and empty changes', () => {
		const state = {
			... TEST_STATE,
			saves: {
				'client-id': {
					0: {
						0: {
							style: {
								width: '100%',
							},
						},
					},
				},
			},
		};

		const attributes = {
			style: {
				width: '100%',
				dimensions: {
					padding: '80px',
				},
			},
		};

		const check = {
			changes: {
				0: {
					0: {
						style: {
							dimensions: {
								padding: '80px',
							},
						},
					},
				},
			},
			removes: {}
		};

		const nextState = {
			... state,
			valids: {
				'client-id': findBlockValids( 'client-id', state ),
			}
		}

		const result = findBlockDifferences(
			'client-id',
			attributes,
			deepFreeze( nextState ),
			state.iframeViewport
		);

		expect( result ).toStrictEqual( check );
	} );

	test( 'Adding property on filled changes and empty saves', () => {
		const state = {
			... TEST_STATE,
			changes: {
				'client-id': {
					0: {
						0: {
							style: {
								width: '100%',
							},
						},
					},
				},
			},
		};

		const attributes = {
			style: {
				width: '100%',
				dimensions: {
					padding: '80px',
				},
			},
		};

		const check = {
			changes: {
				0: {
					0: {
						style: {
							width: '100%',
							dimensions: {
								padding: '80px',
							},
						},
					},
				},
			},
			removes: {},
		};

		const nextState = {
			... state,
			valids: {
				'client-id': findBlockValids( 'client-id', state ),
			}
		}

		const result = findBlockDifferences(
			'client-id',
			attributes,
			deepFreeze( nextState ),
			state.iframeViewport
		);

		expect( result ).toStrictEqual( check );
	} );

	test( 'Adding property on filled changes and saves', () => {
		const state = {
			... TEST_STATE,
			changes: {
				'client-id': {
					0: {
						0: {
							style: {
								height: 'auto',
							},
						},
					},
				},
			},
			saves: {
				'client-id': {
					0: {
						0: {
							style: {
								width: '100%',
							},
						},
					},
				},
			},
		};

		const attributes = {
			style: {
				width: '100%',
				height: 'auto',
				dimensions: {
					padding: '80px',
				},
			},
		};

		const check = {
			changes: {
				0: {
					0: {
						style: {
							height: 'auto',
							dimensions: {
								padding: '80px',
							},
						},
					},
				},
			},
			removes: {},
		};

		const nextState = {
			... state,
			valids: {
				'client-id': findBlockValids( 'client-id', state ),
			}
		}

		const result = findBlockDifferences(
			'client-id',
			attributes,
			deepFreeze( nextState ),
			state.iframeViewport
		);

		expect( result ).toStrictEqual( check );
	} );

	test( 'Adding property on filled changes and empty saves while removing a property from changes', () => {
		const state = {
			... TEST_STATE,
			changes: {
				'client-id': {
					0: {
						0: {
							style: {
								width: '100%',
							},
						},
					},
				},
			},
		};

		const attributes = {
			style: {
				dimensions: {
					padding: '80px',
				},
			},
		};

		const check = {
			changes: {
				0: {
					0: {
						style: {
							dimensions: {
								padding: '80px',
							},
						},
					},
				},
			},
			removes: {},
		};

		const nextState = {
			... state,
			valids: {
				'client-id': findBlockValids( 'client-id', state ),
			}
		}

		const result = findBlockDifferences(
			'client-id',
			attributes,
			deepFreeze( nextState ),
			state.iframeViewport
		);

		expect( result ).toStrictEqual( check );
	} );

	test( 'Adding property on filled changes and saves while removing a property from changes', () => {
		const state = deepFreeze( {
			... TEST_STATE,
			changes: {
				'client-id': {
					0: {
						0: {
							style: {
								width: '100%',
							},
						},
					},
				},
			},
			saves: {
				'client-id': {
					0: {
						0: {
							style: {
								height: 'auto',
							},
						},
					},
				},
			},
		} );

		const attributes = {
			style: {
				height: 'auto',
				dimensions: {
					padding: '80px',
				},
			},
		};

		const check = {
			changes: {
				0: {
					0: {
						style: {
							dimensions: {
								padding: '80px',
							},
						},
					},
				},
			},
			removes: {},
		};

		const nextState = {
			... state,
			valids: {
				'client-id': findBlockValids( 'client-id', state ),
			}
		}

		const result = findBlockDifferences(
			'client-id',
			attributes,
			deepFreeze( nextState ),
			state.iframeViewport
		);

		expect( result ).toStrictEqual( check );
	} );

	test( 'Adding property on filled changes and saves while removing a property from changes and saves', () => {
		const state = deepFreeze( {
			... TEST_STATE,
			changes: {
				'client-id': {
					0: {
						0: {
							style: {
								width: '100%',
							},
						},
					},
				},
			},
			saves: {
				'client-id': {
					0: {
						0: {
							style: {
								height: 'auto',
							},
						},
					},
				},
			},
		} );

		const attributes = {
			style: {
				dimensions: {
					padding: '80px',
				},
			},
		};

		const check = {
			changes: {
				0: {
					0: {
						style: {
							dimensions: {
								padding: '80px',
							},
						},
					},
				},
			},
			removes: {
				0: {
					0: {
						style: {
							height: 'auto',
						},
					}
				},
			},
		};

		const nextState = {
			... state,
			valids: {
				'client-id': findBlockValids( 'client-id', state ),
			}
		}

		const result = findBlockDifferences(
			'client-id',
			attributes,
			deepFreeze( nextState ),
			state.iframeViewport
		);

		expect( result ).toStrictEqual( check );
	} );
} );


describe( 'findBlockDifferences on Viewport 0 - Stage 2', () => {
	test( 'Changing property on single property from changes', () => {
		const state = deepFreeze( {
			... TEST_STATE,
			changes: {
				'client-id': {
					0: {
						0: {
							style: {
								width: '100%',
							},
						},
					},
				},
			},
		} );

		const attributes = {
			style: {
				width: 'auto',
			},
		};

		const check = {
			changes: {
				0: {
					0: {
						style: {
							width: 'auto',
						},
					},
				},
			},
			removes: {},
		};

		const nextState = {
			... state,
			valids: {
				'client-id': findBlockValids( 'client-id', state ),
			}
		}

		const result = findBlockDifferences(
			'client-id',
			attributes,
			deepFreeze( nextState ),
			state.iframeViewport
		);

		expect( result ).toStrictEqual( check );
	} );

	test( 'Changing property on multiple properties from changes', () => {
		const state = deepFreeze( {
			... TEST_STATE,
			changes: {
				'client-id': {
					0: {
						0: {
							style: {
								width: '100%',
								height: 'auto',
							},
						},
					},
				},
			},
		} );

		const attributes = {
			style: {
				width: 'auto',
				height: '100%',
			},
		};

		const check = {
			changes: {
				0: {
					0: {
						style: {
							width: 'auto',
							height: '100%',
						},
					},
				},
			},
			removes: {},
		};

		const nextState = {
			... state,
			valids: {
				'client-id': findBlockValids( 'client-id', state ),
			}
		}

		const result = findBlockDifferences(
			'client-id',
			attributes,
			deepFreeze( nextState ),
			state.iframeViewport
		);

		expect( result ).toStrictEqual( check );
	} );

	test( 'Changing property on nested array from changes', () => {
		const state = deepFreeze( {
			... TEST_STATE,
			changes: {
				'client-id': {
					0: {
						0: {
							style: {
								layers: [
									{
										foo: 'foo',
										bar: 'bar',
									},
								],
							},
						},
					},
				},
			},
		} );

		const attributes = {
			style: {
				layers: [
					{
						foo: 'bar',
						bar: 'foo',
					},
				],
			},
		};

		const check = {
			changes: {
				0: {
					0: {
						style: {
							layers: [
								{
									foo: 'bar',
									bar: 'foo',
								},
							],
						},
					},
				},
			},
			removes: {},
		};

		const nextState = {
			... state,
			valids: {
				'client-id': findBlockValids( 'client-id', state ),
			}
		}

		const result = findBlockDifferences(
			'client-id',
			attributes,
			deepFreeze( nextState ),
			state.iframeViewport
		);

		expect( result ).toStrictEqual( check );
	} );

	test( 'Changing property on already removed property', () => {
		const state = deepFreeze( {
			... TEST_STATE,
			removes: {
				'client-id': {
					0: {
						0: {
							style: {
								dimensions: {
									height: 'auto',
								}
							},
						},
					},
				},
			},
			saves: {
				'client-id': {
					0: {
						0: {
							style: {
								dimensions: {
									width: '100%',
									height: 'auto',
								}
							},
						},
					},
				},
			},
		} );

		const attributes = {
			style: {
				dimensions: {
					width: '100%',
					height: '100%',
				}
			},
		};

		const check = {
			changes: {
				0: {
					0: {
						style: {
							dimensions: {
								height: '100%',
							}
						},
					},
				},
			},
			removes: {},
		};

		const nextState = {
			... state,
			valids: {
				'client-id': findBlockValids( 'client-id', state ),
			}
		}

		const result = findBlockDifferences(
			'client-id',
			attributes,
			deepFreeze( nextState ),
			state.iframeViewport
		);

		expect( result ).toStrictEqual( check );
	} );

	test( 'Changing property on already removed property - partially', () => {
		const state = deepFreeze( {
			... TEST_STATE,
			removes: {
				'client-id': {
					0: {
						0: {
							style: {
								dimensions: {
									height: 'auto',
									minWidth: '100%',
								}
							},
						},
					},
				},
			},
			saves: {
				'client-id': {
					0: {
						0: {
							style: {
								dimensions: {
									width: '100%',
									height: 'auto',
									minWidth: '100%',
								}
							},
						},
					},
				},
			},
		} );

		const attributes = {
			style: {
				dimensions: {
					width: '100%',
					height: '100%',
				}
			},
		};

		const check = {
			changes: {
				0: {
					0: {
						style: {
							dimensions: {
								height: '100%',
							}
						},
					},
				},
			},
			removes: {
				0: {
					0: {
						style: {
							dimensions: {
								minWidth: '100%',
							}
						},
					},
				},
			},
		};

		const nextState = {
			... state,
			valids: {
				'client-id': findBlockValids( 'client-id', state ),
			}
		}

		const result = findBlockDifferences(
			'client-id',
			attributes,
			deepFreeze( nextState ),
			state.iframeViewport
		);

		expect( result ).toStrictEqual( check );
	} );
} );
