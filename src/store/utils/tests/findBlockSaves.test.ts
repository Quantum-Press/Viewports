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

import { findBlockSaves } from "../";

test( 'can findBlockSaves() with empty attributes', () => {
	const result = findBlockSaves( {} );
	const check = {
		0: {
			0: {
				style: {}
			}
		}
	}

	expect( result ).toStrictEqual( check );
} );

test( 'can findBlockSaves() with filled attributes but without leading 0 viewport', () => {
	const saves = {
		320: {
			0: {
				style: {
					dimensions: {
						padding: {
							top: '20px',
							bottom: '20px',
						},
						margin: {
							left: '20px',
							right: '20px',
						},
					},
					test: {
						foo: 'empty',
						bar: {
							filled: true,
							empty: false,
							value: '20px',
						}
					}
				},
			},
		},
		1024: {
			0: {
				style: {
					dimensions: {
						padding: '40px',
						margin: '40px',
					},
					margin: {
						left: '60px',
						right: '60px',
					}
				},
			},
		},
	};

	const attributes = {
		content: 'Text',
		viewports: saves,
	}

	const result = findBlockSaves( attributes );

	const check = {
		0: {
			0: {
				style: {}
			}
		},
		320: {
			0: {
				style: {
					dimensions: {
						padding: {
							top: '20px',
							bottom: '20px',
						},
						margin: {
							left: '20px',
							right: '20px',
						},
					},
					test: {
						foo: 'empty',
						bar: {
							filled: true,
							empty: false,
							value: '20px',
						}
					}
				},
			}
		},
		1024: {
			0: {
				style: {
					dimensions: {
						padding: '40px',
						margin: '40px',
					},
					margin: {
						left: '60px',
						right: '60px',
					}
				},
			},
		},
	};

	expect( result ).toStrictEqual( check );
} );

test( 'can findBlockSaves() without and with maxWidth attributes', () => {
	const saves = {
		0: {
			0: {
				style: {},
			}
		},
		320: {
			0: {
				style: {
					dimensions: {
						padding: {
							top: '20px',
							bottom: '20px',
						},
						margin: {
							left: '20px',
							right: '20px',
						},
					},
				},
			},
			767: {
				test: {
					foo: 'empty',
					bar: {
						filled: true,
						empty: false,
						value: '20px',
					}
				}
			}
		},
		1024: {
			1919: {
				style: {
					dimensions: {
						padding: {
							top: '20px',
							bottom: '20px',
						},
					},
				},
			}
		},
	};
	const attributes = {
		content: 'Text',
		viewports: saves,
	}

	const result = findBlockSaves( attributes );

	expect( result ).toStrictEqual( saves );
} );


test( 'can findBlockSaves() with old attribute structure', () => {
	const saves = {
		0: {
			0: {
				style: {},
			}
		},
		320: {
			0: {
				style: {
					dimensions: {
						padding: {
							top: '20px',
							bottom: '20px',
						},
						margin: {
							left: '20px',
							right: '20px',
						},
					},
				},
			},
		},
		1024: {
			0: {
				style: {
					dimensions: {
						padding: {
							top: '20px',
							bottom: '20px',
						},
					},
				},
			}
		},
	};
	const attributes = {
		content: 'Text',
		viewports: {
			0: {
				style: {},
			},
			320: {
				style: {
					dimensions: {
						padding: {
							top: '20px',
							bottom: '20px',
						},
						margin: {
							left: '20px',
							right: '20px',
						},
					},
				},
			},
			1024: {
				style: {
					dimensions: {
						padding: {
							top: '20px',
							bottom: '20px',
						},
					},
				},
			},
		},
	}

	const result = findBlockSaves( attributes );

	expect( result ).toStrictEqual( saves );
} );