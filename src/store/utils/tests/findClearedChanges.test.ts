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
	findCleanedChanges,
} from '..';


test( 'can findCleanedChanges() with filled attributes to remove the whole tree', () => {
	const attributes = {
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
	};
	const removes = {
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
	}

	const result = findCleanedChanges( attributes, removes );

	expect( result ).toStrictEqual( {} );
} );

test( 'can findCleanedChanges() with filled attributes to remove a specific value', () => {
	const attributes = {
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
	};
	const removes = {
		0: {
			style: {
				dimensions: {
					padding: {
						top: '20px',
					}
				}
			}
		}
	}

	const check = {
		0: {
			style: {
				dimensions: {
					padding: {
						bottom: '20px',
					}
				}
			}
		}
	};
	const result = findCleanedChanges( attributes, removes );

	expect( result ).toStrictEqual( check );
} );