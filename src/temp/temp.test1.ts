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
	findEqualProperties,
	findUniqueProperties,
} from '../utils';
import {
	collapseViewportSetProperty
} from '../store/utils/collapseViewportSetProperty';













































/*
test( 'can findBlockDifferences() when removing a nested style property, restricting the viewport style before > with more changes', () => {
	const state = deepFreeze( {
		... DEFAULT_STATE,
		iframeViewport: 1280,
		valids: {
			'client-id': {
				0: {
					0: {
						spacing: {
							margin: "20px",
							padding: "10px",
						},
					},
					767: {
						style: {
							qpFlex: {
								active: true,
								alignment: 'stretch start',
								direction: 'column',
							}
						},
					}
				},
				375: {
					0: {
						spacing: {
							margin: "20px",
							padding: "10px",
						},
					},
					767: {
						style: {
							qpFlex: {
								active: true,
								alignment: 'stretch start',
								direction: 'column',
							}
						},
					}
				},
				768: {
					0: {
						style: {
							spacing: {
								margin: "20px",
								padding: "10px",
							},
							border: {
								top: "1px solid #000",
								left: "1px solid #000",
								right: "1px solid #000",
							},
							qpFlex: {
								active: true,
								alignment: 'space-between start',
							}
						}
					}
				},
				1280: {
					0: {
						style: {
							spacing: {
								margin: "20px",
								padding: "40px",
							},
							border: {
								top: "1px solid #000",
								left: "1px solid #000",
								right: "1px solid #000",
							},
							qpFlex: {
								active: true,
								alignment: 'space-between start',
							}
						}
					}
				},
				1920: {
					0: {
						style: {
							spacing: {
								margin: "20px",
								padding: "40px",
							},
							border: {
								top: "1px solid #000",
								left: "1px solid #000",
								right: "1px solid #000",
							},
							qpFlex: {
								active: true,
								alignment: 'space-between end',
								direction: 'row-reverse',
							}
						}
					}
				}
			}
		},
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
						},
					}
				},
				768: {
					0: {
						style: {
							qpFlex: {
								active: true,
								alignment: 'space-between start',
							},
							border: {
								top: "1px solid #000",
								left: "1px solid #000",
								right: "1px solid #000",
							},
						}
					}
				},
				1280: {
					0: {
						style: {
							spacing: {
								padding: "40px",
							},
							qpFlex: {
								active: true,
								alignment: 'space-between start',
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
							background: {
								color: '#fff',
							},
							qpFlex: {
								direction: 'row-reverse',
							}
						}
					}
				},
				1920: {
					0: {
						style: {
							spacing: {
								margin: "40px",
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
								margin: "20px",
								padding: "10px",
							},
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
							background: {
								color: '#fff',
							},
							qpFlex: {
								active: true,
								alignment: 'stretch start',
								direction: 'row-reverse',
							}
						}
					}
				},
				1920: {
					0: {
						style: {
							spacing: {
								margin: "40px",
							},
							qpFlex: {
								active: true,
								alignment: 'space-between end',
								direction: 'row-reverse',
							}
						}
					}
				}
			}
		},
	} );

	const attributes = {
		style: {
			spacing: {
				padding: "40px",
				margin: "20px",
			},
			dimensions: {
				width: "100%",
			},
			border: {
				bottom: "1px solid #000",
			},
			background: {
				color: '#000',
			},
			qpFlex: {
				active: true,
				alignment: 'space-between start',
				direction: 'row',
			}
		}
	};

	const check = {
		changes: {
			768: {
				0: {
					style: {
						background: {
							color: '#000',
						},
						border: {
							bottom: "1px solid #000",
						},
						qpFlex: {
							direction: 'row',
						},
					}
				}
			},
			1280: {
				0: {
					style: {
						spacing: {
							padding: "40px",
						},
						dimensions: {
							width: "100%",
						}
					}
				}
			},
		},
		removes: {
			1920: {
				0: {
					style: {
						spacing: {
							margin: "40px",
						},
					}
				}
			}
		},
	};

	const result = findBlockDifferences( 'client-id', attributes, state, state.iframeViewport );

	expect( result ).toStrictEqual( check );
} );
/**/
