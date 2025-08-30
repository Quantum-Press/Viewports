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
import {
	findViewportSetOccurence,
} from '..';


test( 'can findViewportSetOccurence() without viewports', () => {
	const viewportSet = {}

	const check = {
		0: {
			0: {
				path: [ 0, 0, 'style', 'dimensions' ],
				value: null,
			}
		}
	}

	const result = findViewportSetOccurence(
		1280,
		viewportSet,
		'dimensions',
		{}
	);

	expect( result ).toStrictEqual( check );
} );


test( 'can findViewportSetOccurence() with a single viewport on 0', () => {
	const viewportSet = {
		0: {
			0: {
				style: {
					dimensions: {
						width: '100%',
						height: 'auto'
					}
				}
			}
		}
	}

	const check = {
		0: {
			0: {
				path: [ 0, 0, 'style', 'dimensions' ],
				value: {
					width: '100%',
					height: 'auto'
				},
			}
		}
	}

	const result = findViewportSetOccurence(
		1280,
		viewportSet,
		'dimensions',
		{
			width: '100%',
			height: 'auto'
		}
	);

	expect( result ).toStrictEqual( check );
} );


test( 'can findViewportSetOccurence() with a single viewport on 0, getting string value', () => {
	const viewportSet = {
		0: {
			0: {
				style: {
					width: '100%',
				},
			},
		},
	}

	const check = {
		0: {
			0: {
				path: [ 0, 0, 'style', 'width' ],
				value: '100%',
			}
		}
	}

	const result = findViewportSetOccurence(
		1280,
		viewportSet,
		'width',
		'100%'
	);

	expect( result ).toStrictEqual( check );
} );


test( 'can findViewportSetOccurence() with two viewports on 0, getting maxWidth', () => {
	const viewportSet = {
		0: {
			0: {
				style: {
					dimensions: {
						width: '100%',
					}
				}
			},
			767: {
				style: {
					dimensions: {
						height: 'auto',
					}
				}
			}
		}
	}

	const check = {
		0: {
			0: {
				path: [ 0, 0, 'style', 'dimensions' ],
				value: {
					width: '100%',
				},
			},
			767: {
				path: [ 0, 767, 'style', 'dimensions' ],
				value: {
					height: 'auto'
				},
			}
		}
	}

	const result = findViewportSetOccurence(
		1280,
		viewportSet,
		'dimensions',
		{
			width: '100%',
			height: 'auto'
		}
	);

	expect( result ).toStrictEqual( check );
} );


test( 'can findViewportSetOccurence() with multi spreaded viewports', () => {
	const viewportSet = {
		0: {
			0: {
				style: {
					dimensions: {
						width: '100%',
					}
				}
			},
			767: {
				style: {
					dimensions: {
						height: 'auto',
					}
				}
			}
		},
		768: {
			0: {
				style: {
					dimensions: {
						height: '100%',
					}
				}
			},
		}
	}

	const check = {
		0: {
			767: {
				path: [ 0, 767, 'style', 'dimensions' ],
				value: {
					height: 'auto'
				},
			}
		}
	}

	const result = findViewportSetOccurence(
		1280,
		viewportSet,
		'dimensions',
		{
			height: 'auto'
		}
	);

	expect( result ).toStrictEqual( check );
} );


test( 'can findViewportSetOccurence() with multi spreaded viewports, getting maxWidth', () => {
	const viewportSet = {
		0: {
			0: {
				style: {
					dimensions: {
						width: '100%',
						height: 'auto',
					}
				}
			},
		},
		768: {
			1279: {
				style: {
					dimensions: {
						height: '100%',
					}
				}
			},
		},
	}

	const check = {
		768: {
			1279: {
				path: [ 768, 1279, 'style', 'dimensions' ],
				value: {
					height: '100%'
				},
			}
		}
	}

	const result = findViewportSetOccurence(
		1280,
		viewportSet,
		'dimensions',
		{
			height: '100%',
		}
	);

	expect( result ).toStrictEqual( check );
} );


test( 'can findViewportSetOccurence() with multi spreaded viewports, getting height in the middle', () => {
	const viewportSet = {
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
	}

	const check = {
		768: {
			0: {
				path: [ 768, 0, 'style', 'dimensions' ],
				value: {
					height: 'auto'
				},
			}
		}
	}

	const result = findViewportSetOccurence(
		1280,
		viewportSet,
		'dimensions',
		{
			height: 'auto',
		}
	);

	expect( result ).toStrictEqual( check );
} );