// Import preparement dependencies.
import * as data from '@wordpress/data';
import * as element from '@wordpress/element';
import * as lodash from 'lodash';
import deepFreeze from 'deep-freeze';

// Extend global window object.
global.window[ 'wp' ] = {
	data: data,
	element: element,
};
global.window[ 'lodash' ] = lodash;

// Import test environment.
import { describe, expect, test } from '@jest/globals';

// Import store parts.
import { DEFAULT_STATE } from '../default';

// Deconstruct functions to test.
import {
	setViewports,
	setViewport,
	setDesktop,
	setTablet,
	setMobile,
	setReady,
	setLoading,
	unsetLoading,
	setSaving,
	unsetSaving,
	setAutoSaving,
	unsetAutoSaving,
	setActive,
	unsetActive,
	setInspecting,
	unsetInspecting,
	setInspectorPosition,
	toggleActive,
	toggleDesktop,
	toggleTablet,
	toggleMobile,
	registerBlockInit,
	updateBlockChanges,
	updateBlockValids,
	removeBlock,
	removeBlockSaves,
	restoreBlockSaves,
	saveBlock,
	clearBlocks,
	registerRenderer,
} from '../reducer';


describe( 'test store reducers', () => {

	describe( 'viewports', () => {
		test( 'can setViewports()', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				viewports: {
					375: 'Mobile',
					768: 'Tablet',
					1360: 'Desktop',
				}
			} );
			const action = {
				type: 'SET_VIEWPORTS',
				viewports: {
					300: 'Mobile small',
					1920: 'Desktop large',
				}
			};

			const check = {
				... DEFAULT_STATE,
				viewports: {
					300: 'Mobile small',
					375: 'Mobile',
					768: 'Tablet',
					1360: 'Desktop',
					1920: 'Desktop large',
				}
			};
			const result = setViewports( state, action );

			expect( check ).toStrictEqual( result );
		} );

		test( 'can setViewport() with inactive viewport simulation', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				viewport: 1360,
				isActive: false,
			} );
			const action = {
				type: 'SET_VIEWPORT',
				viewport: 1024,
			};

			const check = {
				... DEFAULT_STATE,
				viewport: 1360,
				isActive: false,
			};
			const result = setViewport( state, action );

			expect( check ).toStrictEqual( result );
		} );

		test( 'can setViewport() with active viewport simulation', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				viewport: 1360,
				isActive: true,
			} );
			const action = {
				type: 'SET_VIEWPORT',
				viewport: 1024,
			};

			const check = {
				... DEFAULT_STATE,
				viewport: 1024,
				isActive: true,
			};
			const result = setViewport( state, action );

			expect( check ).toStrictEqual( result );
		} );

		test( 'can setDesktop() with invalid viewport', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				viewport: 768,
				desktop: 1360,
			} );
			const action = {
				type: 'SET_DESKTOP',
			};

			const check = {
				... DEFAULT_STATE,
				viewport: 768,
				desktop: 1360,
			};
			const result = setDesktop( state, action );

			expect( check ).toStrictEqual( result );
		} );

		test( 'can setDesktop() with valid viewport', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				viewport: 1280,
				desktop: 1360,
			} );
			const action = {
				type: 'SET_DESKTOP',
			};

			const check = {
				... DEFAULT_STATE,
				viewport: 1280,
				desktop: 1280,
			};
			const result = setDesktop( state, action );

			expect( check ).toStrictEqual( result );
		} );

		test( 'can setTablet() with invalid viewport', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				viewport: 375,
				tablet: 768,
			} );
			const action = {
				type: 'SET_TABLET',
			};

			const check = {
				... DEFAULT_STATE,
				viewport: 375,
				tablet: 768,
			};
			const result = setTablet( state, action );

			expect( check ).toStrictEqual( result );
		} );

		test( 'can setTablet() with valid viewport', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				viewport: 1024,
				tablet: 768,
			} );
			const action = {
				type: 'SET_TABLET',
			};

			const check = {
				... DEFAULT_STATE,
				viewport: 1024,
				tablet: 1024,
			};
			const result = setTablet( state, action );

			expect( check ).toStrictEqual( result );
		} );

		test( 'can setMobile() with invalid viewport', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				viewport: 768,
				mobile: 375,
			} );
			const action = {
				type: 'SET_MOBILE',
			};

			const check = {
				... DEFAULT_STATE,
				viewport: 768,
				mobile: 375,
			};
			const result = setMobile( state, action );

			expect( check ).toStrictEqual( result );
		} );

		test( 'can setMobile() with valid viewport', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				viewport: 320,
				mobile: 375,
			} );
			const action = {
				type: 'SET_MOBILE',
			};

			const check = {
				... DEFAULT_STATE,
				viewport: 320,
				mobile: 320,
			};
			const result = setMobile( state, action );

			expect( check ).toStrictEqual( result );
		} );

		test( 'can setReady()', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				isReady: false,
			} );
			const action = {
				type: 'SET_READY',
			};

			const check = {
				... DEFAULT_STATE,
				isReady: true,
			};
			const result = setReady( state, action );

			expect( check ).toStrictEqual( result );
		} );

		test( 'can setLoading()', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				isLoading: false,
			} );
			const action = {
				type: 'SET_LOADING',
			};

			const check = {
				... DEFAULT_STATE,
				isLoading: true,
			};
			const result = setLoading( state, action );

			expect( check ).toStrictEqual( result );
		} );

		test( 'can unsetLoading()', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				isLoading: true,
			} );
			const action = {
				type: 'UNSET_LOADING',
			};

			const check = {
				... DEFAULT_STATE,
				isLoading: false,
			};
			const result = unsetLoading( state, action );

			expect( check ).toStrictEqual( result );
		} );

		test( 'can setSaving()', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				isSaving: false,
			} );
			const action = {
				type: 'SET_SAVING',
			};

			const check = {
				... DEFAULT_STATE,
				isSaving: true,
			};
			const result = setSaving( state, action );

			expect( check ).toStrictEqual( result );
		} );

		test( 'can unsetSaving()', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				isSaving: true,
			} );
			const action = {
				type: 'UNSET_SAVING',
			};

			const check = {
				... DEFAULT_STATE,
				isSaving: false,
			};
			const result = unsetSaving( state, action );

			expect( check ).toStrictEqual( result );
		} );

		test( 'can setAutoSaving()', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				isAutoSaving: false,
			} );
			const action = {
				type: 'SET_AUTOSAVING',
			};

			const check = {
				... DEFAULT_STATE,
				isAutoSaving: true,
			};
			const result = setAutoSaving( state, action );

			expect( check ).toStrictEqual( result );
		} );

		test( 'can unsetAutoSaving()', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				isAutoSaving: true,
			} );
			const action = {
				type: 'UNSET_AUTOSAVING',
			};

			const check = {
				... DEFAULT_STATE,
				isAutoSaving: false,
			};
			const result = unsetAutoSaving( state, action );

			expect( check ).toStrictEqual( result );
		} );

		test( 'can setActive() with loading and without preselected viewport', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				isLoading: true,
				isActive: false,
				viewport: 0,
			} );
			const action = {
				type: 'SET_ACTIVE',
			};

			// As there is no iframe in tests, the default is 780 cause the iframe viewport
			// will return 800 if there is no iframe. So the highest viewport is 780 by wp default.
			const check = {
				... DEFAULT_STATE,
				isLoading: false,
				isActive: true,
				viewport: 780,
			};
			const result = setActive( state, action );

			expect( check ).toStrictEqual( result );
		} );

		test( 'can setActive() without loading and with preselected viewport', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				isLoading: false,
				isActive: false,
				viewport: 1360,
			} );
			const action = {
				type: 'SET_ACTIVE',
			};

			const check = {
				... DEFAULT_STATE,
				isLoading: false,
				isActive: true,
				viewport: 1360,
			};
			const result = setActive( state, action );

			expect( check ).toStrictEqual( result );
		} );

		test( 'can unsetActive()', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				isActive: true,
				viewport: 1360,
			} );
			const action = {
				type: 'UNSET_ACTIVE',
			};

			const check = {
				... DEFAULT_STATE,
				isActive: false,
				viewport: 1360,
			};
			const result = unsetActive( state, action );

			expect( check ).toStrictEqual( result );
		} );

		test( 'can setInspecting()', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				isInspecting: false,
			} );
			const action = {
				type: 'SET_INSPECTING',
			};

			const check = {
				... DEFAULT_STATE,
				isInspecting: true,
			};
			const result = setInspecting( state, action );

			expect( check ).toStrictEqual( result );
		} );

		test( 'can unsetInspecting()', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				isInspecting: true,
			} );
			const action = {
				type: 'UNSET_INSPECTING',
			};

			const check = {
				... DEFAULT_STATE,
				isInspecting: false,
			};
			const result = unsetInspecting( state, action );

			expect( check ).toStrictEqual( result );
		} );

		test( 'can setInspectorPosition() to right', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				inspectorPosition: 'left',
			} );
			const action = {
				type: 'SET_INSPECTOR_POSITION',
				position: 'right',
			};

			const check = {
				... DEFAULT_STATE,
				inspectorPosition: 'right',
			};
			const result = setInspectorPosition( state, action );

			expect( check ).toStrictEqual( result );
		} );

		test( 'can toggleActive() toggle inactive status', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				isActive: false,
			} );
			const action = {
				type: 'TOGGLE_ACTIVE',
			};

			// As there is no iframe in tests, the default is 780 cause the iframe viewport
			// will return 800 if there is no iframe. So the highest viewport is 780 by wp default.
			const check = {
				... DEFAULT_STATE,
				isActive: true,
				viewport: 780,
			};
			const result = toggleActive( state, action );

			expect( check ).toStrictEqual( result );
		} );

		test( 'can toggleActive() toggle active status', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				isActive: true,
				viewport: 1360,
			} );
			const action = {
				type: 'TOGGLE_ACTIVE',
			};

			const check = {
				... DEFAULT_STATE,
				isActive: false,
				viewport: 1360,
			};
			const result = toggleActive( state, action );

			expect( check ).toStrictEqual( result );
		} );

		test( 'can toggleDesktop()', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				viewport: 375,
				desktop: 1360,
			} );
			const action = {
				type: 'TOGGLE_DESKTOP',
			};

			const check = {
				... DEFAULT_STATE,
				viewport: 1360,
				desktop: 1360,
			};
			const result = toggleDesktop( state, action );

			expect( check ).toStrictEqual( result );
		} );

		test( 'can toggleTablet()', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				viewport: 375,
				tablet: 768,
			} );
			const action = {
				type: 'TOGGLE_TABLET',
			};

			const check = {
				... DEFAULT_STATE,
				viewport: 768,
				tablet: 768,
			};
			const result = toggleTablet( state, action );

			expect( check ).toStrictEqual( result );
		} );

		test( 'can toggleMobil()', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				viewport: 768,
				mobile: 375,
			} );
			const action = {
				type: 'TOGGLE_MOBILE',
			};

			const check = {
				... DEFAULT_STATE,
				viewport: 375,
				mobile: 375,
			};
			const result = toggleMobile( state, action );

			expect( check ).toStrictEqual( result );
		} );
	} );



	describe( 'styles', () => {
		test( 'can registerBlockInit() without clientId and without attributes', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				viewports: {
					375: 'Mobile',
					768: 'Tablet',
					1280: 'Desktop',
				},
				init: {},
				defaults: {},
				saves: {},
				valids: {},
			} );
			const action = {
				type: 'REGISTER_BLOCK_INIT',
				clientId: '',
				attributes: {},
			};

			const check = {
				... state,
				init: {},
				defaults: {},
				saves: {},
				valids: {}
			};
			const result = registerBlockInit( state, action );

			expect( check ).toStrictEqual( result );
		} );

		test( 'can registerBlockInit() with clientId and without attributes', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				viewports: {
					375: 'Mobile',
					768: 'Tablet',
					1280: 'Desktop',
				},
				init: {},
				defaults: {},
				saves: {},
				valids: {},
			} );
			const action = {
				type: 'REGISTER_BLOCK_INIT',
				clientId: 'client-id',
				attributes: {},
			};

			const check = {
				... state,
				init: {
					'client-id': true,
				},
				defaults: {},
				saves: {},
				valids: {
					'client-id': {
						0: {},
						375: {},
						768: {},
						1280: {},
					}
				}
			};
			const result = registerBlockInit( state, action );

			expect( result ).toStrictEqual( check );
		} );

		test( 'can registerBlockInit() with clientId and with attributes', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				viewports: {
					375: 'Mobile',
					768: 'Tablet',
					1280: 'Desktop',
				},
				init: {},
				defaults: {},
				saves: {},
				valids: {},
			} );
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
			};

			const check = {
				... state,
				init: {
					'client-id': true,
				},
				defaults: {
					'client-id': {
						style: {
							dimensions: {
								padding: 0,
								margin: 0,
							}
						}
					}
				},
				saves: {},
				valids: {
					'client-id': {
						0: {
							style: {
								dimensions: {
									padding: 0,
									margin: 0,
								}
							}
						},
						375: {
							style: {
								dimensions: {
									padding: 0,
									margin: 0,
								}
							}
						},
						768: {
							style: {
								dimensions: {
									padding: 0,
									margin: 0,
								}
							}
						},
						1280: {
							style: {
								dimensions: {
									padding: 0,
									margin: 0,
								}
							}
						},
					}
				}
			};
			const result = registerBlockInit( state, action );

			expect( check ).toStrictEqual( result );
		} );

		test( 'can updateBlockChanges() with saves, changes and single added attribute', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				viewport: 1280,
				viewports: {
					375: 'Mobile',
					768: 'Tablet',
					1024: 'Tablet large',
					1280: 'Desktop',
					1920: 'Desktop large',
				},
				saves: {
					'client-id': {
						375: {
							style: {
								dimensions: {
									padding: {
										top: '10px',
										bottom: '10px',
									},
								}
							}
						},
						768: {
							style: {
								dimensions: {
									padding: {
										top: '20px',
										bottom: '20px',
									},
								}
							}
						},
						1280: {
							style: {
								dimensions: {
									padding: {
										top: '30px',
										bottom: '30px',
									},
								}
							}
						}
					}
				},
				changes: {
					'client-id': {
						1280: {
							style: {
								dimensions: {
									padding: {
										top: '40px',
										bottom: '40px',
									},
								}
							}
						}
					}
				}
			} );
			const action = {
				type: 'UPDATE_BLOCK_CHANGES',
				clientId: 'client-id',
				attributes: {
					content: 'Text',
					style: {
						dimensions: {
							padding: {
								top: '40px',
								bottom: '40px',
							},
							margin: {
								bottom: "80px",
							},
						}
					}
				}
			}

			const check = {
				... state,
				changes: {
					'client-id': {
						1280: {
							style: {
								dimensions: {
									padding: {
										top: '40px',
										bottom: '40px',
									},
									margin: {
										bottom: "80px",
									}
								}
							}
						}
					}
				},
				valids: {
					'client-id': {
						0: {},
						375: {
							style: {
								dimensions: {
									padding: {
										top: '10px',
										bottom: '10px',
									}
								}
							}
						},
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
						1024: {
							style: {
								dimensions: {
									padding: {
										top: '20px',
										bottom: '20px',
									}
								}
							}
						},
						1280: {
							style: {
								dimensions: {
									padding: {
										top: '40px',
										bottom: '40px',
									},
									margin: {
										bottom: "80px",
									}
								}
							}
						},
						1920: {
							style: {
								dimensions: {
									padding: {
										top: '40px',
										bottom: '40px',
									},
									margin: {
										bottom: "80px",
									}
								}
							}
						}
					}
				}
			};
			const result = updateBlockChanges( state, action );

			expect( result ).toStrictEqual( check );
		} );

		test( 'can updateBlockChanges() with saves, changes and multi changed attributes', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				viewport: 1280,
				viewports: {
					375: 'Mobile',
					768: 'Tablet',
					1024: 'Tablet large',
					1280: 'Desktop',
					1920: 'Desktop large',
				},
				saves: {
					'client-id': {
						375: {
							style: {
								dimensions: {
									padding: {
										top: '10px',
										bottom: '10px',
									},
								}
							}
						},
						768: {
							style: {
								dimensions: {
									padding: {
										top: '20px',
										bottom: '20px',
									},
								}
							}
						},
						1280: {
							style: {
								dimensions: {
									padding: {
										top: '30px',
										bottom: '30px',
									},
								}
							}
						}
					}
				},
				changes: {
					'client-id': {
						1280: {
							style: {
								dimensions: {
									padding: {
										top: '40px',
										bottom: '40px',
									},
								}
							}
						}
					}
				}
			} );
			const action = {
				type: 'UPDATE_BLOCK_CHANGES',
				clientId: 'client-id',
				attributes: {
					content: 'Text',
					style: {
						dimensions: {
							padding: "80px",
						}
					}
				}
			}

			const check = {
				... state,
				changes: {
					'client-id': {
						1280: {
							style: {
								dimensions: {
									padding: "80px",
								}
							}
						}
					}
				},
				valids: {
					'client-id': {
						0: {},
						375: {
							style: {
								dimensions: {
									padding: {
										top: '10px',
										bottom: '10px',
									}
								}
							}
						},
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
						1024: {
							style: {
								dimensions: {
									padding: {
										top: '20px',
										bottom: '20px',
									}
								}
							}
						},
						1280: {
							style: {
								dimensions: {
									padding: "80px",
								}
							}
						},
						1920: {
							style: {
								dimensions: {
									padding: "80px",
								}
							}
						}
					}
				}
			};
			const result = updateBlockChanges( state, action );

			expect( result ).toStrictEqual( check );
		} );

		test( 'can updateBlockChanges() with saves, changes and multi changed attributes including arrays', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				viewport: 1280,
				viewports: {
					375: 'Mobile',
					768: 'Tablet',
					1024: 'Tablet large',
					1280: 'Desktop',
					1920: 'Desktop large',
				},
				saves: {
					'client-id': {
						375: {
							style: {
								dimensions: {
									padding: {
										top: '10px',
										bottom: '10px',
									},
								}
							}
						},
						768: {
							style: {
								dimensions: {
									padding: {
										top: '20px',
										bottom: '20px',
									},
								}
							}
						},
						1280: {
							style: {
								dimensions: {
									padding: {
										top: '30px',
										bottom: '30px',
									},
								}
							}
						}
					}
				},
				changes: {
					'client-id': {
						1280: {
							style: {
								dimensions: {
									padding: {
										top: '40px',
										bottom: '40px',
									},
								},
								layers: [
									{
										foo: 'bar'
									}
								]
							}
						}
					}
				}
			} );
			const action = {
				type: 'UPDATE_BLOCK_CHANGES',
				clientId: 'client-id',
				attributes: {
					content: 'Text',
					style: {
						dimensions: {
							padding: "80px",
						},
						layers: [
							{
								foo: 'bar',
							},
							{
								bar: 'foo',
							}
						]
					}
				}
			}

			const check = {
				... state,
				changes: {
					'client-id': {
						1280: {
							style: {
								dimensions: {
									padding: "80px",
								},
								layers: [
									{
										foo: 'bar',
									},
									{
										bar: 'foo',
									}
								]
							}
						}
					}
				},
				valids: {
					'client-id': {
						0: {},
						375: {
							style: {
								dimensions: {
									padding: {
										top: '10px',
										bottom: '10px',
									}
								}
							}
						},
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
						1024: {
							style: {
								dimensions: {
									padding: {
										top: '20px',
										bottom: '20px',
									}
								}
							}
						},
						1280: {
							style: {
								dimensions: {
									padding: "80px",
								},
								layers: [
									{
										foo: 'bar',
									},
									{
										bar: 'foo',
									}
								]
							}
						},
						1920: {
							style: {
								dimensions: {
									padding: "80px",
								},
								layers: [
									{
										foo: 'bar',
									},
									{
										bar: 'foo',
									}
								]
							}
						}
					}
				}
			};
			const result = updateBlockChanges( state, action );

			expect( result ).toStrictEqual( check );
		} );

		test( 'can updateBlockValids() with defaults, saves and changes', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				viewports: {
					375: '',
					768: '',
					1280: '',
				},
				defaults: {
					'client-id': {
						style: {
							dimensions: {
								padding: 0,
								margin: 0,
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
										left: "20px",
										right: "20px",
									},
								}
							}
						},
						1280: {
							style: {
								dimensions: {
									margin: {
										top: "40px",
										bottom: "40px",
									},
								}
							}
						}
					}
				},
				changes: {
					'client-id': {
						1280: {
							style: {
								dimensions: {
									margin: "40px",
								}
							}
						}
					}
				}
			} );
			const action = {
				type: 'UPDATE_BLOCK_VALIDS',
				clientId: 'client-id',
			}

			const check = {
				... state,
				valids: {
					'client-id': {
						0: {
							style: {
								dimensions: {
									padding: 0,
									margin: 0,
								}
							}
						},
						375: {
							style: {
								dimensions: {
									padding: 0,
									margin: 0,
								}
							}
						},
						768: {
							style: {
								dimensions: {
									padding: {
										left: "20px",
										right: "20px",
									},
									margin: 0,
								}
							}
						},
						1280: {
							style: {
								dimensions: {
									padding: {
										left: "20px",
										right: "20px",
									},
									margin: "40px",
								}
							}
						}
					}
				}
			}
			const result = updateBlockValids( state, action );

			expect( result ).toStrictEqual( check );
		} );

		test( 'can removeBlock()', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				init: {
					'client-id': true,
				},
				defaults: {
					'client-id': {},
				},
				saves: {
					'client-id': {},
				},
				changes: {
					'client-id': {},
				},
				valids: {
					'client-id': {},
				}
			} );
			const action = {
				type: 'REMOVE_BLOCK',
				clientId: 'client-id',
			}

			const check = {
				... DEFAULT_STATE,
				init: {},
				defaults: {},
				saves: {},
				changes: {},
				valids: {},
			}
			const result = removeBlock( state, action );

			expect( result ).toStrictEqual( check );
		} );

		test( 'can restoreBlockSaves() with viewport and remove the first entry', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				viewports: {
					375: 'Mobile',
					768: 'Tablet',
					1280: 'Desktop',
				},
				changes: {
					'client-id': {
						768: {
							style: {
								dimensions: {
									padding: {
										top: "20px",
										bottom: "20px",
									}
								}
							}
						},
						1280: {
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
			} );
			const action = {
				type: 'REMOVE_BLOCK_CHANGES',
				clientId: 'client-id',
				viewport: 1280,
				props: [ 'style' ],
			}

			const check = {
				... state,
				changes: {
					'client-id': {
						768: {
							style: {
								dimensions: {
									padding: {
										top: "20px",
										bottom: "20px",
									}
								}
							}
						}
					}
				},
				valids: {
					'client-id': {
						0: {},
						375: {},
						768: {
							style: {
								dimensions: {
									padding: {
										top: "20px",
										bottom: "20px",
									}
								}
							}
						},
						1280: {
							style: {
								dimensions: {
									padding: {
										top: "20px",
										bottom: "20px",
									}
								}
							}
						}
					}
				}
			}
			const result = restoreBlockSaves( state, action );

			// Reset lastEdit cause it is a timestamp.
			result.lastEdit = check.lastEdit;

			expect( result ).toStrictEqual( check );
		} );

		test( 'can restoreBlockSaves() with viewport and remove to the deepest', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				viewports: {
					375: 'Mobile',
					768: 'Tablet',
					1280: 'Desktop',
				},
				changes: {
					'client-id': {
						768: {
							style: {
								dimensions: {
									padding: {
										top: "20px",
										bottom: "20px",
									}
								}
							}
						},
						1280: {
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
			} );
			const action = {
				type: 'REMOVE_BLOCK_CHANGES',
				clientId: 'client-id',
				viewport: 1280,
				props: [ 'style', 'dimensions', 'padding', 'top' ],
			}

			const check = {
				... state,
				changes: {
					'client-id': {
						768: {
							style: {
								dimensions: {
									padding: {
										top: "20px",
										bottom: "20px",
									}
								}
							}
						},
						1280: {
							style: {
								dimensions: {
									padding: {
										bottom: "40px",
									}
								}
							}
						}
					}
				},
				valids: {
					'client-id': {
						0: {},
						375: {},
						768: {
							style: {
								dimensions: {
									padding: {
										top: "20px",
										bottom: "20px",
									}
								}
							}
						},
						1280: {
							style: {
								dimensions: {
									padding: {
										top: "20px",
										bottom: "40px",
									}
								}
							}
						}
					}
				}
			}
			const result = restoreBlockSaves( state, action );

			// Reset lastEdit cause it is a timestamp.
			result.lastEdit = check.lastEdit;

			expect( result ).toStrictEqual( check );
		} );


		test( 'can removeBlockSaves() with viewport and remove to the deepest', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				viewports: {
					375: 'Mobile',
					768: 'Tablet',
					1280: 'Desktop',
				},
				saves: {
					'client-id': {
						768: {
							style: {
								dimensions: {
									padding: {
										top: "20px",
										bottom: "20px",
									}
								}
							}
						},
						1280: {
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
			} );
			const action = {
				type: 'REMOVE_BLOCK_SAVES',
				clientId: 'client-id',
				viewport: 1280,
				props: [ 'style', 'dimensions', 'padding', 'top' ],
			}

			const check = {
				... state,
				saves: {
					'client-id': {
						768: {
							style: {
								dimensions: {
									padding: {
										top: "20px",
										bottom: "20px",
									}
								}
							}
						},
						1280: {
							style: {
								dimensions: {
									padding: {
										bottom: "40px",
									}
								}
							}
						}
					}
				},
				removes: {
					'client-id': {
						1280: {
							style: {
								dimensions: {
									padding: {
										top: "40px",
									}
								}
							}
						}
					}
				},
				valids: {
					'client-id': {
						0: {},
						375: {},
						768: {
							style: {
								dimensions: {
									padding: {
										top: "20px",
										bottom: "20px",
									}
								}
							}
						},
						1280: {
							style: {
								dimensions: {
									padding: {
										top: "20px",
										bottom: "40px",
									}
								}
							}
						}
					}
				}
			}

			const result = removeBlockSaves( state, action );

			// Reset lastEdit cause it is a timestamp.
			result.lastEdit = check.lastEdit;

			expect( result ).toStrictEqual( check );
		} );

		test( 'can saveBlock() with saves, changes and removes', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				viewports: {
					375: 'Mobile',
					768: 'Tablet',
					1280: 'Desktop',
				},
				saves: {
					'client-id': {
						768: {
							style: {
								dimensions: {
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
						},
						1280: {
							style: {
								dimensions: {
									margin: {
										top: "40px",
										bottom: "40px",
									},
									padding: "40px",
								}
							}
						}
					}
				},
				changes: {
					'client-id': {
						768: {
							style: {
								width: "50%",
							}
						},
						1280: {
							style: {
								dimensions: {
									padding: "20px",
								}
							}
						}
					}
				},
				removes: {
					'client-id': {
						768: {
							style: {
								width: "100%",
							}
						}
					}
				}
			} );
			const action = {
				type: 'SAVE_BLOCK',
				clientId: 'client-id',
			}

			const check = {
				... state,
				saves: {
					'client-id': {
						768: {
							style: {
								width: "50%",
								dimensions: {
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
						},
						1280: {
							style: {
								dimensions: {
									margin: {
										top: "40px",
										bottom: "40px",
									},
									padding: "20px",
								}
							}
						}
					}
				},
				changes: {},
				removes: {},
				valids: {
					'client-id': {
						0: {},
						375: {},
						768: {
							style: {
								width: "50%",
								dimensions: {
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
						},
						1280: {
							style: {
								width: "50%",
								dimensions: {
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
			}
			const result = saveBlock( state, action );

			expect( result ).toStrictEqual( check );
		} );

		test( 'can clearBlocks()', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				viewports: {
					768: 'Tablet',
					1280: 'Desktop',
				},
				init: {
					'client-id': true,
				},
				defaults: {
					'client-id': {
						style: {
							width: 'auto',
						}
					},
				},
				saves: {
					'client-id': {
						768: {
							style: {
								width: '100%',
							}
						}
					}
				},
				changes: {
					'client-id': {
						768: {
							style: {
								width: '50%',
							}
						}
					}
				},
				valids: {
					'client-id': {
						0: {
							style: {
								width: 'auto',
							}
						},
						768: {
							style: {
								width: '50%',
							}
						},
						1280: {
							style: {
								width: '50%',
							}
						},
					}
				}
			} );
			const action = {
				type: 'CLEAR_BLOCKS',
			}

			const check = {
				... state,
				init: {},
				defaults: {},
				saves: {},
				changes: {},
				removes: {},
				valids: {},
			}
			const result = clearBlocks( state, action );

			expect( result ).toStrictEqual( check );
		} );

		test( 'can registerRenderer() on existing property with different priorities', () => {
			const callback1 = () => {};
			const callback2 = () => {};

			const state = deepFreeze( {
				... DEFAULT_STATE,
				renderer: {
					foo: {
						1: {
							callback: callback1,
							selectorPanel: '.panel',
						}
					}
				}
			} );
			const action = {
				type: 'REGISTER_RENDERER',
				prop: 'foo',
				callback: callback2,
				priority: 10,
				selectorPanel: '.custom-panel',
			}

			const check = {
				... state,
				renderer: {
					foo: {
						1: {
							callback: callback1,
							selectorPanel: '.panel',
						},
						10: {
							callback: callback2,
							selectorPanel: '.custom-panel',
						}
					}
				}
			}
			const result = registerRenderer( state, action );

			expect( result ).toStrictEqual( check );
		} );

		test( 'can registerRenderer() on existing property with same priority', () => {
			const callback1 = () => {};
			const callback2 = () => {};

			const state = deepFreeze( {
				... DEFAULT_STATE,
				renderer: {
					foo: {
						1: {
							callback: callback1,
							selectorPanel: '.panel',
						}
					}
				}
			} );
			const action = {
				type: 'REGISTER_RENDERER',
				prop: 'foo',
				callback: callback2,
				priority: 1,
				selectorPanel: '.custom-panel',
			}

			const check = {
				... state,
				renderer: {
					foo: {
						1: {
							callback: callback2,
							selectorPanel: '.custom-panel',
						}
					}
				}
			}
			const result = registerRenderer( state, action );

			expect( result ).toStrictEqual( check );
		} );
	} );
} );