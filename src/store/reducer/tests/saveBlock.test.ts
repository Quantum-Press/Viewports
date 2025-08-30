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
import {
	State,
	Action
} from '../../../types';

import { saveBlock } from '../saveBlock';


test( 'can saveBlock() with saves, changes and removes', () => {
	const state = {
		... DEFAULT_STATE,
		viewports: {
			0: 'Default',
			375: 'Mobile',
			768: 'Tablet',
			1280: 'Desktop',
		},
		saves: {
			'client-id': {
				768: {
					0: {
						style: {
							dimensions: {
								width: "100%",
							},
							spacing: {
								margin: {
									top: "20px",
									bottom: "20px",
								},
								padding: {
									left: "20px",
									right: "20px",
								},
							}
						}
					}
				},
				1280: {
					0: {
						style: {
							spacing: {
								margin: {
									top: "40px",
									bottom: "40px",
								},
								padding: "40px",
							}
						}
					}
				}
			}
		},
		changes: {
			'client-id': {
				768: {
					0: {
						style: {
							dimensions: {
								width: "50%",
							},
						}
					}
				},
				1280: {
					0: {
						style: {
							spacing: {
								padding: "20px",
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
							dimensions: {
								width: "100%",
							},
						}
					}
				}
			}
		}
	} as State;
	const action = {
		type: 'SAVE_BLOCK',
		clientId: 'client-id',
	} as Action;

	const check = {
		... state,
		saves: {
			'client-id': {
				768: {
					0: {
						style: {
							spacing: {
								margin: {
									top: "20px",
									bottom: "20px",
								},
								padding: {
									left: "20px",
									right: "20px",
								},
							}
						}
					}
				},
				1280: {
					0: {
						style: {
							spacing: {
								margin: {
									top: "40px",
									bottom: "40px",
								},
								padding: "20px",
							}
						}
					}
				}
			}
		},
		changes: {},
		removes: {},
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
							spacing: {
								margin: {
									top: "20px",
									bottom: "20px",
								},
								padding: {
									left: "20px",
									right: "20px",
								},
							}
						}
					}
				},
				1280: {
					0: {
						style: {
							spacing: {
								margin: {
									top: "40px",
									bottom: "40px",
								},
								padding: "20px",
							}
						}
					}
				}
			}
		},
	} as State;
	const result = saveBlock( state, action );

	// Ignore css, inlineStyle and spectrum sets to debug in generator.test.ts
	result.cssSet = check.cssSet;
	result.inlineStyleSets = check.inlineStyleSets;
	result.spectrumSets = check.spectrumSets;

	expect( result ).toEqual( check );
} );