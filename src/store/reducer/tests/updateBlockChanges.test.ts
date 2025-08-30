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
import { DEFAULT_STATE } from '../../';

// Deconstruct functions to test.
import {
	updateBlockChanges,
} from '../updateBlockChanges';
import {
	State,
	Action
} from '../../../types';


test( 'can updateBlockChanges() with saves, changes and single added attribute', () => {
	const state = {
		... DEFAULT_STATE,
		iframeViewport: 1280,
		viewports: {
			0: 'Default',
			375: 'Mobile',
			768: 'Tablet',
			1280: 'Desktop',
		},
		valids: {
			'client-id': {
				375: {
					0: {
						style: {
							dimensions: {
								padding: {
									top: '10px',
									bottom: '10px',
								},
							}
						}
					}
				},
				768: {
					0: {
						style: {
							dimensions: {
								padding: {
									top: '20px',
									bottom: '20px',
								},
							}
						}
					}
				},
				1280: {
					0: {
						style: {
							dimensions: {
								padding: {
									top: '40px',
									bottom: '40px',
								},
							}
						}
					}
				}
			}
		},
		changes: {
			'client-id': {
				1280: {
					0: {
						style: {
							dimensions: {
								padding: {
									top: '40px',
									bottom: '40px',
								},
							}
						}
					}
				}
			}
		},
		saves: {
			'client-id': {
				375: {
					0: {
						style: {
							dimensions: {
								padding: {
									top: '10px',
									bottom: '10px',
								},
							}
						}
					}
				},
				768: {
					0: {
						style: {
							dimensions: {
								padding: {
									top: '20px',
									bottom: '20px',
								},
							}
						}
					}
				},
				1280: {
					0: {
						style: {
							dimensions: {
								padding: {
									top: '30px',
									bottom: '30px',
								},
							}
						}
					}
				}
			}
		},
	} as State;

	const action = {
		type: 'UPDATE_BLOCK_CHANGES',
		clientId: 'client-id',
		attributes: {
			content: 'Text',
			style: {
				dimensions: {
					padding: {
						top: '40px',
						bottom: '40px',
					},
					margin: {
						bottom: "80px",
					},
				}
			}
		}
	} as Action;

	const check = {
		... state,
		changes: {
			'client-id': {
				1280: {
					0: {
						style: {
							dimensions: {
								padding: {
									top: '40px',
									bottom: '40px',
								},
								margin: {
									bottom: "80px",
								}
							}
						}
					}
				}
			}
		},
		valids: {
			'client-id': {
				0: {
					0: {
						style: {},
					}
				},
				375: {
					0: {
						style: {
							dimensions: {
								padding: {
									top: '10px',
									bottom: '10px',
								},
							}
						}
					}
				},
				768: {
					0: {
						style: {
							dimensions: {
								padding: {
									top: '20px',
									bottom: '20px',
								},
							}
						}
					}
				},
				1280: {
					0: {
						style: {
							dimensions: {
								padding: {
									top: '40px',
									bottom: '40px',
								},
								margin: {
									bottom: "80px",
								}
							}
						}
					}
				}
			}
		}
	} as State;
	const result = updateBlockChanges( state, action );

	// Ignore css, inlineStyle and spectrum sets to debug in generator.test.ts
	result.cssSet = check.cssSet;
	result.inlineStyleSets = check.inlineStyleSets;
	result.spectrumSets = check.spectrumSets;

	expect( result ).toEqual( check );
} );

test( 'can updateBlockChanges() with saves, changes and multi changed attributes', () => {
	const state = {
		... DEFAULT_STATE,
		iframeViewport: 1280,
		viewports: {
			0: 'Default',
			375: 'Mobile',
			768: 'Tablet',
			1280: 'Desktop',
		},
		valids: {
			'client-id': {
				375: {
					0: {
						style: {
							dimensions: {
								padding: {
									top: '10px',
									bottom: '10px',
								},
							}
						}
					}
				},
				768: {
					0: {
						style: {
							dimensions: {
								padding: {
									top: '20px',
									bottom: '20px',
								},
							}
						}
					}
				},
				1280: {
					0: {
						style: {
							dimensions: {
								padding: {
									top: '40px',
									bottom: '40px',
								},
							}
						}
					}
				}
			}
		},
		changes: {
			'client-id': {
				1280: {
					0: {
						style: {
							dimensions: {
								padding: {
									top: '40px',
									bottom: '40px',
								},
							}
						}
					}
				}
			}
		},
		saves: {
			'client-id': {
				375: {
					0: {
						style: {
							dimensions: {
								padding: {
									top: '10px',
									bottom: '10px',
								},
							}
						}
					}
				},
				768: {
					0: {
						style: {
							dimensions: {
								padding: {
									top: '20px',
									bottom: '20px',
								},
							}
						}
					}
				},
				1280: {
					0: {
						style: {
							dimensions: {
								padding: {
									top: '30px',
									bottom: '30px',
								},
							}
						}
					}
				}
			}
		},
	} as State;

	const action = {
		type: 'UPDATE_BLOCK_CHANGES',
		clientId: 'client-id',
		attributes: {
			content: 'Text',
			style: {
				dimensions: {
					padding: "80px",
				}
			}
		}
	} as Action;

	const check = {
		... state,
		changes: {
			'client-id': {
				1280: {
					0: {
						style: {
							dimensions: {
								padding: "80px",
							}
						}
					}
				}
			}
		},
		valids: {
			'client-id': {
				0: {
					0: {
						style: {},
					}
				},
				375: {
					0: {
						style: {
							dimensions: {
								padding: {
									top: '10px',
									bottom: '10px',
								},
							}
						}
					}
				},
				768: {
					0: {
						style: {
							dimensions: {
								padding: {
									top: '20px',
									bottom: '20px',
								},
							}
						}
					}
				},
				1280: {
					0: {
						style: {
							dimensions: {
								padding: "80px",
							}
						}
					}
				}
			}
		}
	} as State;
	const result = updateBlockChanges( state, action );

	// Ignore css, inlineStyle and spectrum sets to debug in generator.test.ts
	result.cssSet = check.cssSet;
	result.inlineStyleSets = check.inlineStyleSets;
	result.spectrumSets = check.spectrumSets;

	expect( result ).toEqual( check );
} );

test( 'can updateBlockChanges() with saves, changes and multi changed attributes including arrays', () => {
	const state = {
		... DEFAULT_STATE,
		iframeViewport: 1280,
		viewports: {
			0: 'Default',
			375: 'Mobile',
			768: 'Tablet',
			1280: 'Desktop',
		},
		valids: {
			'client-id': {
				0: {
					0: {
						style: {},
					}
				},
				375: {
					0: {
						style: {
							dimensions: {
								padding: {
									top: '10px',
									bottom: '10px',
								},
							}
						}
					}
				},
				768: {
					0: {
						style: {
							dimensions: {
								padding: {
									top: '20px',
									bottom: '20px',
								},
							}
						}
					}
				},
				1280: {
					0: {
						style: {
							dimensions: {
								padding: {
									top: '40px',
									bottom: '40px',
								},
							},
							layers: [
								{
									foo: 'bar'
								}
							]
						}
					}
				}
			}
		},
		changes: {
			'client-id': {
				1280: {
					0: {
						style: {
							dimensions: {
								padding: {
									top: '40px',
									bottom: '40px',
								},
							},
							layers: [
								{
									foo: 'bar'
								}
							]
						}
					}
				}
			}
		},
		saves: {
			'client-id': {
				375: {
					0: {
						style: {
							dimensions: {
								padding: {
									top: '10px',
									bottom: '10px',
								},
							}
						}
					}
				},
				768: {
					0: {
						style: {
							dimensions: {
								padding: {
									top: '20px',
									bottom: '20px',
								},
							}
						}
					}
				},
				1280: {
					0: {
						style: {
							dimensions: {
								padding: {
									top: '30px',
									bottom: '30px',
								},
							}
						}
					}
				}
			}
		},
	} as State;
	const action = {
		type: 'UPDATE_BLOCK_CHANGES',
		clientId: 'client-id',
		attributes: {
			content: 'Text',
			style: {
				dimensions: {
					padding: "80px",
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
	} as Action;

	const check = {
		... state,
		changes: {
			'client-id': {
				1280: {
					0: {
						style: {
							dimensions: {
								padding: "80px",
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
				}
			}
		},
		valids: {
			'client-id': {
				0: {
					0: {
						style: {},
					}
				},
				375: {
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
				768: {
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
				},
				1280: {
					0: {
						style: {
							dimensions: {
								padding: "80px",
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
				},
			}
		}
	} as State;
	const result = updateBlockChanges( state, action );

	// Ignore css, inlineStyle and spectrum sets to debug in generator.test.ts
	result.cssSet = check.cssSet;
	result.inlineStyleSets = check.inlineStyleSets;
	result.spectrumSets = check.spectrumSets;

	expect( result ).toEqual( check );
} );


test( 'can updateBlockChanges() by removing an entire property from style object, resulting in restricting the lower viewport', () => {
	const state = {
		... DEFAULT_STATE,
		iframeViewport: 1280,
		viewports: {
			0: 'Default',
			375: 'Mobile',
			768: 'Tablet',
			1280: 'Desktop',
		},
		valids: {
			'client-id': {
				0: {
					0: {
						style: {
							qpFlex: {
								active: true,
								alignment: 'stretch start',
								direction: 'column',
							}
						}
					}
				},
				375: {
					0: {
						style: {
							qpFlex: {
								active: true,
								alignment: 'stretch start',
								direction: 'column',
							}
						}
					}
				},
				768: {
					0: {
						style: {
							qpFlex: {
								active: true,
								alignment: 'space-between start',
								direction: 'row-reverse',
							}
						}
					}
				},
				1280: {
					0: {
						style: {
							qpFlex: {
								active: true,
								alignment: 'space-between start',
								direction: 'row-reverse',
							}
						}
					}
				}
			}
		},
		changes: {},
		saves: {
			'client-id': {
				0: {
					0: {
						style: {
							qpFlex: {
								active: true,
								alignment: 'stretch start',
								direction: 'column',
							}
						}
					}
				},
				768: {
					0: {
						style: {
							qpFlex: {
								active: true,
								alignment: 'space-between start',
								direction: 'row-reverse',
							}
						}
					}
				},
			}
		},
	} as State;

	const action = {
		type: 'UPDATE_BLOCK_CHANGES',
		clientId: 'client-id',
		attributes: {
			content: 'Text',
			style: {
				qpFlex: {
					active: true,
					direction: 'row-reverse',
				}
			}
		}
	} as Action;

	const check = {
		... state,
		changes: {
			'client-id': {
				0: {
					767: {
						style: {
							qpFlex: {
								active: true,
								alignment: 'stretch start',
								direction: 'column',
							}
						}
					}
				},
				768: {
					0: {
						style: {
							qpFlex: {
								active: true,
								direction: 'row-reverse',
							}
						}
					}
				}
			}
		},
		removes: {
			'client-id': {
				768: {
					0: {
						style: {
							qpFlex: {
								alignment: 'space-between start',
							}
						}
					}
				}
			}
		},
		valids: {
			'client-id': {
				0: {
					0: {
						style: {
							qpFlex: {
								active: true,
								alignment: 'stretch start',
								direction: 'column',
							}
						}
					},
					767: {
						style: {
							qpFlex: {
								active: true,
								alignment: 'stretch start',
								direction: 'column',
							}
						}
					}
				},
				375: {
					0: {
						style: {
							qpFlex: {
								active: true,
								alignment: 'stretch start',
								direction: 'column',
							}
						}
					},
					767: {
						style: {
							qpFlex: {
								active: true,
								alignment: 'stretch start',
								direction: 'column',
							}
						}
					}
				},
				768: {
					0: {
						style: {
							qpFlex: {
								active: true,
								direction: 'row-reverse',
							}
						}
					}
				},
				1280: {
					0: {
						style: {
							qpFlex: {
								active: true,
								direction: 'row-reverse',
							}
						}
					}
				}
			}
		}
	} as State;
	const result = updateBlockChanges( state, action );

	// Ignore css, inlineStyle and spectrum sets to debug in generator.test.ts
	result.cssSet = check.cssSet;
	result.inlineStyleSets = check.inlineStyleSets;
	result.spectrumSets = check.spectrumSets;

	expect( result ).toEqual( check );
} );
/**/

test( 'can updateBlockChanges() by changing a single value between others', () => {
	const state = {
		... DEFAULT_STATE,
		iframeViewport: 1024,
		viewports: {
			0: 'Default',
			375: 'Mobile',
			768: 'Tablet',
			1024: 'Tablet large',
			1280: 'Desktop',
		},
		valids: {
			'client-id': {
				0: {
					0: {
						style: {
							spacing: {
								padding: '20px',
							},
							qpFlex: {
								active: true,
								direction: 'column',
								alignment: 'stretch start',
							}
						}
					}
				},
				375: {
					0: {
						style: {
							spacing: {
								padding: '20px',
							},
							qpFlex: {
								active: true,
								direction: 'column',
								alignment: 'stretch start',
							}
						}
					}
				},
				768: {
					0: {
						style: {
							spacing: {
								padding: '20px',
							},
							qpFlex: {
								active: true,
								direction: 'column',
								alignment: 'stretch start',
							}
						}
					}
				},
				1024: {
					0: {
						style: {
							spacing: {
								padding: '20px',
							},
							qpFlex: {
								active: true,
								direction: 'column',
								alignment: 'stretch start',
							}
						}
					}
				},
				1280: {
					0: {
						style: {
							spacing: {
								padding: '80px',
							},
							qpFlex: {
								active: true,
								direction: 'column',
								alignment: 'stretch start',
							}
						}
					}
				}
			}
		},
		changes: {},
		saves: {
			'client-id': {
				0: {
					0: {
						style: {
							spacing: {
								padding: '20px',
							},
							qpFlex: {
								active: true,
								direction: 'column',
								alignment: 'stretch start',
							}
						}
					}
				},
				1280: {
					0: {
						style: {
							spacing: {
								padding: '80px',
							}
						}
					}
				},
			}
		},
	} as State;

	const action = {
		type: 'UPDATE_BLOCK_CHANGES',
		clientId: 'client-id',
		attributes: {
			content: 'Text',
			style: {
				spacing: {
					padding: '60px',
				},
				qpFlex: {
					active: true,
					direction: 'column',
					alignment: 'stretch start',
				}
			}
		}
	} as Action;

	const check = {
		... state,
		changes: {
			'client-id': {
				0: {
					0: {
						style: {
							spacing: {
								padding: '60px',
							},
						}
					}
				},
			}
		},
		valids: {
			'client-id': {
				0: {
					0: {
						style: {
							spacing: {
								padding: '60px',
							},
							qpFlex: {
								active: true,
								direction: 'column',
								alignment: 'stretch start',
							}
						}
					}
				},
				375: {
					0: {
						style: {
							spacing: {
								padding: '60px',
							},
							qpFlex: {
								active: true,
								direction: 'column',
								alignment: 'stretch start',
							}
						}
					}
				},
				768: {
					0: {
						style: {
							spacing: {
								padding: '60px',
							},
							qpFlex: {
								active: true,
								direction: 'column',
								alignment: 'stretch start',
							}
						}
					}
				},
				1024: {
					0: {
						style: {
							spacing: {
								padding: '60px',
							},
							qpFlex: {
								active: true,
								direction: 'column',
								alignment: 'stretch start',
							}
						}
					}
				},
				1280: {
					0: {
						style: {
							spacing: {
								padding: '80px',
							},
							qpFlex: {
								active: true,
								direction: 'column',
								alignment: 'stretch start',
							}
						}
					}
				}
			}
		}
	} as State;
	const result = updateBlockChanges( state, action );

	// Ignore css, inlineStyle and spectrum sets to debug in generator.test.ts
	result.cssSet = check.cssSet;
	result.inlineStyleSets = check.inlineStyleSets;
	result.spectrumSets = check.spectrumSets;

	expect( result ).toEqual( check );
} );
