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
import { DEFAULT_STATE } from '../..';
import {
	State,
	Action
} from '../../../types';

import { registerBlockInit } from '../registerBlockInit';


test( 'can registerBlockInit() without clientId and without attributes', () => {
	const state = {
		... DEFAULT_STATE,
		viewports: {
			0: 'Default',
			375: 'Mobile',
			768: 'Tablet',
			1280: 'Desktop',
		},
		saves: {},
		valids: {},
	} as State;
	const action = {
		type: 'REGISTER_BLOCK_INIT',
		clientId: '',
		attributes: {},
	} as Action;

	const check = {
		... state,
		saves: {},
		valids: {}
	} as State;
	const result = registerBlockInit( state, action );

	// Ignore css, inlineStyle and spectrum sets to debug in generator.test.ts
	result.cssSet = check.cssSet;
	result.inlineStyleSets = check.inlineStyleSets;
	result.spectrumSets = check.spectrumSets;

	expect( result ).toEqual( check );
} );

test( 'can registerBlockInit() with clientId and without attributes', () => {
	const state = {
		... DEFAULT_STATE,
		viewports: {
			0: 'Default',
			375: 'Mobile',
			768: 'Tablet',
			1280: 'Desktop',
		},
		saves: {},
		valids: {},
	} as State;
	const action = {
		type: 'REGISTER_BLOCK_INIT',
		clientId: 'client-id',
		attributes: {},
	} as Action;

	const check = {
		... state,
		saves: {
			'client-id': {
				0: {
					0: {
						style: {}
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
						style: {},
					}
				},
				768: {
					0: {
						style: {},
					}
				},
				1280: {
					0: {
						style: {},
					}
				},
			}
		}
	} as State;
	const result = registerBlockInit( state, action );

	// Ignore css, inlineStyle and spectrum sets to debug in generator.test.ts
	result.cssSet = check.cssSet;
	result.inlineStyleSets = check.inlineStyleSets;
	result.spectrumSets = check.spectrumSets;

	expect( result ).toEqual( check );
} );

test( 'can registerBlockInit() with clientId and with attributes', () => {
	const state = {
		... DEFAULT_STATE,
		viewports: {
			0: 'Default',
			375: 'Mobile',
			768: 'Tablet',
			1280: 'Desktop',
		},
		saves: {},
		valids: {},
	} as State;
	const action = {
		type: 'REGISTER_BLOCK_INIT',
		clientId: 'client-id',
		attributes: {
			style: {
				dimensions: {
					padding: 0,
					margin: 0,
				}
			}
		},
	} as Action;

	const check = {
		... state,
		saves: {
			'client-id': {
				0: {
					0: {
						style: {
							dimensions: {
								padding: 0,
								margin: 0,
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
							dimensions: {
								padding: 0,
								margin: 0,
							}
						}
					}
				},
				375: {
					0: {
						style: {
							dimensions: {
								padding: 0,
								margin: 0,
							}
						}
					}
				},
				768: {
					0: {
						style: {
							dimensions: {
								padding: 0,
								margin: 0,
							}
						}
					}
				},
				1280: {
					0: {
						style: {
							dimensions: {
								padding: 0,
								margin: 0,
							}
						}
					}
				},
			}
		}
	} as State;
	const result = registerBlockInit( state, action );

	// Ignore css, inlineStyle and spectrum sets to debug in generator.test.ts
	result.cssSet = check.cssSet;
	result.inlineStyleSets = check.inlineStyleSets;
	result.spectrumSets = check.spectrumSets;

	expect( result ).toEqual( check );
} );