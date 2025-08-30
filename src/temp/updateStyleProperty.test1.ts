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
import { DEFAULT_STATE } from '../store';
import {
	findBlockDifferences,
	updateBlockDifferences,
	findViewportSetOccurence,
	collapseViewportSet,
} from '../store/utils';

import {
	omitObjectMatching,
	findObjectOccurence,
} from '../utils';
import {
	collapseViewportSetProperty
} from '../store/utils/collapseViewportSetProperty';


describe( 'updateBlockDifferences – Processing Patterns for Cascading and Targeted Updates', () => {

	describe( 'Cascading updates with automatic propagation', () => {
		test( 'Handles updates with empty state – automatic propagation', () => {
			const blockChanges = {};
			const blockRemoves = {};
			const blockSaves = {};

			const checkChanges = {
				0: {
					0: {
						style: {
							dimensions: {
								width: "100%"
							}
						}
					}
				}
			}

			updateBlockDifferences(
				1280,
				false,
				blockChanges,
				blockRemoves,
				blockSaves,
				'dimensions',
				{
					width: "100%"
				}
			);

			expect( blockChanges ).toStrictEqual( checkChanges );
			expect( blockRemoves ).toStrictEqual( {} );
		} );


		test( 'Handles updates with existing saves – automatic propagation', () => {
			const blockChanges = {};
			const blockRemoves = {};
			const blockSaves = {
				0: {
					0: {
						style: {
							dimensions: {
								width: "50%"
							}
						}
					}
				}
			};

			const checkChanges = {
				0: {
					0: {
						style: {
							dimensions: {
								width: "100%"
							}
						}
					}
				}
			}

			updateBlockDifferences(
				1280,
				false,
				blockChanges,
				blockRemoves,
				blockSaves,
				'dimensions',
				{
					width: "100%"
				},
				null,
				null,
				collapseViewportSetProperty( blockSaves, 1280, 'dimensions' ),
			);

			expect( blockChanges ).toStrictEqual( checkChanges );
			expect( blockRemoves ).toStrictEqual( {} );
		} );


		test.only( 'Handles updates with complex saves – automatic propagation', () => {
			const blockChanges = {};
			const blockRemoves = {};
			const blockSaves = {
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
				768: {
					0: {
						style: {
							dimensions: {
								width: "50%",
							}
						}
					}
				},
				1280: {
					0: {
						style: {
							dimensions: {
								height: "100%",
							}
						}
					}
				}
			};

			const checkChanges = {
				0: {
					0: {
						style: {
							dimensions: {
								minHeight: "200px",
							}
						}
					}
				},
				768: {
					0: {
						style: {
							dimensions: {
								width: "100%",
							}
						}
					}
				},
				1280: {
					0: {
						style: {
							dimensions: {
								height: "auto",
							}
						}
					}
				}
			}

			updateBlockDifferences(
				1280,
				false,
				blockChanges,
				blockRemoves,
				blockSaves,
				'dimensions',
				{
					width: "100%",
					height: "auto",
					minHeight: "200px",
				},
				null,
				null,
				collapseViewportSetProperty( blockSaves, 1280, 'dimensions' ),
			);

			expect( blockChanges ).toStrictEqual( checkChanges );
			expect( blockRemoves ).toStrictEqual( {} );
		} );


		test.only( 'Handles cascading updates with filled removes and multi-level saves – automatic propagation (dimensions)', () => {
			const blockChanges = {};
			const blockRemoves = {
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
			};
			const blockSaves = {
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
				768: {
					0: {
						style: {
							dimensions: {
								width: "50%",
							}
						}
					}
				},
				1280: {
					0: {
						style: {
							dimensions: {
								height: "100%",
							}
						}
					}
				}
			};

			const checkChanges = {
				0: {
					0: {
						style: {
							dimensions: {
								minHeight: "150px",
							}
						}
					}
				},
				768: {
					0: {
						style: {
							dimensions: {
								width: "100%",
							}
						}
					}
				},
				1280: {
					0: {
						style: {
							dimensions: {
								height: "auto",
							}
						}
					}
				},
			}

			const checkRemoves = {
				0: {
					0: {
						style: {
							dimensions: {
								maxWidth: "100%",
							},
						}
					}
				}
			}

			updateBlockDifferences(
				1280,
				false,
				blockChanges,
				blockRemoves,
				blockSaves,
				'dimensions',
				{
					width: "100%",
					height: "auto",
					minHeight: "150px",
				},
				null,
				collapseViewportSetProperty( blockRemoves, 1280, 'dimensions' ),
				collapseViewportSetProperty( blockSaves, 1280, 'dimensions' )
			);

			expect( blockChanges ).toStrictEqual( checkChanges );
			expect( blockRemoves ).toStrictEqual( checkRemoves );
		} );


		test.only( 'Resolves viewport-based changes while enforcing removal consistency – automatic propagation (spacing)', () => {
			const blockChanges = {};
			const blockRemoves = {
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
			};
			const blockSaves = {
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
				768: {
					0: {
						style: {
							spacing: {
								padding: "20px",
							}
						}
					}
				}
			};

			const checkChanges = {
				0: {
					0: {
						style: {
							spacing: {
								margin: "40px",
							}
						}
					}
				},
				768: {
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
			};

			const checkRemoves = {
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
			};

			updateBlockDifferences(
				1280,
				false,
				blockChanges,
				blockRemoves,
				blockSaves,
				'spacing',
				{
					margin: "40px",
					padding: {
						top: "20px",
						bottom: "40px",
					}
				},
				null,
				collapseViewportSetProperty( blockRemoves, 1280, 'spacing' ),
				collapseViewportSetProperty( blockSaves, 1280, 'spacing' )
			);

			expect( blockChanges ).toStrictEqual( checkChanges );
			expect( blockRemoves ).toStrictEqual( checkRemoves );
		} );


		test.only( 'Handles complex saves with filled changes and empty removes – automatic propagation', () => {
			const blockChanges = {
				768: {
					0: {
						style: {
							spacing: {
								margin: "20px",
								padding: "10px",
							}
						}
					}
				}
			};
			const blockRemoves = {};
			const blockSaves = {
				0: {
					0: {
						style: {
							dimensions: {
								height: "auto",
							}
						}
					}
				},
				768: {
					0: {
						style: {
							dimensions: {
								width: "50%",
							}
						}
					}
				},
				1280: {
					0: {
						style: {
							dimensions: {
								height: "100%",
							}
						}
					}
				}
			};

			const checkChanges = {
				768: {
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
				1280: {
					0: {
						style: {
							dimensions: {
								height: "auto"
							}
						}
					}
				}
			}

			updateBlockDifferences(
				1280,
				false,
				blockChanges,
				blockRemoves,
				blockSaves,
				'dimensions',
				{
					width: "100%",
					height: "auto"
				},
				collapseViewportSetProperty( blockChanges, 1280, 'dimensions' ),
				null,
				collapseViewportSetProperty( blockSaves, 1280, 'dimensions' )
			);

			expect( blockChanges ).toStrictEqual( checkChanges );
			expect( blockRemoves ).toStrictEqual( {} );
		} );


		test.only( 'Handles partial dimension removal with complex saves and changes – automatic propagation', () => {
			const blockChanges = {
				768: {
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
				1280: {
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
			};
			const blockRemoves = {};
			const blockSaves = {
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
				768: {
					0: {
						style: {
							spacing: {
								margin: "20px",
							}
						}
					}
				},
				1280: {
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
			};

			const checkChanges = {
				768: {
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
				1280: {
					0: {
						style: {
							spacing: {
								margin: "40px",
								padding: "20px",
							},
						}
					}
				}
			}

			const checkRemoves = {
				1280: {
					0: {
						style: {
							dimensions: {
								height: "100%"
							}
						}
					}
				}
			}

			updateBlockDifferences(
				1280,
				false,
				blockChanges,
				blockRemoves,
				blockSaves,
				'dimensions',
				{
					width: "100%",
					minHeight: "200px",
				},
				collapseViewportSetProperty( blockChanges, 1280, 'dimensions' ),
				null,
				collapseViewportSetProperty( blockSaves, 1280, 'dimensions' )
			);

			expect( blockChanges ).toStrictEqual( checkChanges );
			expect( blockRemoves ).toStrictEqual( checkRemoves );
		} );


		test.only( 'Handles partial dimension removal with complex saves, changes and removes – automatic propagation', () => {
			const blockChanges = {
				768: {
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
			};

			const blockRemoves = {
				1280: {
					0: {
						style: {
							border: {
								top: "1px solid #000",
							}
						}
					}
				},
			};

			const blockSaves = {
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
				768: {
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
				1280: {
					0: {
						style: {
							border: {
								top: "1px solid #000",
							},
						}
					}
				},
			};

			const checkChanges = {
				0: {
					0: {
						style: {
							dimensions: {
								width: "100%"
							}
						}
					}
				},
				768: {
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

			const checkRemoves = {
				768: {
					0: {
						style: {
							dimensions: {
								height: "auto"
							}
						}
					}
				},
				1280: {
					0: {
						style: {
							border: {
								top: "1px solid #000",
							}
						}
					}
				}
			}

			updateBlockDifferences(
				1280,
				false,
				blockChanges,
				blockRemoves,
				blockSaves,
				'dimensions',
				{
					width: "100%",
				},
				collapseViewportSetProperty( blockChanges, 1280, 'dimensions' ),
				collapseViewportSetProperty( blockRemoves, 1280, 'dimensions' ),
				collapseViewportSetProperty( blockSaves, 1280, 'dimensions' )
			);

			expect( blockChanges ).toStrictEqual( checkChanges );
			expect( blockRemoves ).toStrictEqual( checkRemoves );
		} );
	} );




	describe( 'Targeted updates with manual override (isEditing)', () => {

		test( 'Handles updates with empty state – manual override (isEditing)', () => {
			const blockChanges = {};
			const blockRemoves = {};
			const blockSaves = {};

			const checkChanges = {
				1280: {
					0: {
						style: {
							dimensions: {
								width: "100%"
							}
						}
					}
				}
			}

			updateBlockDifferences(
				1280,
				true,
				blockChanges,
				blockRemoves,
				blockSaves,
				'dimensions',
				{
					width: "100%"
				}
			);

			expect( blockChanges ).toStrictEqual( checkChanges );
			expect( blockRemoves ).toStrictEqual( {} );
		} );


		test( 'Handles updates with existing saves – manual override (isEditing)', () => {
			const blockChanges = {};
			const blockRemoves = {};
			const blockSaves = {
				0: {
					0: {
						style: {
							dimensions: {
								width: "50%"
							}
						}
					}
				}
			};

			const checkChanges = {
				1280: {
					0: {
						style: {
							dimensions: {
								width: "100%"
							}
						}
					}
				}
			}

			updateBlockDifferences(
				1280,
				true,
				blockChanges,
				blockRemoves,
				blockSaves,
				'dimensions',
				{
					width: "100%"
				},
				null,
				null,
				collapseViewportSetProperty( blockSaves, 1280, 'dimensions' ),
			);

			expect( blockChanges ).toStrictEqual( checkChanges );
			expect( blockRemoves ).toStrictEqual( {} );
		} );


		test( 'Handles updates with complex saves – manual override (isEditing)', () => {
			const blockChanges = {};
			const blockRemoves = {};
			const blockSaves = {
				0: {
					0: {
						style: {
							dimensions: {
								height: "auto",
							}
						}
					}
				},
				768: {
					0: {
						style: {
							dimensions: {
								width: "50%",
							}
						}
					}
				},
				1280: {
					0: {
						style: {
							dimensions: {
								height: "100%",
							}
						}
					}
				}
			};

			const checkChanges = {
				1280: {
					0: {
						style: {
							dimensions: {
								width: "100%",
								height: "auto",
							}
						}
					}
				}
			}

			updateBlockDifferences(
				1280,
				true,
				blockChanges,
				blockRemoves,
				blockSaves,
				'dimensions',
				{
					width: "100%",
					height: "auto",
				},
				null,
				null,
				collapseViewportSetProperty( blockSaves, 1280, 'dimensions' ),
			);

			expect( blockChanges ).toStrictEqual( checkChanges );
			expect( blockRemoves ).toStrictEqual( {} );
		} );


		test( 'Handles targeted updates with filled removes and multi-level saves – manual override (isEditing, dimensions)', () => {
			const blockChanges = {};
			const blockRemoves = {
				0: {
					0: {
						style: {
							dimensions: {
								minHeight: "100px",
								maxWidth: "100%",
							}
						}
					}
				},
			};

			const blockSaves = {
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
				768: {
					0: {
						style: {
							dimensions: {
								width: "50%",
							}
						}
					}
				},
				1280: {
					0: {
						style: {
							dimensions: {
								height: "100%",
							}
						}
					}
				}
			};

			const checkChanges = {
				1280: {
					0: {
						style: {
							dimensions: {
								width: "100%",
								minHeight: "100px",
								height: "auto",
							}
						}
					}
				},
			}

			const checkRemoves = {
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

			updateBlockDifferences(
				1280,
				true,
				blockChanges,
				blockRemoves,
				blockSaves,
				'dimensions',
				{
					width: "100%",
					height: "auto",
					minHeight: "100px",
				},
				null,
				collapseViewportSetProperty( blockRemoves, 1280, 'dimensions' ),
				collapseViewportSetProperty( blockSaves, 1280, 'dimensions' ),
			);

			expect( blockChanges ).toStrictEqual( checkChanges );
			expect( blockRemoves ).toStrictEqual( checkRemoves );
		} );


		test( 'Resolves viewport-based changes while enforcing removal consistency – manual override (isEditing, spacing)', () => {
			const blockChanges = {};
			const blockRemoves = {
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
			};
			const blockSaves = {
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
				768: {
					0: {
						style: {
							spacing: {
								padding: "20px",
							}
						}
					}
				}
			};

			const checkChanges = {
				1280: {
					0: {
						style: {
							spacing: {
								margin: "40px",
								padding: {
									top: "20px",
									bottom: "40px",
								}
							}
						}
					}
				}
			};

			const checkRemoves = {
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
			};

			updateBlockDifferences(
				1280,
				true,
				blockChanges,
				blockRemoves,
				blockSaves,
				'spacing',
				{
					margin: "40px",
					padding: {
						top: "20px",
						bottom: "40px",
					}
				},
				null,
				collapseViewportSetProperty( blockRemoves, 1280, 'spacing' ),
				collapseViewportSetProperty( blockSaves, 1280, 'spacing' )
			);

			expect( blockChanges ).toStrictEqual( checkChanges );
			expect( blockRemoves ).toStrictEqual( checkRemoves );
		} );
	} );


	test( 'Handles complex saves with filled changes and empty removes – manual override (isEditing)', () => {
		const blockChanges = {
			768: {
				0: {
					style: {
						spacing: {
							margin: "20px",
							padding: "10px",
						}
					}
				}
			}
		};
		const blockRemoves = {};
		const blockSaves = {
			0: {
				0: {
					style: {
						dimensions: {
							height: "auto",
						}
					}
				}
			},
			768: {
				0: {
					style: {
						dimensions: {
							width: "50%",
						}
					}
				}
			},
			1280: {
				0: {
					style: {
						dimensions: {
							height: "100%",
						}
					}
				}
			}
		};

		const checkChanges = {
			768: {
				0: {
					style: {
						spacing: {
							margin: "20px",
							padding: "10px",
						}
					}
				}
			},
			1280: {
				0: {
					style: {
						dimensions: {
							height: "auto",
							width: "100%",
						}
					}
				}
			}
		}

		updateBlockDifferences(
			1280,
			true,
			blockChanges,
			blockRemoves,
			blockSaves,
			'dimensions',
			{
				width: "100%",
				height: "auto"
			},
			collapseViewportSetProperty( blockChanges, 1280, 'dimensions' ),
			null,
			collapseViewportSetProperty( blockSaves, 1280, 'dimensions' )
		);

		expect( blockChanges ).toStrictEqual( checkChanges );
		expect( blockRemoves ).toStrictEqual( {} );
	} );


	test.only( 'Handles partial dimension removal with complex saves and changes – manual override (isEditing)', () => {
		const blockChanges = {
			768: {
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
			1280: {
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
		};
		const blockRemoves = {};
		const blockSaves = {
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
			768: {
				0: {
					style: {
						spacing: {
							margin: "20px",
						}
					}
				}
			},
			1280: {
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
		};

		const checkChanges = {
			768: {
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
			1280: {
				0: {
					style: {
						dimensions: {
							width: "100%",
						},
						spacing: {
							margin: "40px",
							padding: "20px",
						},
					}
				}
			}
		}

		const checkRemoves = {
			1280: {
				0: {
					style: {
						dimensions: {
							height: "100%"
						}
					}
				}
			}
		}

		updateBlockDifferences(
			1280,
			true,
			blockChanges,
			blockRemoves,
			blockSaves,
			'dimensions',
			{
				width: "100%",
				minHeight: "200px",
			},
			collapseViewportSetProperty( blockChanges, 1280, 'dimensions' ),
			null,
			collapseViewportSetProperty( blockSaves, 1280, 'dimensions' )
		);

		expect( blockChanges ).toStrictEqual( checkChanges );
		expect( blockRemoves ).toStrictEqual( checkRemoves );
	} );


	test.only( 'Handles partial dimension removal with complex saves, changes and removes – manual override (isEditing)', () => {
		const blockChanges = {
			768: {
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
		};

		const blockRemoves = {
			1280: {
				0: {
					style: {
						border: {
							top: "1px solid #000",
						}
					}
				}
			},
		};

		const blockSaves = {
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
			768: {
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
			1280: {
				0: {
					style: {
						border: {
							top: "1px solid #000",
						},
					}
				}
			},
		};

		const checkChanges = {
			768: {
				0: {
					style: {
						spacing: {
							margin: "20px",
							padding: "10px",
						}
					}
				}
			},
			1280: {
				0: {
					style: {
						dimensions: {
							width: "100%"
						}
					}
				}
			}
		}

		const checkRemoves = {
			768: {
				0: {
					style: {
						dimensions: {
							height: "auto"
						}
					}
				}
			},
			1280: {
				0: {
					style: {
						border: {
							top: "1px solid #000",
						}
					}
				}
			}
		}

		updateBlockDifferences(
			1280,
			true,
			blockChanges,
			blockRemoves,
			blockSaves,
			'dimensions',
			{
				width: "100%",
			},
			collapseViewportSetProperty( blockChanges, 1280, 'dimensions' ),
			collapseViewportSetProperty( blockRemoves, 1280, 'dimensions' ),
			collapseViewportSetProperty( blockSaves, 1280, 'dimensions' )
		);

		expect( blockChanges ).toStrictEqual( checkChanges );
		expect( blockRemoves ).toStrictEqual( checkRemoves );
	} );
} );
