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
import { DEFAULT_STATE } from '../../default';
import {
	findBlockValids,
} from '..';


test( 'can findBlockValids() with some attributes', () => {
	const state = deepFreeze( {
		... DEFAULT_STATE,
		viewports: {
			0: 'Default',
			768: 'Tablet',
			1280: 'Desktop',
		},
		saves: {
			'client-id': {
				0: {
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
					}
				},
				768: {
					0: {
						style: {
							width: '50%',
							height: 'auto',
							dimensions: {
								margin: {
									top: '40px',
									bottom: '40px',
								},
							},
						},
					},
				},
			},
		},
		changes: {
			'client-id': {
				768: {
					0: {
						style: {
							width: '33.33%',
						}
					},
				},
				1280: {
					0: {
						style: {
							width: '20%',
						},
					},
				},
			},
		},
	} );

	const check = {
		0: {
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
			}
		},
		768: {
			0: {
				style: {
					width: '33.33%',
					height: 'auto',
					dimensions: {
						padding: {
							left: '20px',
							right: '20px',
						},
						margin: {
							top: '40px',
							bottom: '40px',
						},
					},
				},
			},
		},
		1280: {
			0: {
				style: {
					width: '20%',
					height: 'auto',
					dimensions: {
						padding: {
							left: '20px',
							right: '20px',
						},
						margin: {
							top: '40px',
							bottom: '40px',
						},
					},
				},
			},
		},
	};
	const result = findBlockValids( 'client-id', state );

	expect( result ).toStrictEqual( check );
} );


test( 'can findBlockValids() with some attributes and a maxWidth "to" value', () => {
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
					767: {
						style: {
							width: '50%',
							qpFlex: {
								active: true,
								direction: 'column',
								alignment: 'stretch start',
							}
						},
					},
				},
				768: {
					0: {
						style: {
							qpFlex: {
								active: true,
								alignment: "space-between start",
							}
						}
					}
				},
			}
		},
		changes: {
			'client-id': {
				0: {
					767: {
						style: {
							width: '100%',
						}
					}
				},
				768: {
					0: {
						style: {
							width: '50%',
						},
					},
				},
			},
		},
	} );

	const check = {
		0: {
			0: {
				style: {},
			},
			767: {
				style: {
					width: '100%',
					qpFlex: {
						active: true,
						direction: 'column',
						alignment: 'stretch start',
					}
				},
			},
		},
		375: {
			0: {
				style: {},
			},
			767: {
				style: {
					width: '100%',
					qpFlex: {
						active: true,
						direction: 'column',
						alignment: 'stretch start',
					}
				},
			},
		},
		768: {
			0: {
				style: {
					width: '50%',
					qpFlex: {
						active: true,
						alignment: "space-between start",
					}
				}
			}
		},
		1280: {
			0: {
				style: {
					width: '50%',
					qpFlex: {
						active: true,
						alignment: "space-between start",
					}
				}
			}
		},
	};
	const result = findBlockValids( 'client-id', state );

	expect( result ).toStrictEqual( check );
} );