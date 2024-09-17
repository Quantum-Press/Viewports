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
import { DEFAULT_STATE } from '../default';
import {
	findBlockDifferences,
} from '../utils';


/**
 * Test scenario to test the behavior of adding properties as change.
 * - Based on viewport = 0
 *
 * @since 0.2.13
 */
/**/ /* /**/
describe( 'Testsuite - findBlockDifferences - Viewport = 0 - Adding property', () => {

    test( 'on empty states', () => {
        const state = deepFreeze( {
            ... DEFAULT_STATE,
            valids: {
                'client-id': {
                    0: {
                        style: {}
                    }
                }
            }
        } );

        const attributes = {
            style: {
                dimensions: {
                    padding: '80px',
                },
            },
        };

        const check = {
            changes: {
                'client-id': {
                    0: {
                        style: {
                            dimensions: {
                                padding: '80px',
                            },
                        },
                    },
                },
            },
            removes: {},
        };

        const result = findBlockDifferences( 'client-id', attributes, state, state.iframeViewport );

        expect( result ).toStrictEqual( check );
    } );

    test( 'on filled changes and empty saves', () => {
        const state = deepFreeze( {
            ... DEFAULT_STATE,
            valids: {
                'client-id': {
                    0: {
                        style: {
                            width: '100%',
                        },
                    },
                },
            },
            changes: {
                'client-id': {
                    0: {
                        style: {
                            width: '100%',
                        },
                    },
                },
            },
        } );

        const attributes = {
            style: {
                width: '100%',
                dimensions: {
                    padding: '80px',
                },
            },
        };

        const check = {
            changes: {
                'client-id': {
                    0: {
                        style: {
                            width: '100%',
                            dimensions: {
                                padding: '80px',
                            },
                        },
                    },
                },
            },
            removes: {},
        };

        const result = findBlockDifferences( 'client-id', attributes, state, state.iframeViewport );

        expect( result ).toStrictEqual( check );
    } );

    test( 'on filled changes and saves', () => {
        const state = deepFreeze( {
            ... DEFAULT_STATE,
            valids: {
                'client-id': {
                    0: {
                        style: {
                            width: '100%',
                            height: 'auto',
                        },
                    },
                },
            },
            changes: {
                'client-id': {
                    0: {
                        style: {
                            height: 'auto',
                        },
                    },
                },
            },
            saves: {
                'client-id': {
                    0: {
                        style: {
                            width: '100%',
                        },
                    },
                },
            },
        } );

        const attributes = {
            style: {
                width: '100%',
                height: 'auto',
                dimensions: {
                    padding: '80px',
                },
            },
        };

        const check = {
            changes: {
                'client-id': {
                    0: {
                        style: {
                            height: 'auto',
                            dimensions: {
                                padding: '80px',
                            },
                        },
                    },
                },
            },
            removes: {},
        };

        const result = findBlockDifferences( 'client-id', attributes, state, state.iframeViewport );

        expect( result ).toStrictEqual( check );
    } );

    test( 'on filled saves and empty changes', () => {
        const state = deepFreeze( {
            ... DEFAULT_STATE,
            valids: {
                'client-id': {
                    0: {
                        style: {
                            width: '100%',
                        },
                    },
                },
            },
            saves: {
                'client-id': {
                    0: {
                        style: {
                            width: '100%',
                        },
                    },
                },
            },
        } );

        const attributes = {
            style: {
                width: '100%',
                dimensions: {
                    padding: '80px',
                },
            },
        };

        const check = {
            changes: {
                'client-id': {
                    0: {
                        style: {
                            dimensions: {
                                padding: '80px',
                            },
                        },
                    },
                },
            },
            removes: {}
        };

        const result = findBlockDifferences( 'client-id', attributes, state, state.iframeViewport );

        expect( result ).toStrictEqual( check );
    } );

    test( 'on filled changes and empty saves while removing a property from changes', () => {
        const state = deepFreeze( {
            ... DEFAULT_STATE,
            valids: {
                'client-id': {
                    0: {
                        style: {
                            width: '100%',
                        },
                    },
                },
            },
            changes: {
                'client-id': {
                    0: {
                        style: {
                            width: '100%',
                        },
                    },
                },
            },
        } );

        const attributes = {
            style: {
                dimensions: {
                    padding: '80px',
                },
            },
        };

        const check = {
            changes: {
                'client-id': {
                    0: {
                        style: {
                            dimensions: {
                                padding: '80px',
                            },
                        },
                    },
                },
            },
            removes: {},
        };

        const result = findBlockDifferences( 'client-id', attributes, state, state.iframeViewport );

        expect( result ).toStrictEqual( check );
    } );

    test( 'on filled changes and saves while removing a property from changes', () => {
        const state = deepFreeze( {
            ... DEFAULT_STATE,
            valids: {
                'client-id': {
                    0: {
                        style: {
                            width: '100%',
                            height: 'auto',
                        },
                    },
                },
            },
            changes: {
                'client-id': {
                    0: {
                        style: {
                            width: '100%',
                        },
                    },
                },
            },
            saves: {
                'client-id': {
                    0: {
                        style: {
                            height: 'auto',
                        },
                    },
                },
            },
        } );

        const attributes = {
            style: {
                height: 'auto',
                dimensions: {
                    padding: '80px',
                },
            },
        };

        const check = {
            changes: {
                'client-id': {
                    0: {
                        style: {
                            dimensions: {
                                padding: '80px',
                            },
                        },
                    },
                },
            },
            removes: {},
        };

        const result = findBlockDifferences( 'client-id', attributes, state, state.iframeViewport );

        expect( result ).toStrictEqual( check );
    } );

    test( 'on filled changes and saves while removing a property from changes and saves', () => {
        const state = deepFreeze( {
            ... DEFAULT_STATE,
            valids: {
                'client-id': {
                    0: {
                        style: {
                            width: '100%',
                            height: 'auto',
                        },
                    },
                },
            },
            changes: {
                'client-id': {
                    0: {
                        style: {
                            width: '100%',
                        },
                    },
                },
            },
            saves: {
                'client-id': {
                    0: {
                        style: {
                            height: 'auto',
                        },
                    },
                },
            },
        } );

        const attributes = {
            style: {
                dimensions: {
                    padding: '80px',
                },
            },
        };

        const check = {
            changes: {
                'client-id': {
                    0: {
                        style: {
                            dimensions: {
                                padding: '80px',
                            },
                        },
                    },
                },
            },
            removes: {
                'client-id': {
                    0: {
                        style: {
                            height: 'auto',
                        },
                    },
                },
            },
        };

        const result = findBlockDifferences( 'client-id', attributes, state, state.iframeViewport );

        expect( result ).toStrictEqual( check );
    } );
} );
/**/



/**
 * Test scenario to test the behavior of adding properties as change.
 * - Based on viewport > 0
 *
 * @since 0.2.13
 */
/**/ /* /**/
describe( 'Testsuite - findBlockDifferences - Viewport > 0 - Adding property', () => {

    test( 'on empty states', () => {
        const state = deepFreeze( {
            ... DEFAULT_STATE,
            iframeViewport: 1024,
            valids: {
                'client-id': {
                    0: {
                        style: {},
                    },
                    1024: {
                        style: {},
                    }
                }
            }
        } );

        const attributes = {
            style: {
                dimensions: {
                    padding: '80px',
                },
            },
        };

        const check = {
            changes: {
                'client-id': {
                    0: {
                        style: {
                            dimensions: {
                                padding: '80px',
                            },
                        },
                    },
                },
            },
            removes: {},
        };

        const result = findBlockDifferences( 'client-id', attributes, state, state.iframeViewport );

        expect( result ).toStrictEqual( check );
    } );

    test( 'on filled changes and empty saves', () => {
        const state = deepFreeze( {
            ... DEFAULT_STATE,
            iframeViewport: 1024,
            valids: {
                'client-id': {
                    0: {
                        style: {
                            width: '100%',
                        },
                    },
                    1024: {
                        style: {
                            width: '100%',
                        },
                    },
                },
            },
            changes: {
                'client-id': {
                    0: {
                        style: {
                            width: '100%',
                        },
                    },
                },
            },
        } );

        const attributes = {
            style: {
                width: '100%',
                dimensions: {
                    padding: '80px',
                },
            },
        };

        const check = {
            changes: {
                'client-id': {
                    0: {
                        style: {
                            width: '100%',
                            dimensions: {
                                padding: '80px',
                            },
                        },
                    },
                },
            },
            removes: {},
        };

        const result = findBlockDifferences( 'client-id', attributes, state, state.iframeViewport );

        expect( result ).toStrictEqual( check );
    } );

    test( 'on filled changes and saves', () => {
        const state = deepFreeze( {
            ... DEFAULT_STATE,
            iframeViewport: 1024,
            valids: {
                'client-id': {
                    0: {
                        style: {
                            width: '100%',
                            height: 'auto',
                        },
                    },
                    1024: {
                        style: {
                            width: '100%',
                            height: 'auto',
                        },
                    },
                },
            },
            changes: {
                'client-id': {
                    0: {
                        style: {
                            height: 'auto',
                        },
                    },
                },
            },
            saves: {
                'client-id': {
                    0: {
                        style: {
                            width: '100%',
                        },
                    },
                },
            },
        } );

        const attributes = {
            style: {
                width: '100%',
                height: 'auto',
                dimensions: {
                    padding: '80px',
                },
            },
        };

        const check = {
            changes: {
                'client-id': {
                    0: {
                        style: {
                            height: 'auto',
                            dimensions: {
                                padding: '80px',
                            },
                        },
                    },
                },
            },
            removes: {},
        };

        const result = findBlockDifferences( 'client-id', attributes, state, state.iframeViewport );

        expect( result ).toStrictEqual( check );
    } );

    test( 'on filled saves and empty changes', () => {
        const state = deepFreeze( {
            ... DEFAULT_STATE,
            iframeViewport: 1024,
            valids: {
                'client-id': {
                    0: {
                        style: {
                            width: '100%',
                        },
                    },
                    1024: {
                        style: {
                            width: '100%',
                        },
                    },
                },
            },
            saves: {
                'client-id': {
                    0: {
                        style: {
                            width: '100%',
                        },
                    },
                },
            },
        } );

        const attributes = {
            style: {
                width: '100%',
                dimensions: {
                    padding: '80px',
                },
            },
        };

        const check = {
            changes: {
                'client-id': {
                    0: {
                        style: {
                            dimensions: {
                                padding: '80px',
                            },
                        },
                    },
                },
            },
            removes: {}
        };

        const result = findBlockDifferences( 'client-id', attributes, state, state.iframeViewport );

        expect( result ).toStrictEqual( check );
    } );

    test( 'on filled changes and empty saves while removing a property from changes', () => {
        const state = deepFreeze( {
            ... DEFAULT_STATE,
            iframeViewport: 1024,
            valids: {
                'client-id': {
                    0: {
                        style: {
                            width: '100%',
                        },
                    },
                    1024: {
                        style: {
                            width: '100%',
                        },
                    },
                },
            },
            changes: {
                'client-id': {
                    0: {
                        style: {
                            width: '100%',
                        },
                    },
                },
            },
        } );

        const attributes = {
            style: {
                dimensions: {
                    padding: '80px',
                },
            },
        };

        const check = {
            changes: {
                'client-id': {
                    0: {
                        style: {
                            dimensions: {
                                padding: '80px',
                            },
                        },
                    },
                },
            },
            removes: {},
        };

        const result = findBlockDifferences( 'client-id', attributes, state, state.iframeViewport );

        expect( result ).toStrictEqual( check );
    } );

    test( 'on filled changes and saves while removing a property from changes', () => {
        const state = deepFreeze( {
            ... DEFAULT_STATE,
            iframeViewport: 1024,
            valids: {
                'client-id': {
                    0: {
                        style: {
                            width: '100%',
                            height: 'auto',
                        },
                    },
                    1024: {
                        style: {
                            width: '100%',
                            height: 'auto',
                        },
                    },
                },
            },
            changes: {
                'client-id': {
                    0: {
                        style: {
                            width: '100%',
                        },
                    },
                },
            },
            saves: {
                'client-id': {
                    0: {
                        style: {
                            height: 'auto',
                        },
                    },
                },
            },
        } );

        const attributes = {
            style: {
                height: 'auto',
                dimensions: {
                    padding: '80px',
                },
            },
        };

        const check = {
            changes: {
                'client-id': {
                    0: {
                        style: {
                            dimensions: {
                                padding: '80px',
                            },
                        },
                    },
                },
            },
            removes: {},
        };

        const result = findBlockDifferences( 'client-id', attributes, state, state.iframeViewport );

        expect( result ).toStrictEqual( check );
    } );


    test( 'on filled changes and saves while removing a property from changes and saves', () => {
        const state = deepFreeze( {
            ... DEFAULT_STATE,
            iframeViewport: 1024,
            valids: {
                'client-id': {
                    0: {
                        style: {
                            width: '100%',
                            height: 'auto',
                        },
                    },
                    1024: {
                        style: {
                            width: '100%',
                            height: 'auto',
                        },
                    },
                },
            },
            changes: {
                'client-id': {
                    0: {
                        style: {
                            width: '100%',
                        },
                    },
                },
            },
            saves: {
                'client-id': {
                    0: {
                        style: {
                            height: 'auto',
                        },
                    },
                },
            },
        } );

        const attributes = {
            style: {
                dimensions: {
                    padding: '80px',
                },
            },
        };

        const check = {
            changes: {
                'client-id': {
                    0: {
                        style: {
                            dimensions: {
                                padding: '80px',
                            },
                        },
                    },
                },
            },
            removes: {
                'client-id': {
                    0: {
                        style: {
                            height: 'auto',
                        },
                    },
                },
            },
        };

        const result = findBlockDifferences( 'client-id', attributes, state, state.iframeViewport );

        expect( result ).toStrictEqual( check );
    } );
} );
/**/

/**
 * Test scenario to test the behavior of changing properties as change.
 * - Based on viewport = 0
 *
 * @since 0.2.13
 */
/**/ /* /**/
describe( 'Testsuite - findBlockDifferences - Viewport = 0 - Changing property', () => {

    test( 'on single property from changes', () => {
        const state = deepFreeze( {
            ... DEFAULT_STATE,
            valids: {
                'client-id': {
                    0: {
                        style: {
                            width: '100%',
                        },
                    },
                },
            },
            changes: {
                'client-id': {
                    0: {
                        style: {
                            width: '100%',
                        },
                    },
                },
            },
        } );

        const attributes = {
            style: {
                width: 'auto',
            },
        };

        const check = {
            changes: {
                'client-id': {
                    0: {
                        style: {
                            width: 'auto',
                        },
                    },
                },
            },
            removes: {},
        };

        const result = findBlockDifferences( 'client-id', attributes, state, state.iframeViewport );

        expect( result ).toStrictEqual( check );
    } );

    test( 'on multiple properties from changes', () => {
        const state = deepFreeze( {
            ... DEFAULT_STATE,
            valids: {
                'client-id': {
                    0: {
                        style: {
                            width: '100%',
                            height: 'auto',
                        },
                    },
                },
            },
            changes: {
                'client-id': {
                    0: {
                        style: {
                            width: '100%',
                            height: 'auto',
                        },
                    },
                },
            },
        } );

        const attributes = {
            style: {
                width: 'auto',
                height: '100%',
            },
        };

        const check = {
            changes: {
                'client-id': {
                    0: {
                        style: {
                            width: 'auto',
                            height: '100%',
                        },
                    },
                },
            },
            removes: {},
        };

        const result = findBlockDifferences( 'client-id', attributes, state, state.iframeViewport );

        expect( result ).toStrictEqual( check );
    } );

    test( 'on nested array from changes', () => {
        const state = deepFreeze( {
            ... DEFAULT_STATE,
            valids: {
                'client-id': {
                    0: {
                        style: {
                            layers: [
                                {
                                    foo: 'foo',
                                    bar: 'bar',
                                },
                            ],
                        },
                    },
                },
            },
            changes: {
                'client-id': {
                    0: {
                        style: {
                            layers: [
                                {
                                    foo: 'foo',
                                    bar: 'bar',
                                },
                            ],
                        },
                    },
                },
            },
        } );

        const attributes = {
            style: {
                layers: [
                    {
                        foo: 'bar',
                        bar: 'foo',
                    },
                ],
            },
        };

        const check = {
            changes: {
                'client-id': {
                    0: {
                        style: {
                            layers: [
                                {
                                    foo: 'bar',
                                    bar: 'foo',
                                },
                            ],
                        },
                    },
                },
            },
            removes: {},
        };

        const result = findBlockDifferences( 'client-id', attributes, state, state.iframeViewport );

        expect( result ).toStrictEqual( check );
    } );

    test( 'on already removed property', () => {
        const state = deepFreeze( {
            ... DEFAULT_STATE,
            valids: {
                'client-id': {
                    0: {
                        style: {
                            dimensions: {
                                width: '100%',
                            }
                        },
                    },
                },
            },
            removes: {
                'client-id': {
                    0: {
                        style: {
                            dimensions: {
                                height: 'auto',
                            }
                        },
                    },
                },
            },
            saves: {
                'client-id': {
                    0: {
                        style: {
                            dimensions: {
                                width: '100%',
                                height: 'auto',
                            }
                        },
                    },
                },
            },
        } );

        const attributes = {
            style: {
                dimensions: {
                    width: '100%',
                    height: '100%',
                }
            },
        };

        const check = {
            changes: {
                'client-id': {
                    0: {
                        style: {
                            dimensions: {
                                height: '100%',
                            }
                        },
                    },
                },
            },
            removes: {},
        };

        const result = findBlockDifferences( 'client-id', attributes, state, state.iframeViewport );

        expect( result ).toStrictEqual( check );
    } );

    test( 'on already removed property - partially', () => {
        const state = deepFreeze( {
            ... DEFAULT_STATE,
            valids: {
                'client-id': {
                    0: {
                        style: {
                            dimensions: {
                                width: '100%',
                            }
                        },
                    },
                },
            },
            removes: {
                'client-id': {
                    0: {
                        style: {
                            dimensions: {
                                height: 'auto',
                                minWidth: '100%',
                            }
                        },
                    },
                },
            },
            saves: {
                'client-id': {
                    0: {
                        style: {
                            dimensions: {
                                width: '100%',
                                height: 'auto',
                            }
                        },
                    },
                },
            },
        } );

        const attributes = {
            style: {
                dimensions: {
                    width: '100%',
                    height: '100%',
                }
            },
        };

        const check = {
            changes: {
                'client-id': {
                    0: {
                        style: {
                            dimensions: {
                                height: '100%',
                            }
                        },
                    },
                },
            },
            removes: {
                'client-id': {
                    0: {
                        style: {
                            dimensions: {
                                minWidth: '100%',
                            }
                        },
                    },
                },
            },
        };

        const result = findBlockDifferences( 'client-id', attributes, state, state.iframeViewport );

        expect( result ).toStrictEqual( check );
    } );
} );
/**/


/**
 * Test scenario to test the behavior of changing properties as change.
 * - Based on viewport > 0
 *
 * @since 0.2.13
 */
/**/ /* /**/
describe( 'Testsuite - findBlockDifferences - Viewport > 0 - Changing property', () => {

    test( 'on single property from changes', () => {
        const state = deepFreeze( {
            ... DEFAULT_STATE,
            iframeViewport: 1024,
            valids: {
                'client-id': {
                    0: {
                        style: {},
                    },
                    768: {
                        style: {
                            width: '100%',
                        },
                    },
                    1024: {
                        style: {
                            width: '100%',
                        },
                    },
                },
            },
            changes: {
                'client-id': {
                    768: {
                        style: {
                            width: '100%',
                        },
                    },
                },
            },
        } );

        const attributes = {
            style: {
                width: 'auto',
            },
        };

        const check = {
            changes: {
                'client-id': {
                    768: {
                        style: {
                            width: 'auto',
                        },
                    },
                },
            },
            removes: {},
        };

        const result = findBlockDifferences( 'client-id', attributes, state, state.iframeViewport );

        expect( result ).toStrictEqual( check );
    } );

    test( 'on multiple properties from changes', () => {
        const state = deepFreeze( {
            ... DEFAULT_STATE,
            iframeViewport: 1024,
            valids: {
                'client-id': {
                    0: {
                        style: {},
                    },
                    768: {
                        style: {
                            width: '100%',
                            height: 'auto',
                        },
                    },
                    1024: {
                        style: {
                            width: '100%',
                            height: 'auto',
                        },
                    },
                },
            },
            changes: {
                'client-id': {
                    768: {
                        style: {
                            width: '100%',
                            height: 'auto',
                        },
                    },
                },
            },
        } );

        const attributes = {
            style: {
                width: 'auto',
                height: '100%',
            },
        };

        const check = {
            changes: {
                'client-id': {
                    768: {
                        style: {
                            width: 'auto',
                            height: '100%',
                        },
                    },
                },
            },
            removes: {},
        };

        const result = findBlockDifferences( 'client-id', attributes, state, state.iframeViewport );

        expect( result ).toStrictEqual( check );
    } );

    test( 'on nested array from changes', () => {
        const state = deepFreeze( {
            ... DEFAULT_STATE,
            iframeViewport: 1024,
            valids: {
                'client-id': {
                    0: {
                        style: {},
                    },
                    768: {
                        style: {
                            layers: [
                                {
                                    foo: 'foo',
                                    bar: 'bar',
                                },
                            ],
                        },
                    },
                    1024: {
                        style: {
                            layers: [
                                {
                                    foo: 'foo',
                                    bar: 'bar',
                                },
                            ],
                        },
                    },
                },
            },
            changes: {
                'client-id': {
                    768: {
                        style: {
                            layers: [
                                {
                                    foo: 'foo',
                                    bar: 'bar',
                                },
                            ],
                        },
                    },
                },
            },
        } );

        const attributes = {
            style: {
                layers: [
                    {
                        foo: 'bar',
                        bar: 'foo',
                    },
                ],
            },
        };

        const check = {
            changes: {
                'client-id': {
                    768: {
                        style: {
                            layers: [
                                {
                                    foo: 'bar',
                                    bar: 'foo',
                                },
                            ],
                        },
                    },
                },
            },
            removes: {},
        };

        const result = findBlockDifferences( 'client-id', attributes, state, state.iframeViewport );

        expect( result ).toStrictEqual( check );
    } );

    test( 'on already removed property', () => {
        const state = deepFreeze( {
            ... DEFAULT_STATE,
            iframeViewport: 1024,
            valids: {
                'client-id': {
                    0: {
                        style: {},
                    },
                    768: {
                        style: {
                            dimensions: {
                                width: '100%',
                            }
                        },
                    },
                    1024: {
                        style: {
                            dimensions: {
                                width: '100%',
                            }
                        },
                    },
                },
            },
            removes: {
                'client-id': {
                    768: {
                        style: {
                            dimensions: {
                                height: 'auto',
                            }
                        },
                    },
                },
            },
            saves: {
                'client-id': {
                    768: {
                        style: {
                            dimensions: {
                                width: '100%',
                                height: 'auto',
                            }
                        },
                    },
                },
            },
        } );

        const attributes = {
            style: {
                dimensions: {
                    width: '100%',
                    height: '100%',
                }
            },
        };

        const check = {
            changes: {
                'client-id': {
                    768: {
                        style: {
                            dimensions: {
                                height: '100%',
                            }
                        },
                    },
                },
            },
            removes: {},
        };

        const result = findBlockDifferences( 'client-id', attributes, state, state.iframeViewport );

        expect( result ).toStrictEqual( check );
    } );

    test( 'on already removed property - partially', () => {
        const state = deepFreeze( {
            ... DEFAULT_STATE,
            iframeViewport: 1024,
            valids: {
                'client-id': {
                    0: {
                        style: {
                            dimensions: {
                                width: '100%',
                            }
                        },
                    },
                    768: {
                        style: {
                            dimensions: {
                                width: '100%',
                            }
                        },
                    },
                    1024: {
                        style: {
                            dimensions: {
                                width: '100%',
                            }
                        },
                    },
                },
            },
            removes: {
                'client-id': {
                    768: {
                        style: {
                            dimensions: {
                                height: 'auto',
                                minWidth: '100%',
                            }
                        },
                    },
                },
            },
            saves: {
                'client-id': {
                    768: {
                        style: {
                            dimensions: {
                                width: '100%',
                                height: 'auto',
                            }
                        },
                    },
                },
            },
        } );

        const attributes = {
            style: {
                dimensions: {
                    width: '100%',
                    height: '100%',
                }
            },
        };

        const check = {
            changes: {
                'client-id': {
                    768: {
                        style: {
                            dimensions: {
                                height: '100%',
                            }
                        },
                    },
                },
            },
            removes: {
                'client-id': {
                    768: {
                        style: {
                            dimensions: {
                                minWidth: '100%',
                            }
                        },
                    },
                },
            },
        };

        const result = findBlockDifferences( 'client-id', attributes, state, state.iframeViewport );

        expect( result ).toStrictEqual( check );
    } );
} );
/**/

/**
 * Test scenario to test the behavior of changing properties as change.
 *
 * @since 0.2.13
 */
/**/ /* /**/
describe( 'Testsuite - findBlockDifferences - Multi Scenario 1', () => {
    test( 'on partially reset property removings by changes', () => {
        const state = deepFreeze( {
            ... DEFAULT_STATE,
            iframeViewport: 1024,
            valids: {
                'client-id': {
                    0: {
                        style: {},
                    },
                    768: {
                        style: {},
                    },
                    1024: {
                        style: {},
                    },
                },
            },
            removes: {
                'client-id': {
                    768: {
                        style: {
                            spacing: {
                                padding: {
                                    top: '10px',
                                    right: '10px',
                                    bottom: '10px',
                                    left: '10px',
                                },
                            }
                        },
                    },
                },
            },
            saves: {
                'client-id': {
                    768: {
                        style: {
                            spacing: {
                                padding: {
                                    top: '10px',
                                    right: '10px',
                                    bottom: '10px',
                                    left: '10px',
                                },
                            }
                        },
                    },
                },
            },
        } );

        const attributes = {
            style: {
                spacing: {
                    padding: {
                        top: '10px',
                        bottom: '10px',
                    },
                }
            },
        };

        const check = {
            changes: {},
            removes: {
                'client-id': {
                    768: {
                        style: {
                            spacing: {
                                padding: {
                                    right: '10px',
                                    left: '10px',
                                },
                            }
                        },
                    },
                },
            },
        };

        const result = findBlockDifferences( 'client-id', attributes, state, state.iframeViewport );

        expect( result ).toStrictEqual( check );

    } );

    test( 'on reset property removings by changes', () => {
        const state = deepFreeze( {
            ... DEFAULT_STATE,
            iframeViewport: 1024,
            valids: {
                'client-id': {
                    0: {
                        style: {},
                    },
                    768: {
                        style: {
                            spacing: {
                                padding: {
                                    top: '10px',
                                    bottom: '10px',
                                },
                            },
                        },
                    },
                    1024: {
                        style: {
                            spacing: {
                                padding: {
                                    top: '10px',
                                    bottom: '10px',
                                },
                            },
                        },
                    },
                },
            },
            removes: {
                'client-id': {
                    768: {
                        style: {
                            spacing: {
                                padding: {
                                    right: '10px',
                                    left: '10px',
                                },
                            }
                        },
                    },
                },
            },
            saves: {
                'client-id': {
                    768: {
                        style: {
                            spacing: {
                                padding: {
                                    top: '10px',
                                    right: '10px',
                                    bottom: '10px',
                                    left: '10px',
                                },
                            }
                        },
                    },
                },
            },
        } );

        const attributes = {
            style: {
                spacing: {
                    padding: {
                        top: '10px',
                        right: '10px',
                        bottom: '10px',
                        left: '10px',
                    },
                }
            },
        };

        const check = {
            changes: {},
            removes: {},
        };

        const result = findBlockDifferences( 'client-id', attributes, state, state.iframeViewport );

        expect( result ).toStrictEqual( check );

    } );
} );
























/**/ /* /**/
test( 'can findBlockDifferences() when changing and removing to changed properties, with isEditing', () => {
    const state = deepFreeze( {
        ... DEFAULT_STATE,
        iframeViewport: 375,
        isEditing: true,
        valids: {
            'client-id': {
                375: {
                    style: {
                        width: '100%',
                    },
                },
            },
        },
    } );

    const attributes = {
        style: {
            width: '100%',
            dimensions: {
                padding: '80px',
            },
        },
    };

    const check = {
        changes: {
            'client-id': {
                375: {
                    style: {
                        dimensions: {
                            padding: '80px',
                        },
                    },
                },
            },
        },
        removes: {},
    };

    const result = findBlockDifferences( 'client-id', attributes, state, state.iframeViewport );

    expect( result ).toStrictEqual( check );
} );


test( 'can findBlockDifferences() when changing a changed property, with isEditing', () => {
    const state = deepFreeze( {
        ... DEFAULT_STATE,
        iframeViewport: 375,
        isEditing: true,
        valids: {
            'client-id': {
                375: {
                    style: {
                        dimensions: {
                            padding: '20px',
                        }
                    }
                }
            }
        },
        changes: {
            'client-id': {
                375: {
                    style: {
                        dimensions: {
                            padding: '20px',
                        }
                    }
                }
            }
        },
    } );

    const attributes = {
        style: {
            dimensions: {
                padding: '80px',
            },
        },
    };

    const check = {
        changes: {
            'client-id': {
                375: {
                    style: {
                        dimensions: {
                            padding: '80px',
                        },
                    },
                },
            },
        },
        removes: {}
    };

    const result = findBlockDifferences( 'client-id', attributes, state, state.iframeViewport );

    expect( result ).toStrictEqual( check );
} );


test( 'can findBlockDifferences() when changing and removing a property on already changed state, with isEditing', () => {
    const state = deepFreeze( {
        ... DEFAULT_STATE,
        iframeViewport: 375,
        isEditing: true,
        valids: {
            'client-id': {
                375: {
                    style: {
                        dimensions: {
                            padding: '20px',
                        },
                        width: '100%',
                    },
                },
            },
        },
        changes: {
            'client-id': {
                375: {
                    style: {
                        width: '100%',
                    },
                },
            },
        },
    } );

    const attributes = {
        style: {
            dimensions: {
                padding: '80px',
            },
        },
    };

    const check = {
        changes: {
            'client-id': {
                375: {
                    style: {
                        dimensions: {
                            padding: '80px',
                        },
                    },
                },
            },
        },
        removes: {}
    };

    const result = findBlockDifferences( 'client-id', attributes, state, state.iframeViewport );

    expect( result ).toStrictEqual( check );
} );


test( 'can findBlockDifferences() when changing a property on already changed state, with isEditing', () => {
    const state = deepFreeze( {
        ... DEFAULT_STATE,
        iframeViewport: 375,
        isEditing: true,
        changes: {
            'client-id': {
                375: {
                    style: {
                        dimensions: {
                            padding: '60px',
                        }
                    }
                }
            }
        },
        valids: {
            'client-id': {
                375: {
                    style: {
                        dimensions: {
                            padding: '20px',
                        }
                    }
                }
            }
        },
    } );

    const attributes = {
        style: {
            dimensions: {
                padding: '80px',
            }
        }
    };

    const check = {
        changes: {
            'client-id': {
                375: {
                    style: {
                        dimensions: {
                            padding: '80px',
                        },
                    },
                },
            },
        },
        removes: {}
    };

    const result = findBlockDifferences( 'client-id', attributes, state, state.iframeViewport );

    expect( result ).toStrictEqual( check );
} );


test( 'can findBlockDifferences() when adding an object as array value on saved state, with isEditing', () => {
    const state = deepFreeze( {
        ... DEFAULT_STATE,
        iframeViewport: 375,
        isEditing: true,
        valids: {
            'client-id': {
                375: {
                    style: {
                        layers: [
                            {
                                foo: 'bar',
                            }
                        ],
                    }
                }
            }
        },
    } );

    const attributes = {
        style: {
            layers: [
                {
                    foo: 'bar',
                },
                {
                    bar: 'foo',
                }
            ],
        }
    };

    const check = {
        changes: {
            'client-id': {
                375: {
                    style: {
                        layers: [
                            {
                                foo: 'bar',
                            },
                            {
                                bar: 'foo',
                            },
                        ],
                    },
                },
            },
        },
        removes: {}
    };

    const result = findBlockDifferences( 'client-id', attributes, state, state.iframeViewport );

    expect( result ).toStrictEqual( check );
} );


test( 'can findBlockDifferences() when adding an object propety inside array value on saved state, with isEditing', () => {
    const state = deepFreeze( {
        ... DEFAULT_STATE,
        iframeViewport: 375,
        isEditing: true,
        valids: {
            'client-id': {
                375: {
                    style: {
                        layers: [
                            {
                                foo: 'bar',
                            }
                        ],
                    }
                }
            }
        },
        saves: {
            'client-id': {
                375: {
                    style: {
                        layers: [
                            {
                                foo: 'bar',
                            }
                        ],
                    }
                }
            }
        },
    } );

    const attributes = {
        style: {
            layers: [
                {
                    foo: 'bar',
                    bar: 'foo',
                },
            ],
        },
    };

    const check = {
        changes: {
            'client-id': {
                375: {
                    style: {
                        layers: [
                            {
                                foo: 'bar',
                                bar: 'foo',
                            },
                        ],
                    },
                },
            },
        },
        removes: {}
    };

    const result = findBlockDifferences( 'client-id', attributes, state, state.iframeViewport );

    expect( result ).toStrictEqual( check );
} );


test( 'can findBlockDifferences() when adding an array value on saved and changed state, with isEditing', () => {
    const state = deepFreeze( {
        ... DEFAULT_STATE,
        iframeViewport: 375,
        isEditing: true,
        changes: {
            'client-id': {
                375: {
                    style: {
                        width: '100%',
                        layers: [
                            {
                                foo: 'bar',
                            },
                            {
                                bar: 'foo',
                            }
                        ],
                    }
                }
            }
        },
        valids: {
            'client-id': {
                375: {
                    style: {
                        layers: [
                            {
                                foo: 'bar',
                            }
                        ],
                    }
                }
            }
        },
    } );

    const attributes = {
        style: {
            width: '100%',
            layers: [
                {
                    foo: 'bar',
                },
                {
                    bar: 'foo',
                },
                {
                    far: 'boo',
                }
            ],
        }
    };

    const check = {
        changes: {
            'client-id': {
                375: {
                    style: {
                        width: '100%',
                        layers: [
                            {
                                foo: 'bar',
                            },
                            {
                                bar: 'foo',
                            },
                            {
                                far: 'boo',
                            },
                        ],
                    },
                },
            },
        },
        removes: {}
    };

    const result = findBlockDifferences( 'client-id', attributes, state, state.iframeViewport );

    expect( result ).toStrictEqual( check );
} );


test( 'can findBlockDifferences() when adding informations deep inside array on saved property, with isEditing', () => {
    const state = deepFreeze( {
        ... DEFAULT_STATE,
        iframeViewport: 375,
        isEditing: true,
        changes: {
            'client-id': {
                375: {
                    style: {
                        width: '100%',
                        layers: [
                            {
                                foo: 'bar',
                            },
                            {
                                bar: 'foo',
                            }
                        ],
                    }
                }
            }
        },
        valids: {
            'client-id': {
                375: {
                    style: {
                        layers: [
                            {
                                foo: 'bar',
                            }
                        ],
                    }
                }
            }
        },
    } );

    const attributes = {
        style: {
            width: '100%',
            layers: [
                {
                    foo: 'bar',
                    bar: 'foo',
                },
                {
                    bar: 'foo',
                },
            ],
        }
    };

    const check = {
        changes: {
            'client-id': {
                375: {
                    style: {
                        width: '100%',
                        layers: [
                            {
                                foo: 'bar',
                                bar: 'foo',
                            },
                            {
                                bar: 'foo',
                            },
                        ],
                    },
                },
            },
        },
        removes: {}
    };

    const result = findBlockDifferences( 'client-id', attributes, state, state.iframeViewport );

    expect( result ).toStrictEqual( check );
} );


test( 'can findBlockDifferences() when changing array order on saved property, with isEditing', () => {
    const state = deepFreeze( {
        ... DEFAULT_STATE,
        iframeViewport: 375,
        isEditing: true,
        valids: {
            'client-id': {
                375: {
                    style: {
                        layers: [
                            {
                                foo: 'bar',
                            },
                            {
                                bar: 'foo',
                            },
                        ],
                    },
                },
            },
        },
        saves: {
            'client-id': {
                375: {
                    style: {
                        layers: [
                            {
                                foo: 'bar',
                            },
                            {
                                bar: 'foo',
                            },
                        ],
                    },
                },
            },
        },
    } );

    const attributes = {
        style: {
            width: '100%',
            layers: [
                {
                    bar: 'foo',
                },
                {
                    foo: 'bar',
                },
            ],
        },
    };

    const check = {
        changes: {
            'client-id': {
                375: {
                    style: {
                        width: '100%',
                        layers: [
                            {
                                bar: 'foo',
                            },
                            {
                                foo: 'bar',
                            },
                        ],
                    },
                },
            },
        },
        removes: {}
    };

    const result = findBlockDifferences( 'client-id', attributes, state, state.iframeViewport );

    expect( result ).toStrictEqual( check );
} );


test( 'can findBlockDifferences() when removing a saved property entirely, with isEditing', () => {
    const state = deepFreeze( {
        ... DEFAULT_STATE,
        iframeViewport: 768,
        isEditing: true,
        saves: {
            'client-id': {
                768: {
                    style: {
                        width: '100%',
                        layers: [
                            {
                                foo: 'bar',
                            },
                            {
                                bar: 'foo',
                            },
                        ],
                    },
                },
            },
        },
        valids: {
            'client-id': {
                768: {
                    style: {
                        width: '100%',
                        layers: [
                            {
                                foo: 'bar',
                            },
                            {
                                bar: 'foo',
                            },
                        ],
                    },
                },
            },
        },
    } );

    const attributes = {
        style: {
            width: '100%',
        },
    };

    const check = {
        changes: {},
        removes: {
            'client-id': {
                768: {
                    style: {
                        layers: [
                            {
                                foo: 'bar',
                            },
                            {
                                bar: 'foo',
                            },
                        ],
                    },
                },
            },
        },
    };

    const result = findBlockDifferences( 'client-id', attributes, state, state.iframeViewport );

    expect( result ).toStrictEqual( check );
} );


test( 'can findBlockDifferences() when changing a property and removing a saved property entirely, with isEditing', () => {
    const state = deepFreeze( {
        ... DEFAULT_STATE,
        iframeViewport: 768,
        isEditing: true,
        saves: {
            'client-id': {
                768: {
                    style: {
                        layers: [
                            {
                                foo: 'bar',
                            },
                            {
                                bar: 'foo',
                            }
                        ],
                    }
                }
            }
        },
        valids: {
            'client-id': {
                768: {
                    style: {
                        layers: [
                            {
                                foo: 'bar',
                            },
                            {
                                bar: 'foo',
                            }
                        ],
                    },
                },
            },
        },
    } );

    const attributes = {
        style: {
            width: '50%',
        }
    };

    const check = {
        changes: {
            'client-id': {
                768: {
                    style: {
                        width: '50%',
                    },
                },
            },
        },
        removes: {
            'client-id': {
                768: {
                    style: {
                        layers: [
                            {
                                foo: 'bar',
                            },
                            {
                                bar: 'foo',
                            },
                        ],
                    },
                },
            },
        },
    };

    const result = findBlockDifferences( 'client-id', attributes, state, state.iframeViewport );

    expect( result ).toStrictEqual( check );
} );


test( 'can findBlockDifferences() when removing parts of changes, with isEditing', () => {
    const state = deepFreeze( {
        ... DEFAULT_STATE,
        iframeViewport: 768,
        isEditing: true,
        valids: {
            'client-id': {
                768: {
                    style: {
                        dimensions: {
                            padding: {
                                top: '20px',
                                right: '20px',
                                bottom: '20px',
                                left: '20px',
                            },
                        },
                    },
                },
            },
        },
        changes: {
            'client-id': {
                768: {
                    style: {
                        dimensions: {
                            padding: {
                                top: '20px',
                                right: '20px',
                                bottom: '20px',
                                left: '20px',
                            },
                        },
                    },
                },
            },
        },
    } );

    const attributes = {
        style: {
            dimensions: {
                padding: {
                    top: '20px',
                    bottom: '20px',
                },
            },
        },
    };

    const check = {
        changes: {
            'client-id': {
                768: {
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
        },
        removes: {},
    };

    const result = findBlockDifferences( 'client-id', attributes, state, state.iframeViewport );

    expect( result ).toStrictEqual( check );
} );


test( 'can findBlockDifferences() when removing parts of changes and adding removes, with isEditing', () => {
    const state = deepFreeze( {
        ... DEFAULT_STATE,
        iframeViewport: 768,
        isEditing: true,
        valids: {
            'client-id': {
                768: {
                    style: {
                        dimensions: {
                            padding: {
                                top: '20px',
                                right: '20px',
                                bottom: '20px',
                                left: '20px',
                            }
                        }
                    }
                }
            }
        },
        changes: {
            'client-id': {
                768: {
                    style: {
                        dimensions: {
                            padding: {
                                top: '20px',
                                right: '20px',
                                bottom: '20px',
                                left: '20px',
                            }
                        }
                    }
                }
            }
        },
        saves: {
            'client-id': {
                0: {
                    style: {
                        dimensions: {
                            padding: {
                                top: '10px',
                                right: '10px',
                                bottom: '10px',
                                left: '10px',
                            }
                        }
                    }
                }
            }
        },
    } );

    const attributes = {
        style: {
            dimensions: {
                padding: {
                    top: '20px',
                    bottom: '20px',
                }
            }
        }
    };

    const check = {
        changes: {
            'client-id': {
                768: {
                    style: {
                        dimensions: {
                            padding: {
                                top: '20px',
                                bottom: '20px',
                            }
                        }
                    }
                },
            },
        },
        removes: {
            'client-id': {
                0: {
                    style: {
                        dimensions: {
                            padding: {
                                right: '10px',
                                left: '10px',
                            }
                        }
                    }
                },
            },
        },
    };

    const result = findBlockDifferences( 'client-id', attributes, state, state.iframeViewport );

    expect( result ).toStrictEqual( check );
} );


test( 'can findBlockDifferences() when removing an entire property, with isEditing', () => {
    const state = deepFreeze( {
        ... DEFAULT_STATE,
        iframeViewport: 768,
        isEditing: true,
        valids: {
            'client-id': {
                768: {
                    style: {
                        dimensions: {
                            padding: {
                                top: '20px',
                                right: '20px',
                                bottom: '20px',
                                left: '20px',
                            }
                        }
                    }
                }
            }
        },
        changes: {
            'client-id': {
                768: {
                    style: {
                        dimensions: {
                            padding: {
                                top: '20px',
                                right: '20px',
                                bottom: '20px',
                                left: '20px',
                            }
                        }
                    }
                }
            }
        },
        saves: {
            'client-id': {
                768: {
                    style: {
                        dimensions: {
                            padding: {
                                top: '10px',
                                right: '10px',
                                bottom: '10px',
                                left: '10px',
                            }
                        }
                    }
                }
            }
        },
    } );

    const attributes = {
        style: {}
    };

    const check = {
        changes: {},
        removes: {
            'client-id': {
                768: {
                    style: {
                        dimensions: {
                            padding: {
                                top: '10px',
                                right: '10px',
                                bottom: '10px',
                                left: '10px',
                            }
                        }
                    }
                }
            }
        },
    };

    const result = findBlockDifferences( 'client-id', attributes, state, state.iframeViewport );

    expect( result ).toStrictEqual( check );
} );

/**/