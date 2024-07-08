// Import preparement dependencies.
import deepFreeze from 'deep-freeze';
import * as lodash from 'lodash';
import * as React from 'react';
import * as data from '@wordpress/data';
import * as element from '@wordpress/element';
import * as styleEngine from '@wordpress/style-engine';

// Extend global window object.
global.window[ 'wp' ] = {
	data,
	element,
	styleEngine
};
global.window[ 'lodash' ] = lodash;
global.window[ 'React' ] = React;

// Import test environment.
import { describe, expect, test } from '@jest/globals';

// Import store parts.
import { DEFAULT_STATE } from '../default';
import {
	isInDesktopRange,
	isInTabletRange,
	isInMobileRange,
	getHighestPossibleViewport,
	findBlockSaves,
	clearEmptySaves,
	findBlockChanges,
	findObjectChanges,
	findBlockValids,
	findRemoves,
	findCleanedChanges,
} from '../utils';

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

	test( 'can findBlockSaves() with empty attributes', () => {
		const result = findBlockSaves( {} );

		expect( result ).toStrictEqual( {} );
	} );

	test( 'can findBlockSaves() with filled attributes', () => {
		const saves = {
			320: {
				style: {
					dimensions: {
						padding: {
							top: '20px',
							bottom: '20px',
						},
						margin: {
							left: '20px',
							right: '20px',
						},
					},
					test: {
						foo: 'empty',
						bar: {
							filled: true,
							empty: false,
							value: '20px',
						}
					}
				},
			},
			1024: {
				style: {
					dimensions: {
						padding: '40px',
						margin: '40px',
					},
					margin: {
						left: '60px',
						right: '60px',
					}
				},
			},
		};
		const attributes = {
			content: 'Text',
			viewports: saves,
		}

		const result = findBlockSaves( attributes );

		expect( result ).toStrictEqual( { 'client-id': saves } );
	} );

	test( 'can clearEmptySaves() with empty saves', () => {
		const result = clearEmptySaves( {} );

		expect( result ).toStrictEqual( {} );
	} );

	test( 'can clearEmptySaves() with mixed saves', () => {
		const saves = {
			320: {
				style: {
					dimensions: {
						padding: {
							top: '20px',
							bottom: '20px',
						},
					},
				},
			},
			475: {},
			768: {},
			1024: {
				style: {
					dimensions: {
						padding: '40px',
						margin: '40px',
					},
					margin: {
						left: '60px',
						right: '60px',
					}
				},
			},
			1360: {},
		}

		const check = {
			320: {
				style: {
					dimensions: {
						padding: {
							top: '20px',
							bottom: '20px',
						},
					},
				},
			},
			1024: {
				style: {
					dimensions: {
						padding: '40px',
						margin: '40px',
					},
					margin: {
						left: '60px',
						right: '60px',
					}
				},
			},
		}

		const result = clearEmptySaves( saves );

		expect( result ).toStrictEqual( check );
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

	test( 'can findBlockChanges() with filled attributes and without defaults, saves and changes', () => {
		const state = deepFreeze( {
			... DEFAULT_STATE,
			defaults: {},
			saves: {},
			changes: {}
		} );

		const attributes = {
			style: {
				dimensions: {
					padding: '80px',
				}
			}
		};

		const check768 = {
			dimensions: {
				padding: '80px',
			}
		};


		const result768 = findBlockChanges( 'client-id', attributes, state, state.viewport );

		expect( result768 ).toStrictEqual( check768 );
	} );

	test( 'can findBlockChanges() with filled attributes and prefilled changes', () => {
		const state = deepFreeze( {
			... DEFAULT_STATE,
			defaults: {
				'client-id': {
					style: {
						width: '100%',
						height: 'auto',
						dimensions: {
							margin: {
								left: 0,
								right: 0,
							}
						}
					}
				}
			},
			saves: {
				'client-id': {
					375: {
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
					},
					1280: {
						style: {
							dimensions: {
								padding: {
									top: '60px',
									bottom: '60px',
								}
							}
						}
					}
				}
			},
			changes: {
				'client-id': {
					1280: {
						style: {
							height: '100vw',
							dimensions: {
								padding: {
									top: '80px',
									bottom: '80px',
								}
							}
						}
					}
				}
			}
		} );

		const attributes = {
			style: {
				width: 'auto',
				height: '100vw',
				dimensions: {
					padding: '80px',
					margin: {
						left: '40px',
						right: '40px',
					}
				}
			}
		};

		const check1280 = {
			width: 'auto',
			dimensions: {
				padding: '80px',
			}
		};
		const result1280 = findBlockChanges( 'client-id', attributes, state, state.viewport );

		expect( result1280 ).toStrictEqual( check1280 );
	} );

	test( 'can findBlockChanges() with filled attributes and prefilled changes including arrays', () => {
		const state = deepFreeze( {
			... DEFAULT_STATE,
			viewports: {
				375: 'Mobile',
				1280: 'Desktop',
			},
			defaults: {
				'client-id': {
					style: {
						width: '100%',
						height: 'auto',
						dimensions: {
							margin: {
								left: 0,
								right: 0,
							}
						}
					}
				}
			},
			saves: {
				'client-id': {
					375: {
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
					},
					1280: {
						style: {
							layers: [
								{
									foo: 'bar',
								}
							],
							dimensions: {
								padding: {
									top: '60px',
									bottom: '60px',
								}
							}
						}
					}
				}
			},
			changes: {
				'client-id': {
					1280: {
						style: {
							dimensions: {
								padding: {
									top: '80px',
									bottom: '80px',
								}
							}
						}
					}
				}
			}
		} );

		const attributes = {
			style: {
				width: 'auto',
				height: 'auto',
				layers: [
					{
						bar: 'foo',
					},
					{
						foo: 'bar',
					}
				],
				dimensions: {
					padding: '80px',
					margin: {
						left: '40px',
						right: '40px',
					}
				}
			}
		};

		const check1280 = {
			width: 'auto',
			layers: [
				{
					bar: 'foo',
				},
				{
					foo: 'bar',
				}
			],
			dimensions: {
				padding: '80px',
			}
		};
		const result1280 = findBlockChanges( 'client-id', attributes, state, state.viewport );

		expect( result1280 ).toStrictEqual( check1280 );
	} );

	test( 'can findBlockChanges() with filled attributes and prefilled changes including arrays reversed order', () => {
		const state = deepFreeze( {
			... DEFAULT_STATE,
			defaults: {
				'client-id': {
					style: {
						width: '100%',
						height: 'auto',
						dimensions: {
							margin: {
								left: 0,
								right: 0,
							}
						}
					}
				}
			},
			saves: {
				'client-id': {
					375: {
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
					},
					1280: {
						style: {
							layers: [
								{
									foo: 'bar',
								},
								{
									bar: 'foo',
								}
							],
							dimensions: {
								padding: {
									top: '60px',
									bottom: '60px',
								}
							}
						}
					}
				}
			},
			changes: {
				'client-id': {
					1280: {
						style: {
							dimensions: {
								padding: {
									top: '80px',
									bottom: '80px',
								}
							}
						}
					}
				}
			}
		} );

		const attributes = {
			style: {
				width: 'auto',
				height: 'auto',
				layers: [
					{
						bar: 'foo',
					},
					{
						foo: 'bar',
					}
				],
				dimensions: {
					padding: '80px',
					margin: {
						left: '40px',
						right: '40px',
					}
				}
			}
		};

		const check1280 = {
			width: 'auto',
			layers: [
				{
					bar: 'foo',
				},
				{
					foo: 'bar',
				}
			],
			dimensions: {
				padding: '80px',
			}
		};
		const result1280 = findBlockChanges( 'client-id', attributes, state, state.viewport );

		expect( result1280 ).toStrictEqual( check1280 );
	} );

	test( 'can findBlockValids() with filled attributes', () => {
		const state = deepFreeze( {
			... DEFAULT_STATE,
			defaults: {
				'client-id': {
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
			},
			saves: {
				'client-id': {
					768: {
						style: {
							width: '50%',
							height: 'auto',
							dimensions: {
								margin: {
									top: '40px',
									bottom: '40px',
								}
							}
						}
					},
					1280: {
						style: {
							dimensions: {
								padding: '40px',
							}
						}
					}
				}
			},
			changes: {
				'client-id': {
					1280: {
						style: {
							width: '33.33%',
						}
					},
					1920: {
						style: {
							width: '20%',
						}
					}
				}
			},
			viewports: {
				375: 'Mobile',
				768: 'Tablet',
				1024: 'Tablet large',
				1280: 'Desktop',
				1920: 'Desktop large',
			}
		} );

		const check = {
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
			},
			375: {
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
			},
			768: {
				style: {
					width: '50%',
					height: 'auto',
					dimensions: {
						padding: {
							left: '20px',
							right: '20px',
						},
						margin: {
							top: '40px',
							bottom: '40px',
						}
					}
				}
			},
			1024: {
				style: {
					width: '50%',
					height: 'auto',
					dimensions: {
						padding: {
							left: '20px',
							right: '20px',
						},
						margin: {
							top: '40px',
							bottom: '40px',
						}
					}
				}
			},
			1280: {
				style: {
					width: '33.33%',
					height: 'auto',
					dimensions: {
						padding: '40px',
						margin: {
							top: '40px',
							bottom: '40px',
						}
					}
				}
			},
			1920: {
				style: {
					width: '20%',
					height: 'auto',
					dimensions: {
						padding: '40px',
						margin: {
							top: '40px',
							bottom: '40px',
						}
					}
				}
			}
		};
		const result = findBlockValids( 'client-id', state );

		expect( result ).toStrictEqual( check );
	} );

	test( 'can findRemoves() with filled attributes from the first entry on', () => {
		const compare = {
			style: {
				dimensions: {
					padding: {
						top: '20px',
						bottom: '20px',
					}
				}
			}
		};
		const keys = [ 'style' ];

		const check = {
			style: {
				dimensions: {
					padding: {
						top: '20px',
						bottom: '20px',
					}
				}
			}
		};
		const result = findRemoves( keys, compare );

		expect( result ).toStrictEqual( check );
	} );

	test( 'can findRemoves() with filled attributes to the deepest', () => {
		const compare = {
			style: {
				dimensions: {
					padding: {
						top: '20px',
						bottom: '20px',
					}
				}
			}
		};
		const keys = [ 'style', 'dimensions', 'padding', 'top' ];

		const check = {
			style: {
				dimensions: {
					padding: {
						top: '20px',
					}
				}
			}
		};
		const result = findRemoves( keys, compare );

		expect( result ).toStrictEqual( check );
	} );

	test( 'can findCleanedChanges() with filled attributes to remove the whole tree', () => {
		const attributes = {
			style: {
				dimensions: {
					padding: {
						top: '20px',
						bottom: '20px',
					}
				}
			}
		};
		const removes = {
			style: {
				dimensions: {
					padding: {
						top: '20px',
						bottom: '20px',
					}
				}
			}
		}

		const result = findCleanedChanges( attributes, removes );

		expect( result ).toStrictEqual( {} );
	} );

	test( 'can findCleanedChanges() with filled attributes to remove a specific value', () => {
		const attributes = {
			style: {
				dimensions: {
					padding: {
						top: '20px',
						bottom: '20px',
					}
				}
			}
		};
		const removes = {
			style: {
				dimensions: {
					padding: {
						top: '20px',
					}
				}
			}
		}

		const check = {
			style: {
				dimensions: {
					padding: {
						bottom: '20px',
					}
				}
			}
		};
		const result = findCleanedChanges( attributes, removes );

		expect( result ).toStrictEqual( check );
	} );

} );