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
import { DEFAULT_STATE } from '../..';
import {
	State,
	Action
} from '../../../types';

import { removeBlockSaves } from '../removeBlockSaves';


test( 'can removeBlockSaves() without existing clientId', () => {
	const state = deepFreeze( {
		... DEFAULT_STATE,
		viewports: {
			0: 'Default',
			375: 'Mobile',
			768: 'Tablet',
			1280: 'Desktop',
		},
		saves: {
			'client-id': {
				0: {
					0: {
						style: {
							width: '100%',
						}
					}
				},
				768: {
					0: {
						style: {
							dimensions: {
								padding: "20px",
							},
						}
					}
				}
			}
		},
		changes: {},
		valids: {}
	} ) as State;

	const action = {
		type: 'REMOVE_BLOCK_SAVES',
		clientId: 'client-id',
		blockName: 'core/group',
		viewport: 0,
		props: [ '0', 'style', 'width' ],
	} as Action;

	const check = {
		... DEFAULT_STATE,
		saves: {
			'client-id': {
				0: {
					0: {
						style: {
							width: '100%',
						}
					}
				},
				768: {
					0: {
						style: {
							dimensions: {
								padding: "20px",
							},
						}
					}
				}
			}
		},
		removes: {
			'client-id': {
				0: {
					0: {
						style: {
							width: '100%',
						}
					}
				}
			}
		},
		changes: {},
		valids: {
			'client-id': {
				0: {
					0: {
						style: {}
					}
				},
				375: {
					0: {
						style: {}
					}
				},
				768: {
					0: {
						style: {
							dimensions: {
								padding: "20px",
							},
						}
					}
				},
				1280: {
					0: {
						style: {
							dimensions: {
								padding: "20px",
							},
						}
					}
				},
			},
		},
	} as State;

	const result = removeBlockSaves( state, action );

	// Ignore css, inlineStyle and spectrum sets to debug in generator.test.ts
	result.cssSet = check.cssSet;
	result.inlineStyleSets = check.inlineStyleSets;
	result.spectrumSets = check.spectrumSets;
	result.lastEdit = check.lastEdit;
	result.viewports = check.viewports;

	expect( result ).toStrictEqual( check );
} );


test( 'can removeBlockSaves() without existing clientId', () => {
	const state = deepFreeze( {
		... DEFAULT_STATE,
		viewports: {
			0: 'Default',
			375: 'Mobile',
			768: 'Tablet',
			1280: 'Desktop',
		},
		saves: {
			'client-id': {
				0: {
					0: {
						style: {
							width: '100%',
						}
					}
				},
				768: {
					0: {
						style: {
							dimensions: {
								padding: "20px",
							},
						}
					}
				}
			}
		},
		changes: {},
		valids: {}
	} ) as State;

	const action = {
		type: 'REMOVE_BLOCK_SAVES',
		clientId: 'client-id',
		blockName: 'core/group',
		viewport: 768,
		props: [ '0', 'style', 'dimensions' ],
	} as Action;

	const check = {
		... DEFAULT_STATE,
		saves: {
			'client-id': {
				0: {
					0: {
						style: {
							width: '100%',
						}
					}
				},
				768: {
					0: {
						style: {
							dimensions: {
								padding: "20px",
							},
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
							dimensions: {
								padding: "20px",
							},
						}
					}
				}
			}
		},
		changes: {},
		valids: {
			'client-id': {
				0: {
					0: {
						style: {
							width: '100%',
						}
					}
				},
				375: {
					0: {
						style: {
							width: '100%',
						}
					}
				},
				768: {
					0: {
						style: {
							width: '100%',
						}
					}
				},
				1280: {
					0: {
						style: {
							width: '100%',
						}
					}
				},
			},
		},
	} as State;

	const result = removeBlockSaves( state, action );

	// Ignore css, inlineStyle and spectrum sets to debug in generator.test.ts
	result.cssSet = check.cssSet;
	result.inlineStyleSets = check.inlineStyleSets;
	result.spectrumSets = check.spectrumSets;
	result.lastEdit = check.lastEdit;
	result.viewports = check.viewports;

	expect( result ).toStrictEqual( check );
} );