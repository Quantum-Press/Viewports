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

import { restoreBlockSaves } from '../restoreBlockSaves';

test( 'can restoreBlockSaves() with viewport and restore all styles by viewport', () => {
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
				0: {
					0: {
						style: {},
					},
				},
				768: {
					0: {
						style: {
							dimensions: {
								padding: {
									top: "20px",
									bottom: "20px",
								}
							}
						}
					}
				},
				1280: {
					0: {
						style: {
							dimensions: {
								padding: {
									top: "40px",
									bottom: "40px",
								}
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
								padding: {
									top: "60px",
									bottom: "60px",
								}
							}
						}
					}
				},
				1280: {
					0: {
						style: {
							dimensions: {
								padding: {
									top: "80px",
									bottom: "80px",
								}
							}
						}
					}
				}
			}
		}
	} as State;

	const action = {
		type: 'RESTORE_BLOCK_SAVES',
		clientId: 'client-id',
		viewport: 1280,
		props: [],
	} as Action;

	const check = {
		... state,
		changes: {
			'client-id': {
				768: {
					0: {
						style: {
							dimensions: {
								padding: {
									top: "60px",
									bottom: "60px",
								}
							}
						}
					}
				},
			}
		},
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
								padding: {
									top: "60px",
									bottom: "60px",
								}
							}
						}
					}
				},
				1280: {
					0: {
						style: {
							dimensions: {
								padding: {
									top: "40px",
									bottom: "40px",
								}
							}
						}
					}
				}
			}
		}
	} as State;
	const result = restoreBlockSaves( state, action );

	// Ignore css, inlineStyle and spectrum sets to debug in generator.test.ts
	result.cssSet = check.cssSet;
	result.inlineStyleSets = check.inlineStyleSets;
	result.spectrumSets = check.spectrumSets;

	// Ignore lastEdit cause it is a timestamp.
	result.lastEdit = check.lastEdit;

	expect( result ).toEqual( check );
} );

/*
test( 'can restoreBlockSaves() with viewport and restore a style property by viewport', () => {
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
								padding: {
									top: "20px",
									bottom: "20px",
								}
							}
						}
					}
				},
				1280: {
					0: {
						style: {
							dimensions: {
								padding: {
									top: "40px",
									bottom: "40px",
								}
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
								padding: {
									top: "60px",
									bottom: "60px",
								}
							}
						}
					}
				},
				1280: {
					0: {
						style: {
							dimensions: {
								padding: {
									top: "80px",
									bottom: "80px",
								}
							}
						}
					}
				}
			}
		}
	} as State;
	const action = {
		type: 'RESTORE_BLOCK_SAVES',
		clientId: 'client-id',
		viewport: 1280,
		props: [ 0, 'style', 'dimensions' ],
	} as Action;

	const check = {
		... state,
		changes: {
			'client-id': {
				768: {
					0: {
						style: {
							dimensions: {
								padding: {
									top: "60px",
									bottom: "60px",
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
						style: {},
					}
				},
				768: {
					0: {
						style: {
							dimensions: {
								padding: {
									top: "60px",
									bottom: "60px",
								}
							}
						}
					}
				},
				1280: {
					0: {
						style: {
							dimensions: {
								padding: {
									top: "40px",
									bottom: "40px",
								}
							}
						}
					}
				}
			}
		}
	} as State;
	const result = restoreBlockSaves( state, action );

	// Ignore css, inlineStyle and spectrum sets to debug in generator.test.ts
	result.cssSet = check.cssSet;
	result.inlineStyleSets = check.inlineStyleSets;
	result.spectrumSets = check.spectrumSets;

	// Ignore lastEdit cause it is a timestamp.
	result.lastEdit = check.lastEdit;

	expect( result ).toEqual( check );
} );
/**/