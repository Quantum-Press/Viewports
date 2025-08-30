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
	iframeViewport: 1360,
}


describe( 'findBlockDifferences on Viewport 1360 - Stage 1', () => {
	test( 'Adding property on empty saves and empty changes', () => {
		const state = deepFreeze( {
			... TEST_STATE,
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
		const state = deepFreeze( {
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
		} );

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
		const state = deepFreeze( {
			... TEST_STATE,
			changes: {
				'client-id': {
					0: {
						0: {
							style: {
								width: '100%',
							},
						}
					},
				},
			},
		} );

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
		const state = deepFreeze( {
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
		} );

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


describe( 'findBlockDifferences on Viewport 1360 - Stage 2', () => {
	test( 'Changing property on single property from changes', () => {
		const state = deepFreeze( {
			... TEST_STATE,
			changes: {
				'client-id': {
					1360: {
						0: {
							style: {
								width: '100%',
							},
						}
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
				1360: {
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
					1360: {
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
				1360: {
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
					1360: {
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
				1360: {
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
					1360: {
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
					1360: {
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
				1360: {
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
					1360: {
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
								}
							},
						},
					},
					1360: {
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
				1360: {
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
				1360: {
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


describe( 'findBlockDifferences on Viewport 1360 - Stage 3', () => {
	test( 'Cascade property on complex spread saves', () => {
		const state = deepFreeze( {
			... TEST_STATE,
			saves: {
				'client-id': {
					0: {
						0: {
							style: {
								dimensions: {
									height: "auto",
									minHeight: "100px",
								}
							}
						}
					},
					780: {
						0: {
							style: {
								dimensions: {
									width: "50%",
								}
							}
						}
					},
					1360: {
						0: {
							style: {
								dimensions: {
									height: "100%",
								}
							}
						}
					}
				},
			},
		} );

		const attributes = {
			style: {
				dimensions: {
					width: "100%",
					height: "auto",
					minHeight: "200px",
				}
			},
		};

		const check = {
			changes: {
				0: {
					0: {
						style: {
							dimensions: {
								minHeight: "200px",
							}
						}
					}
				},
				780: {
					0: {
						style: {
							dimensions: {
								width: "100%",
							}
						}
					}
				},
				1360: {
					0: {
						style: {
							dimensions: {
								height: "auto",
							}
						}
					}
				}
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

	test( 'Cascade property on complex spread saves and filled removes', () => {
		const state = deepFreeze( {
			... TEST_STATE,
			removes: {
				'client-id': {
					0: {
						0: {
							style: {
								dimensions: {
									minHeight: "100px",
									maxWidth: "100%",
								}
							}
						}
					}
				}
			},
			saves: {
				'client-id': {
					0: {
						0: {
							style: {
								dimensions: {
									height: "auto",
									minHeight: "100px",
									maxWidth: "100%",
								}
							}
						}
					},
					780: {
						0: {
							style: {
								dimensions: {
									width: "50%",
								}
							}
						}
					},
					1360: {
						0: {
							style: {
								dimensions: {
									height: "100%",
								}
							}
						}
					}
				},
			},
		} );

		const attributes = {
			style: {
				dimensions: {
					width: "100%",
					height: "auto",
					minHeight: "150px",
				},
			},
		};

		const check = {
			changes: {
				0: {
					0: {
						style: {
							dimensions: {
								minHeight: "150px",
							}
						}
					}
				},
				780: {
					0: {
						style: {
							dimensions: {
								width: "100%",
							}
						}
					}
				},
				1360: {
					0: {
						style: {
							dimensions: {
								height: "auto",
							}
						}
					}
				},
			},
			removes: {
				0: {
					0: {
						style: {
							dimensions: {
								maxWidth: "100%",
							},
						}
					}
				}
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

	test( 'Cascade property on complex spread saves and filled removes', () => {
		const state = deepFreeze( {
			... TEST_STATE,
			removes: {
				'client-id': {
					0: {
						0: {
							style: {
								dimensions: {
									minHeight: "100px",
									maxWidth: "100%",
								}
							}
						}
					}
				}
			},
			saves: {
				'client-id': {
					0: {
						0: {
							style: {
								dimensions: {
									height: "auto",
									minHeight: "100px",
									maxWidth: "100%",
								}
							}
						}
					},
					780: {
						0: {
							style: {
								dimensions: {
									width: "50%",
								}
							}
						}
					},
					1360: {
						0: {
							style: {
								dimensions: {
									height: "100%",
								}
							}
						}
					}
				},
			},
		} );

		const attributes = {
			style: {
				dimensions: {
					width: "100%",
					height: "auto",
					minHeight: "150px",
				},
			},
		};

		const check = {
			changes: {
				0: {
					0: {
						style: {
							dimensions: {
								minHeight: "150px",
							}
						}
					}
				},
				780: {
					0: {
						style: {
							dimensions: {
								width: "100%",
							}
						}
					}
				},
				1360: {
					0: {
						style: {
							dimensions: {
								height: "auto",
							}
						}
					}
				},
			},
			removes: {
				0: {
					0: {
						style: {
							dimensions: {
								maxWidth: "100%",
							},
						}
					}
				}
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

	test( 'Cascade property on complex spread saves and persistent nested removes', () => {
		const state = deepFreeze( {
			... TEST_STATE,
			removes: {
				'client-id': {
					0: {
						0: {
							style: {
								spacing: {
									padding: {
										top: "20px",
										bottom: "20px",
									},
									margin: "20px",
								}
							}
						}
					}
				}
			},
			saves: {
				'client-id': {
					0: {
						0: {
							style: {
								spacing: {
									padding: {
										top: "20px",
										bottom: "20px",
									},
									margin: "20px",
								}
							}
						}
					},
					780: {
						0: {
							style: {
								spacing: {
									padding: "20px",
								}
							}
						}
					}
				},
			},
		} );

		const attributes = {
			style: {
				spacing: {
					margin: "40px",
					padding: {
						top: "20px",
						bottom: "40px",
					}
				},
			},
		};

		const check = {
			changes: {
				0: {
					0: {
						style: {
							spacing: {
								margin: "40px",
							}
						}
					}
				},
				780: {
					0: {
						style: {
							spacing: {
								padding: {
									top: "20px",
									bottom: "40px",
								}
							}
						}
					}
				}
			},
			removes: {
				0: {
					0: {
						style: {
							spacing: {
								padding: {
									top: "20px",
									bottom: "20px",
								}
							}
						}
					}
				}
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

	test( 'Cascade property on complex spread saves and filled changes', () => {
		const state = deepFreeze( {
			... TEST_STATE,
			changes: {
				'client-id': {
					780: {
						0: {
							style: {
								spacing: {
									margin: "20px",
									padding: "10px",
								}
							}
						}
					}
				}
			},
			saves: {
				'client-id': {
					0: {
						0: {
							style: {
								dimensions: {
									height: "auto",
								}
							}
						}
					},
					780: {
						0: {
							style: {
								dimensions: {
									width: "50%",
								}
							}
						}
					},
					1360: {
						0: {
							style: {
								dimensions: {
									height: "100%",
								}
							}
						}
					}
				},
			},
		} );

		const attributes = {
			style: {
				dimensions: {
					width: "100%",
					height: "auto",
				},
				spacing: {
					margin: "20px",
					padding: "10px",
				}
			},
		};

		const check = {
			changes: {
				780: {
					0: {
						style: {
							dimensions: {
								width: "100%",
							},
							spacing: {
								margin: "20px",
								padding: "10px",
							}
						}
					}
				},
				1360: {
					0: {
						style: {
							dimensions: {
								height: "auto"
							}
						}
					}
				}
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

	test( 'Cascade property on complex spread saves and spread changes causing a removal', () => {
		const state = deepFreeze( {
			... TEST_STATE,
			changes: {
				'client-id': {
					780: {
						0: {
							style: {
								dimensions: {
									width: "50%",
									minHeight: "200px",
								},
								spacing: {
									margin: "20px",
								},
							}
						}
					},
					1360: {
						0: {
							style: {
								dimensions: {
									height: "100%",
								},
								spacing: {
									margin: "40px",
									padding: "20px",
								},
							}
						}
					}
				}
			},
			saves: {
				'client-id': {
					0: {
						0: {
							style: {
								spacing: {
									margin: "10px",
									padding: "10px",
								}
							}
						}
					},
					780: {
						0: {
							style: {
								spacing: {
									margin: "20px",
								}
							}
						}
					},
					1360: {
						0: {
							style: {
								dimensions: {
									height: "100%",
								},
								spacing: {
									margin: "20px",
									padding: "10px",
								},
							}
						}
					}
				},
			},
		} );

		const attributes = {
			style: {
				dimensions: {
					width: "100%",
					minHeight: "200px",
				},
				spacing: {
					margin: "40px",
					padding: "20px",
				},
			},
		};

		const check = {
			changes: {
				780: {
					0: {
						style: {
							dimensions: {
								width: "100%",
								minHeight: "200px",
							},
							spacing: {
								margin: "20px",
							},
						}
					}
				},
				1360: {
					0: {
						style: {
							spacing: {
								margin: "40px",
								padding: "20px",
							},
						}
					}
				}
			},
			removes: {
				1360: {
					0: {
						style: {
							dimensions: {
								height: "100%"
							}
						}
					}
				}
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

	test( 'Cascade property on complex spread saves and spread changes causing a deep removal', () => {
		const state = deepFreeze( {
			... TEST_STATE,
			changes: {
				'client-id': {
					780: {
						0: {
							style: {
								spacing: {
									margin: "20px",
									padding: "10px",
								},
								dimensions: {
									height: "100%",
								}
							}
						}
					}
				}
			},
			removes: {
				1360: {
					0: {
						style: {
							border: {
								top: "1px solid #000",
							}
						}
					}
				},
			},
			saves: {
				'client-id': {
					0: {
						0: {
							style: {
								spacing: {
									margin: "10px",
									padding: "10px",
								}
							}
						}
					},
					780: {
						0: {
							style: {
								spacing: {
									margin: "15px",
								},
								dimensions: {
									height: "auto"
								}
							}
						}
					},
					1360: {
						0: {
							style: {
								border: {
									top: "1px solid #000",
								},
							}
						}
					},
				},
			},
		} );

		const attributes = {
			style: {
				dimensions: {
					width: "100%",
				},
				spacing: {
					margin: "20px",
					padding: "10px",
				},
			}
		};

		const check = {
			changes: {
				0: {
					0: {
						style: {
							dimensions: {
								width: "100%"
							}
						}
					}
				},
				780: {
					0: {
						style: {
							spacing: {
								margin: "20px",
								padding: "10px",
							}
						}
					}
				}
			},
			removes: {
				780: {
					0: {
						style: {
							dimensions: {
								height: "auto"
							}
						}
					}
				},
				1360: {
					0: {
						style: {
							border: {
								top: "1px solid #000",
							}
						}
					}
				}
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


describe( 'findBlockDifferences on Viewport 1360 - Stage 4', () => {
	test( 'Removing entire property from saves', () => {
		const state = deepFreeze( {
			... TEST_STATE,
			saves: {
				'client-id': {
					780: {
						0: {
							style: {
								dimensions: {
									padding: {
										top: '10px',
										right: '10px',
										bottom: '10px',
										left: '10px',
									}
								}
							}
						}
					}
				}
			}
		} );

		const attributes = {
			style: {},
		};

		const check = {
			changes: {},
			removes: {
				780: {
					0: {
						style: {
							dimensions: {
								padding: {
									top: '10px',
									right: '10px',
									bottom: '10px',
									left: '10px',
								}
							}
						}
					}
				}
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

	test( 'Removing entire property from saves and changes', () => {
		const state = deepFreeze( {
			... TEST_STATE,
			changes: {
				780: {
					0: {
						style: {
							dimensions: {
								padding: {
									top: '20px',
									right: '20px',
									bottom: '20px',
									left: '20px',
								}
							}
						}
					}
				}
			},
			saves: {
				'client-id': {
					780: {
						0: {
							style: {
								dimensions: {
									padding: {
										top: '10px',
										right: '10px',
										bottom: '10px',
										left: '10px',
									}
								}
							}
						}
					}
				}
			}
		} );

		const attributes = {
			style: {},
		};

		const check = {
			changes: {},
			removes: {
				780: {
					0: {
						style: {
							dimensions: {
								padding: {
									top: '10px',
									right: '10px',
									bottom: '10px',
									left: '10px',
								}
							}
						}
					}
				}
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

	test( 'Removing entire property from saves and changes, causing maxWidth by saves', () => {
		const state = deepFreeze( {
			... TEST_STATE,
			changes: {
				'client-id': {
					780: {
						0: {
							style: {
								dimensions: {
									padding: {
										right: '40px',
										left: '40px',
									}
								}
							}
						}
					}
				}
			},
			saves: {
				'client-id': {
					0: {
						0: {
							style: {
								dimensions: {
									padding: {
										top: '10px',
										bottom: '10px',
									}
								}
							}
						}
					},
					780: {
						0: {
							style: {
								dimensions: {
									padding: {
										top: '20px',
										right: '20px',
										bottom: '20px',
										left: '20px',
									}
								}
							}
						}
					}
				}
			}
		} );

		const attributes = {
			style: {},
		};

		const check = {
			changes: {
				0: {
					779: {
						style: {
							dimensions: {
								padding: {
									top: '10px',
									bottom: '10px',
								}
							}
						}
					}
				},
			},
			removes: {
				0: {
					0: {
						style: {
							dimensions: {
								padding: {
									top: '10px',
									bottom: '10px',
								}
							}
						}
					}
				},
				780: {
					0: {
						style: {
							dimensions: {
								padding: {
									top: '20px',
									right: '20px',
									bottom: '20px',
									left: '20px',
								}
							}
						}
					}
				}
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

	test( 'Removing entire property from saves and changes, causing maxWidth by changes', () => {
		const state = deepFreeze( {
			... TEST_STATE,
			changes: {
				'client-id': {
					0: {
						0: {
							style: {
								dimensions: {
									padding: {
										top: '10px',
										bottom: '10px',
									}
								}
							}
						}
					},
					780: {
						0: {
							style: {
								dimensions: {
									padding: {
										right: '40px',
										left: '40px',
									}
								}
							}
						}
					}
				}
			},
			saves: {
				'client-id': {
					780: {
						0: {
							style: {
								dimensions: {
									padding: {
										top: '20px',
										right: '20px',
										bottom: '20px',
										left: '20px',
									}
								}
							}
						}
					}
				}
			}
		} );

		const attributes = {
			style: {},
		};

		const check = {
			changes: {
				0: {
					779: {
						style: {
							dimensions: {
								padding: {
									top: '10px',
									bottom: '10px',
								}
							}
						}
					}
				},
			},
			removes: {
				780: {
					0: {
						style: {
							dimensions: {
								padding: {
									top: '20px',
									right: '20px',
									bottom: '20px',
									left: '20px',
								}
							}
						}
					}
				}
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

	test( 'Removing entire property from saves and changes, ignoring maxWidth in saves', () => {
		const state = deepFreeze( {
			... TEST_STATE,
			changes: {
				'client-id': {
					780: {
						0: {
							style: {
								dimensions: {
									padding: {
										right: '40px',
										left: '40px',
									}
								}
							}
						}
					}
				}
			},
			saves: {
				'client-id': {
					0: {
						359: {
							style: {
								dimensions: {
									padding: {
										top: '10px',
										bottom: '10px',
									}
								}
							}
						}
					},
					780: {
						0: {
							style: {
								dimensions: {
									padding: {
										top: '20px',
										right: '20px',
										bottom: '20px',
										left: '20px',
									}
								}
							}
						}
					}
				}
			}
		} );

		const attributes = {
			style: {},
		};

		const check = {
			changes: {},
			removes: {
				780: {
					0: {
						style: {
							dimensions: {
								padding: {
									top: '20px',
									right: '20px',
									bottom: '20px',
									left: '20px',
								}
							}
						}
					}
				}
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

	test( 'Removing entire property from saves and changes, ignoring maxWidth in changes', () => {
		const state = deepFreeze( {
			... TEST_STATE,
			changes: {
				'client-id': {
					0: {
						359: {
							style: {
								dimensions: {
									padding: {
										top: '10px',
										bottom: '10px',
									}
								}
							}
						}
					},
					780: {
						0: {
							style: {
								dimensions: {
									padding: {
										right: '40px',
										bottom: '40px',
									}
								}
							}
						}
					}
				}
			},
			saves: {
				'client-id': {
					780: {
						0: {
							style: {
								dimensions: {
									padding: {
										top: '20px',
										right: '20px',
										bottom: '20px',
										left: '20px',
									}
								}
							}
						}
					}
				}
			}
		} );

		const attributes = {
			style: {},
		};

		const check = {
			changes: {
				0: {
					359: {
						style: {
							dimensions: {
								padding: {
									top: '10px',
									bottom: '10px',
								}
							}
						}
					}
				},
			},
			removes: {
				780: {
					0: {
						style: {
							dimensions: {
								padding: {
									top: '20px',
									right: '20px',
									bottom: '20px',
									left: '20px',
								}
							}
						}
					}
				}
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


describe( 'findBlockDifferences on Viewport 1360 - Stage 5', () => {
	test( 'Removing partial property from saves', () => {
		const state = deepFreeze( {
			... TEST_STATE,
			saves: {
				'client-id': {
					780: {
						0: {
							style: {
								dimensions: {
									padding: {
										top: '10px',
										right: '10px',
										bottom: '10px',
										left: '10px',
									}
								}
							}
						}
					}
				}
			}
		} );

		const attributes = {
			style: {
				dimensions: {
					padding: {
						right: '10px',
						left: '10px',
					}
				}
			},
		};

		const check = {
			changes: {},
			removes: {
				780: {
					0: {
						style: {
							dimensions: {
								padding: {
									top: '10px',
									bottom: '10px',
								}
							}
						}
					}
				}
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

	test( 'Removing partial property from saves and changes', () => {
		const state = deepFreeze( {
			... TEST_STATE,
			changes: {
				780: {
					0: {
						style: {
							dimensions: {
								padding: {
									top: '20px',
									right: '20px',
									bottom: '20px',
									left: '20px',
								}
							}
						}
					}
				}
			},
			saves: {
				'client-id': {
					780: {
						0: {
							style: {
								dimensions: {
									padding: {
										top: '10px',
										right: '10px',
										bottom: '10px',
										left: '10px',
									}
								}
							}
						}
					}
				}
			}
		} );

		const attributes = {
			style: {
				dimensions: {
					padding: {
						right: '20px',
						left: '20px',
					}
				}
			},
		};

		const check = {
			changes: {
				780: {
					0: {
						style: {
							dimensions: {
								padding: {
									left: '20px',
									right: '20px',
								}
							}
						}
					}
				}
			},
			removes: {
				780: {
					0: {
						style: {
							dimensions: {
								padding: {
									top: '10px',
									bottom: '10px',
								}
							}
						}
					}
				}
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

	test( 'Removing partial property from saves and changes, causing maxWidth by saves', () => {
		const state = deepFreeze( {
			... TEST_STATE,
			changes: {
				'client-id': {
					780: {
						0: {
							style: {
								dimensions: {
									padding: {
										right: '40px',
										left: '40px',
									}
								}
							}
						}
					}
				}
			},
			saves: {
				'client-id': {
					0: {
						0: {
							style: {
								dimensions: {
									padding: {
										top: '10px',
										bottom: '10px',
									}
								}
							}
						}
					},
					780: {
						0: {
							style: {
								dimensions: {
									padding: {
										top: '20px',
										right: '20px',
										bottom: '20px',
										left: '20px',
									}
								}
							}
						}
					}
				}
			}
		} );

		const attributes = {
			style: {
				dimensions: {
					padding: {
						right: '40px',
						left: '40px',
					}
				}
			},
		};

		const check = {
			changes: {
				0: {
					779: {
						style: {
							dimensions: {
								padding: {
									top: '10px',
									bottom: '10px',
								}
							}
						}
					},
				},
				780: {
					0: {
						style: {
							dimensions: {
								padding: {
									right: '40px',
									left: '40px',
								}
							}
						}
					}
				}
			},
			removes: {
				0: {
					0: {
						style: {
							dimensions: {
								padding: {
									top: '10px',
									bottom: '10px',
								}
							}
						}
					}
				},
				780: {
					0: {
						style: {
							dimensions: {
								padding: {
									top: '20px',
									bottom: '20px',
								}
							}
						}
					}
				}
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

	test( 'Removing partial property from saves and changes, causing maxWidth by changes', () => {
		const state = deepFreeze( {
			... TEST_STATE,
			changes: {
				'client-id': {
					0: {
						0: {
							style: {
								dimensions: {
									padding: {
										top: '10px',
										bottom: '10px',
									}
								}
							}
						}
					},
					780: {
						0: {
							style: {
								dimensions: {
									padding: {
										right: '40px',
										left: '40px',
									}
								}
							}
						}
					}
				}
			},
			saves: {
				'client-id': {
					780: {
						0: {
							style: {
								dimensions: {
									padding: {
										top: '20px',
										right: '20px',
										bottom: '20px',
										left: '20px',
									}
								}
							}
						}
					}
				}
			}
		} );

		const attributes = {
			style: {
				dimensions: {
					padding: {
						right: '40px',
						left: '40px',
					}
				}
			},
		};

		const check = {
			changes: {
				0: {
					779: {
						style: {
							dimensions: {
								padding: {
									top: '10px',
									bottom: '10px',
								}
							}
						}
					}
				},
				780: {
					0: {
						style: {
							dimensions: {
								padding: {
									right: '40px',
									left: '40px',
								}
							}
						}
					}
				}
			},
			removes: {
				780: {
					0: {
						style: {
							dimensions: {
								padding: {
									top: '20px',
									bottom: '20px',
								}
							}
						}
					}
				}
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

	test( 'Removing partial property from saves and changes, ignoring maxWidth in saves', () => {
		const state = deepFreeze( {
			... TEST_STATE,
			changes: {
				'client-id': {
					780: {
						0: {
							style: {
								dimensions: {
									padding: {
										right: '40px',
										left: '40px',
									}
								}
							}
						}
					}
				}
			},
			saves: {
				'client-id': {
					0: {
						359: {
							style: {
								dimensions: {
									padding: {
										top: '10px',
										bottom: '10px',
									}
								}
							}
						}
					},
					780: {
						0: {
							style: {
								dimensions: {
									padding: {
										top: '20px',
										right: '20px',
										bottom: '20px',
										left: '20px',
									}
								}
							}
						}
					}
				}
			}
		} );

		const attributes = {
			style: {
				dimensions: {
					padding: {
						right: '40px',
						left: '40px',
					}
				}
			},
		};

		const check = {
			changes: {
				780: {
					0: {
						style: {
							dimensions: {
								padding: {
									right: '40px',
									left: '40px',
								}
							}
						}
					}
				}
			},
			removes: {
				780: {
					0: {
						style: {
							dimensions: {
								padding: {
									top: '20px',
									bottom: '20px',
								}
							}
						}
					}
				}
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

	test( 'Removing partial property from saves and changes, ignoring maxWidth in changes', () => {
		const state = deepFreeze( {
			... TEST_STATE,
			changes: {
				'client-id': {
					0: {
						359: {
							style: {
								dimensions: {
									padding: {
										top: '10px',
										bottom: '10px',
									}
								}
							}
						}
					},
					780: {
						0: {
							style: {
								dimensions: {
									padding: {
										right: '40px',
										left: '40px',
									}
								}
							}
						}
					}
				}
			},
			saves: {
				'client-id': {
					780: {
						0: {
							style: {
								dimensions: {
									padding: {
										top: '20px',
										right: '20px',
										bottom: '20px',
										left: '20px',
									}
								}
							}
						}
					}
				}
			}
		} );

		const attributes = {
			style: {
				dimensions: {
					padding: {
						right: '40px',
						left: '40px',
					}
				}
			},
		};

		const check = {
			changes: {
				0: {
					359: {
						style: {
							dimensions: {
								padding: {
									top: '10px',
									bottom: '10px',
								}
							}
						}
					}
				},
				780: {
					0: {
						style: {
							dimensions: {
								padding: {
									right: '40px',
									left: '40px',
								}
							}
						}
					}
				}
			},
			removes: {
				780: {
					0: {
						style: {
							dimensions: {
								padding: {
									top: '20px',
									bottom: '20px',
								}
							}
						}
					}
				}
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

/*
describe( 'findBlockDifferences on Viewport 1360 - Stage 6', () => {
	test( 'Reverting Stage 5 partial property from saves', () => {
		const state = deepFreeze( {
			... TEST_STATE,
			saves: {
				'client-id': {
					780: {
						0: {
							style: {
								dimensions: {
									padding: {
										top: '10px',
										right: '10px',
										bottom: '10px',
										left: '10px',
									}
								}
							}
						}
					}
				}
			}
		} );

		const attributes = {
			style: {
				dimensions: {
					padding: {
						right: '10px',
						left: '10px',
					}
				}
			},
		};

		const check = {
			changes: {},
			removes: {
				780: {
					0: {
						style: {
							dimensions: {
								padding: {
									top: '10px',
									bottom: '10px',
								}
							}
						}
					}
				}
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
*/

/*
describe( 'findBlockDifferences on Viewport 1360 - Stage 7', () => {
	test( 'Replacing nested property with literal from saves', () => {
		const state = deepFreeze( {
			... TEST_STATE,
			saves: {
				'client-id': {
					780: {
						0: {
							style: {
								dimensions: {
									padding: {
										top: '10px',
										right: '10px',
										bottom: '10px',
										left: '10px',
									}
								}
							}
						}
					}
				}
			}
		} );

		const attributes = {
			style: {
				dimensions: {
					padding: {
						right: '10px',
						left: '10px',
					}
				}
			},
		};

		const check = {
			changes: {},
			removes: {
				780: {
					0: {
						style: {
							dimensions: {
								padding: {
									top: '10px',
									bottom: '10px',
								}
							}
						}
					}
				}
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
*/


describe( 'findBlockDifferences on Viewport 1360 - Stage 8', () => {
	test( 'Appending viewport to harm maxWidth property from saves', () => {
		const state = deepFreeze( {
			... TEST_STATE,
			changes: {},
			saves: {
				'client-id': {
					0: {
						779: {
							style: {
								dimensions: {
									padding: {
										top: '10px',
										bottom: '10px',
									}
								}
							}
						}
					}
				}
			}
		} );

		const attributes = {
			style: {
				dimensions: {
					padding: {
						top: '10px',
						right: '20px',
						bottom: '10px',
						left: '20px',
					}
				}
			},
		};

		const check = {
			changes: {
				780: {
					0: {
						style: {
							dimensions: {
								padding: {
									top: '10px',
									right: '20px',
									bottom: '10px',
									left: '20px',
								}
							}
						}
					}
				}
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

	test( 'Appending viewport to harm maxWidth property from split saves', () => {
		const state = deepFreeze( {
			... TEST_STATE,
			changes: {},
			saves: {
				'client-id': {
					0: {
						359: {
							style: {
								dimensions: {
									padding: {
										top: '10px',
									}
								}
							}
						},
						779: {
							style: {
								dimensions: {
									padding: {
										bottom: '10px',
									}
								}
							}
						}
					}
				}
			}
		} );

		const attributes = {
			style: {
				dimensions: {
					padding: {
						top: '10px',
						right: '20px',
						bottom: '10px',
						left: '20px',
					}
				}
			},
		};

		const check = {
			changes: {
				780: {
					0: {
						style: {
							dimensions: {
								padding: {
									top: '10px',
									right: '20px',
									bottom: '10px',
									left: '20px',
								}
							}
						}
					}
				}
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

	test( 'Appending viewport to harm maxWidth property from different split saves', () => {
		const state = deepFreeze( {
			... TEST_STATE,
			changes: {},
			saves: {
				'client-id': {
					0: {
						359: {
							style: {
								dimensions: {
									padding: {
										top: '5px',
									}
								}
							}
						},
						779: {
							style: {
								dimensions: {
									padding: {
										bottom: '10px',
									}
								}
							}
						}
					}
				}
			}
		} );

		const attributes = {
			style: {
				dimensions: {
					padding: {
						top: '10px',
						right: '20px',
						bottom: '10px',
						left: '20px',
					}
				}
			},
		};

		const check = {
			changes: {
				780: {
					0: {
						style: {
							dimensions: {
								padding: {
									top: '10px',
									right: '20px',
									bottom: '10px',
									left: '20px',
								}
							}
						}
					}
				}
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

	test( 'Appending viewport to harm maxWidth property from different split saves tangled down starting new - literal to nested - 1360', () => {
		const state = deepFreeze( {
			... TEST_STATE,
			changes: {},
			saves: {
				'client-id': {
					0: {
						0: {
							style: {
								dimensions: {
									padding: {
										left: '10px',
										right: '10px',
									}
								}
							}
						},
						359: {
							style: {
								dimensions: {
									padding: {
										top: '5px',
										bottom: '5px',
									}
								}
							}
						},
					},
					360: {
						0: {
							style: {
								dimensions: {
									padding: '20px',
								}
							}
						}
					},
					780: {
						1359: {
							style: {
								dimensions: {
									padding: '40px',
								}
							}
						}
					}
				}
			}
		} );

		const attributes = {
			style: {
				dimensions: {
					padding: {
						top: '40px',
						right: '20px',
						bottom: '40px',
						left: '20px',
					}
				}
			},
		};

		const check = {
			changes: {
				1360: {
					0: {
						style: {
							dimensions: {
								padding: {
									top: '40px',
									right: '20px',
									bottom: '40px',
									left: '20px',
								}
							}
						}
					}
				}
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

	test( 'Appending viewport to harm maxWidth property from different split saves tangled down starting new - nested to literal - 1360', () => {
		const state = deepFreeze( {
			... TEST_STATE,
			changes: {},
			saves: {
				'client-id': {
					0: {
						0: {
							style: {
								dimensions: {
									padding: {
										left: '10px',
										right: '10px',
									}
								}
							}
						},
						359: {
							style: {
								dimensions: {
									padding: {
										top: '5px',
										bottom: '5px',
									}
								}
							}
						},
					},
					360: {
						0: {
							style: {
								dimensions: {
									padding: '20px',
								}
							}
						}
					},
					780: {
						1359: {
							style: {
								dimensions: {
									padding: {
										top: '40px',
										right: '20px',
										bottom: '40px',
										left: '20px',
									}
								}
							}
						}
					}
				}
			}
		} );

		const attributes = {
			style: {
				dimensions: {
					padding: '40px',
				}
			},
		};

		const check = {
			changes: {
				1360: {
					0: {
						style: {
							dimensions: {
								padding: '40px',
							}
						}
					}
				}
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

	test( 'Appending viewport to harm maxWidth property from different split saves tangled down starting new - literal to nested - 780', () => {
		const state = deepFreeze( {
			... TEST_STATE,
			changes: {},
			saves: {
				'client-id': {
					0: {
						0: {
							style: {
								dimensions: {
									padding: {
										left: '10px',
										right: '10px',
									}
								}
							}
						},
						359: {
							style: {
								dimensions: {
									padding: {
										top: '5px',
										bottom: '5px',
									}
								}
							}
						}
					},
					360: {
						779: {
							style: {
								dimensions: {
									padding: '20px',
								}
							}
						}
					}
				}
			}
		} );

		const attributes = {
			style: {
				dimensions: {
					padding: {
						top: '40px',
						right: '20px',
						bottom: '40px',
						left: '20px',
					}
				}
			},
		};

		const check = {
			changes: {
				0: {
					0: {
						style: {
							dimensions: {
								padding: {
									left: '20px',
									right: '20px',
								}
							}
						}
					}
				},
				780: {
					0: {
						style: {
							dimensions: {
								padding: {
									top: '40px',
									bottom: '40px',
								}
							}
						}
					}
				}
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

	test( 'Appending viewport to harm maxWidth property from different split saves tangled down starting new - nested to literal - 780', () => {
		const state = deepFreeze( {
			... TEST_STATE,
			changes: {},
			saves: {
				'client-id': {
					0: {
						0: {
							style: {
								dimensions: {
									padding: {
										left: '10px',
										right: '10px',
									}
								}
							}
						},
						359: {
							style: {
								dimensions: {
									padding: {
										top: '5px',
										bottom: '5px',
									}
								}
							}
						}
					},
					360: {
						779: {
							style: {
								dimensions: {
									padding: {
										top: '40px',
										right: '20px',
										bottom: '40px',
										left: '20px',
									}
								}
							}
						}
					}
				}
			}
		} );

		const attributes = {
			style: {
				dimensions: {
					padding: '20px',
				}
			},
		};

		const check = {
			changes: {
				780: {
					0: {
						style: {
							dimensions: {
								padding: '20px',
							}
						}
					}
				}
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
} );


describe( 'findBlockDifferences on Viewport 1360 - Stage 9', () => {
	test( 'Ignoring maxWidth property changes', () => {
		const state = deepFreeze( {
			... TEST_STATE,
			changes: {
				'client-id': {
					0: {
						359: {
							style: {
								dimensions: {
									padding: {
										top: '5px',
									}
								}
							}
						},
						779: {
							style: {
								dimensions: {
									padding: {
										bottom: '10px',
									}
								}
							}
						}
					},
					780: {
						0: {
							style: {
								dimensions: {
									padding: {
										top: '40px',
										bottom: '40px',
									}
								}
							}
						}
					}
				}
			}
		} );

		const attributes = {
			style: {
				dimensions: {
					padding: {
						top: '60px',
						right: '20px',
						bottom: '60px',
						left: '20px',
					}
				}
			},
		};

		const check = {
			changes: {
				0: {
					0: {
						style: {
							dimensions: {
								padding: {
									left: '20px',
									right: '20px',
								}
							}
						}
					},
					359: {
						style: {
							dimensions: {
								padding: {
									top: '5px',
								}
							}
						}
					},
					779: {
						style: {
							dimensions: {
								padding: {
									bottom: '10px',
								}
							}
						}
					}
				},
				780: {
					0: {
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

	test( 'Ignoring maxWidth property changes from different split saves', () => {
		const state = deepFreeze( {
			... TEST_STATE,
			changes: {
				'client-id': {
					780: {
						0: {
							style: {
								dimensions: {
									padding: {
										top: '40px',
										bottom: '40px',
									}
								}
							}
						}
					}
				}
			},
			saves: {
				'client-id': {
					0: {
						359: {
							style: {
								dimensions: {
									padding: {
										top: '5px',
									}
								}
							}
						},
						779: {
							style: {
								dimensions: {
									padding: {
										bottom: '10px',
									}
								}
							}
						}
					}
				}
			}
		} );

		const attributes = {
			style: {
				dimensions: {
					padding: {
						top: '60px',
						right: '20px',
						bottom: '60px',
						left: '20px',
					}
				}
			},
		};

		const check = {
			changes: {
				0: {
					0: {
						style: {
							dimensions: {
								padding: {
									right: '20px',
									left: '20px',
								}
							}
						}
					}
				},
				780: {
					0: {
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
} );






