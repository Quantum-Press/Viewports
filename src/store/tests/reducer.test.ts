// Import preparement dependencies.
import * as data from '@wordpress/data';
import * as element from '@wordpress/element';
import * as styleEngine from '@wordpress/style-engine';
import deepFreeze from 'deep-freeze';

// Extend global window object.
global.window[ 'wp' ] = {
	data,
	element,
	styleEngine
};

// Import test environment.
import { describe, expect, test } from '@jest/globals';

// Import store parts.
import { DEFAULT_STATE } from '..';

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
	removeBlock,
	restoreBlockSaves,
	saveBlock,
	clearBlocks,
	registerRenderer,
} from '../reducer';
import {
	State,
	Action
} from '../../types';


describe( 'test store reducers', () => {

	describe( 'viewports', () => {
		test( 'can setViewports()', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				viewports: {
					0: 'Default',
					375: 'Mobile',
					768: 'Tablet',
					1360: 'Desktop',
				}
			} ) as State;
			const action = {
				type: 'SET_VIEWPORTS',
				viewports: {
					300: 'Mobile small',
					1920: 'Desktop large',
				}
			} as Action;

			const check = {
				... DEFAULT_STATE,
				viewports: {
					0: 'Default',
					300: 'Mobile small',
					375: 'Mobile',
					768: 'Tablet',
					1360: 'Desktop',
					1920: 'Desktop large',
				}
			} as State;
			const result = setViewports( state, action );

			expect( result ).toStrictEqual( check );
		} );

		test( 'can setViewport() with inactive viewport simulation', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				viewport: 1360,
				isActive: false,
			} ) as State;
			const action = {
				type: 'SET_VIEWPORT',
				viewport: 1360,
			} as Action;

			const check = {
				... DEFAULT_STATE,
				viewport: 1360,
				isEditing: true,
			} as State;
			const result = setViewport( state, action );

			expect( result ).toStrictEqual( check );
		} );

		test( 'can setViewport() with active viewport simulation', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				viewport: 1360,
				isActive: true,
			} ) as State;
			const action = {
				type: 'SET_VIEWPORT',
				viewport: 1024,
			} as Action;

			const check = {
				... DEFAULT_STATE,
				viewport: 1024,
				isActive: true,
				isEditing: true,
			} as State;
			const result = setViewport( state, action );

			expect( result ).toStrictEqual( check );
		} );

		test( 'can setDesktop() with invalid viewport', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				viewport: 768,
				desktop: 1360,
			} ) as State;
			const action = {
				type: 'SET_DESKTOP',
			} as Action;

			const check = {
				... DEFAULT_STATE,
				viewport: 768,
				desktop: 1360,
			} as State;
			const result = setDesktop( state, action );

			expect( result ).toStrictEqual( check );
		} );

		test( 'can setDesktop() with valid viewport', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				viewport: 1920,
				desktop: 1360,
			} ) as State;
			const action = {
				type: 'SET_DESKTOP',
			} as Action;

			const check = {
				... DEFAULT_STATE,
				viewport: 1920,
				desktop: 1920,
			} as State;
			const result = setDesktop( state, action );

			expect( result ).toStrictEqual( check );
		} );

		test( 'can setTablet() with invalid viewport', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				viewport: 375,
				tablet: 768,
			} ) as State;
			const action = {
				type: 'SET_TABLET',
			} as Action;

			const check = {
				... DEFAULT_STATE,
				viewport: 375,
				tablet: 768,
			} as State;
			const result = setTablet( state, action );

			expect( result ).toStrictEqual( check );
		} );

		test( 'can setTablet() with valid viewport', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				viewport: 1024,
				tablet: 768,
			} ) as State;
			const action = {
				type: 'SET_TABLET',
			} as Action;

			const check = {
				... DEFAULT_STATE,
				viewport: 1024,
				tablet: 1024,
			} as State;
			const result = setTablet( state, action );

			expect( result ).toStrictEqual( check );
		} );

		test( 'can setMobile() with invalid viewport', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				viewport: 780,
				mobile: 360,
			} ) as State;
			const action = {
				type: 'SET_MOBILE',
			} as Action;

			const check = {
				... DEFAULT_STATE,
				viewport: 780,
				mobile: 360,
			} as State;
			const result = setMobile( state, action );

			expect( result ).toStrictEqual( check );
		} );

		test( 'can setMobile() with valid viewport', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				viewport: 320,
				mobile: 375,
			} ) as State;
			const action = {
				type: 'SET_MOBILE',
			} as Action;

			const check = {
				... DEFAULT_STATE,
				viewport: 320,
				mobile: 320,
			} as State;
			const result = setMobile( state, action );

			expect( result ).toStrictEqual( check );
		} );

		test( 'can setReady()', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				isReady: false,
			} ) as State;
			const action = {
				type: 'SET_READY',
			} as Action;

			const check = {
				... DEFAULT_STATE,
				isReady: true,
			} as State;
			const result = setReady( state, action );

			expect( result ).toStrictEqual( check );
		} );

		test( 'can setLoading()', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				isLoading: false,
			} ) as State;
			const action = {
				type: 'SET_LOADING',
			} as Action;

			const check = {
				... DEFAULT_STATE,
				isLoading: true,
			} as State;
			const result = setLoading( state, action );

			expect( result ).toStrictEqual( check );
		} );

		test( 'can unsetLoading()', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				isLoading: true,
			} ) as State;
			const action = {
				type: 'UNSET_LOADING',
			} as Action;

			const check = {
				... DEFAULT_STATE,
				isLoading: false,
			} as State;
			const result = unsetLoading( state, action );

			expect( result ).toStrictEqual( check );
		} );

		test( 'can setSaving()', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				isSaving: false,
			} ) as State;
			const action = {
				type: 'SET_SAVING',
			} as Action;

			const check = {
				... DEFAULT_STATE,
				isSaving: true,
			} as State;
			const result = setSaving( state, action );

			expect( result ).toStrictEqual( check );
		} );

		test( 'can unsetSaving()', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				isSaving: true,
			} ) as State;
			const action = {
				type: 'UNSET_SAVING',
			} as Action;

			const check = {
				... DEFAULT_STATE,
				isSaving: false,
			} as State;
			const result = unsetSaving( state, action );

			expect( result ).toStrictEqual( check );
		} );

		test( 'can setAutoSaving()', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				isAutoSaving: false,
			} ) as State;
			const action = {
				type: 'SET_AUTOSAVING',
			} as Action;

			const check = {
				... DEFAULT_STATE,
				isAutoSaving: true,
			} as State;
			const result = setAutoSaving( state, action );

			expect( result ).toStrictEqual( check );
		} );

		test( 'can unsetAutoSaving()', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				isAutoSaving: true,
			} ) as State;
			const action = {
				type: 'UNSET_AUTOSAVING',
			} as Action;

			const check = {
				... DEFAULT_STATE,
				isAutoSaving: false,
			} as State;
			const result = unsetAutoSaving( state, action );

			expect( result ).toStrictEqual( check );
		} );

		test( 'can setActive() without loading and with preselected viewport', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				isLoading: false,
				isActive: false,
				viewport: 1360,
			} ) as State;
			const action = {
				type: 'SET_ACTIVE',
			} as Action;

			const check = {
				... DEFAULT_STATE,
				isLoading: false,
				isActive: true,
				isEditing: true,
				viewport: 1360,
			} as State;
			const result = setActive( state, action );

			expect( result ).toStrictEqual( check );
		} );

		test( 'can unsetActive()', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				isActive: true,
				viewport: 1360,
			} ) as State;
			const action = {
				type: 'UNSET_ACTIVE',
			} as Action;

			const check = {
				... DEFAULT_STATE,
				isActive: false,
				viewport: 1360,
			} as State;
			const result = unsetActive( state, action );

			expect( result ).toStrictEqual( check );
		} );

		test( 'can setInspecting()', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				isInspecting: false,
			} ) as State;
			const action = {
				type: 'SET_INSPECTING',
			} as Action;

			const check = {
				... DEFAULT_STATE,
				isInspecting: true,
			} as State;
			const result = setInspecting( state, action );

			expect( result ).toStrictEqual( check );
		} );

		test( 'can unsetInspecting()', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				isInspecting: true,
			} ) as State;
			const action = {
				type: 'UNSET_INSPECTING',
			} as Action;

			const check = {
				... DEFAULT_STATE,
				isInspecting: false,
			} as State;
			const result = unsetInspecting( state, action );

			expect( result ).toStrictEqual( check );
		} );

		test( 'can setInspectorPosition() to right', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				inspectorPosition: 'left',
			} ) as State;
			const action = {
				type: 'SET_INSPECTOR_POSITION',
				position: 'right',
			} as Action;

			const check = {
				... DEFAULT_STATE,
				inspectorPosition: 'right',
			} as State;
			const result = setInspectorPosition( state, action );

			expect( result ).toStrictEqual( check );
		} );

		test( 'can toggleActive() toggle inactive status', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				isActive: false,
			} ) as State;
			const action = {
				type: 'TOGGLE_ACTIVE',
			} as Action;

			const check = {
				... DEFAULT_STATE,
				isActive: true,
				isEditing: true,
			} as State;
			const result = toggleActive( state, action );

			expect( result ).toStrictEqual( check );
		} );

		test( 'can toggleActive() toggle active status', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				isActive: true,
				viewport: 1360,
			} ) as State;
			const action = {
				type: 'TOGGLE_ACTIVE',
			} as Action;

			const check = {
				... DEFAULT_STATE,
				isActive: false,
				isEditing: true,
				viewport: 1360,
			} as State;
			const result = toggleActive( state, action );

			expect( result ).toStrictEqual( check );
		} );

		test( 'can toggleDesktop()', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				viewport: 375,
				desktop: 1360,
			} ) as State;
			const action = {
				type: 'TOGGLE_DESKTOP',
			} as Action;

			const check = {
				... DEFAULT_STATE,
				isEditing: true,
				viewport: 1360,
				desktop: 1360,
			} as State;
			const result = toggleDesktop( state, action );

			expect( result ).toStrictEqual( check );
		} );

		test( 'can toggleTablet()', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				viewport: 375,
				tablet: 768,
			} ) as State;
			const action = {
				type: 'TOGGLE_TABLET',
			} as Action;

			const check = {
				... DEFAULT_STATE,
				isEditing: true,
				viewport: 768,
				tablet: 768,
			} as State;
			const result = toggleTablet( state, action );

			expect( result ).toStrictEqual( check );
		} );

		test( 'can toggleMobile()', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				viewport: 768,
				mobile: 375,
			} ) as State;
			const action = {
				type: 'TOGGLE_MOBILE',
			} as Action;

			const check = {
				... DEFAULT_STATE,
				isEditing: true,
				viewport: 375,
				mobile: 375,
			} as State;
			const result = toggleMobile( state, action );

			expect( result ).toStrictEqual( check );
		} );
	} );



	describe( 'styles', () => {
		test( 'can registerBlockInit() without clientId and without attributes', () => {
			const state = {
				... DEFAULT_STATE,
				viewports: {
					0: 'Default',
					375: 'Mobile',
					768: 'Tablet',
					1280: 'Desktop',
				},
				init: {},
				saves: {},
				valids: {},
			} as State;
			const action = {
				type: 'REGISTER_BLOCK_INIT',
				clientId: '',
				attributes: {},
			} as Action;

			const check = {
				... state,
				init: {},
				saves: {},
				valids: {}
			} as State;
			const result = registerBlockInit( state, action );

			// Ignore css, inlineStyle and spectrum sets to debug in generator.test.ts
			result.cssSet = check.cssSet;
			result.inlineStyleSets = check.inlineStyleSets;
			result.spectrumSets = check.spectrumSets;

			expect( result ).toEqual( check );
		} );

		test( 'can registerBlockInit() with clientId and without attributes', () => {
			const state = {
				... DEFAULT_STATE,
				viewports: {
					0: 'Default',
					375: 'Mobile',
					768: 'Tablet',
					1280: 'Desktop',
				},
				init: {},
				saves: {},
				valids: {},
			} as State;
			const action = {
				type: 'REGISTER_BLOCK_INIT',
				clientId: 'client-id',
				attributes: {},
			} as Action;

			const check = {
				... state,
				init: {
					'client-id': true,
				},
				saves: {
					'client-id': {
						0: {
							style: {}
						}
					}
				},
				valids: {
					'client-id': {
						0: {
							style: {},
						},
						375: {
							style: {},
						},
						768: {
							style: {},
						},
						1280: {
							style: {},
						},
					}
				}
			} as State;
			const result = registerBlockInit( state, action );

			// Ignore css, inlineStyle and spectrum sets to debug in generator.test.ts
			result.cssSet = check.cssSet;
			result.inlineStyleSets = check.inlineStyleSets;
			result.spectrumSets = check.spectrumSets;

			expect( result ).toEqual( check );
		} );

		test( 'can registerBlockInit() with clientId and with attributes', () => {
			const state = {
				... DEFAULT_STATE,
				viewports: {
					0: 'Default',
					375: 'Mobile',
					768: 'Tablet',
					1280: 'Desktop',
				},
				init: {},
				saves: {},
				valids: {},
			} as State;
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
			} as Action;

			const check = {
				... state,
				init: {
					'client-id': true,
				},
				saves: {
					'client-id': {
						0: {
							style: {
								dimensions: {
									padding: 0,
									margin: 0,
								}
							}
						}
					}
				},
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
			} as State;
			const result = registerBlockInit( state, action );

			// Ignore css, inlineStyle and spectrum sets to debug in generator.test.ts
			result.cssSet = check.cssSet;
			result.inlineStyleSets = check.inlineStyleSets;
			result.spectrumSets = check.spectrumSets;

			expect( result ).toEqual( check );
		} );

		test( 'can updateBlockChanges() with saves, changes and single added attribute', () => {
			const state = {
				... DEFAULT_STATE,
				iframeViewport: 1280,
				viewports: {
					0: 'Default',
					375: 'Mobile',
					768: 'Tablet',
					1280: 'Desktop',
				},
				valids: {
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
										top: '40px',
										bottom: '40px',
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
			} as State;

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
			} as Action;

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
						0: {
							style: {},
						},
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
			} as State;
			const result = updateBlockChanges( state, action );

			// Ignore css, inlineStyle and spectrum sets to debug in generator.test.ts
			result.cssSet = check.cssSet;
			result.inlineStyleSets = check.inlineStyleSets;
			result.spectrumSets = check.spectrumSets;

			expect( result ).toEqual( check );
		} );

		test( 'can updateBlockChanges() with saves, changes and multi changed attributes', () => {
			const state = {
				... DEFAULT_STATE,
				iframeViewport: 1280,
				viewports: {
					0: 'Default',
					375: 'Mobile',
					768: 'Tablet',
					1280: 'Desktop',
				},
				valids: {
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
										top: '40px',
										bottom: '40px',
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
			} as State;

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
			} as Action;

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
						0: {
							style: {},
						},
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
									padding: "80px",
								}
							}
						}
					}
				}
			} as State;
			const result = updateBlockChanges( state, action );

			// Ignore css, inlineStyle and spectrum sets to debug in generator.test.ts
			result.cssSet = check.cssSet;
			result.inlineStyleSets = check.inlineStyleSets;
			result.spectrumSets = check.spectrumSets;

			expect( result ).toEqual( check );
		} );

		test( 'can updateBlockChanges() with saves, changes and multi changed attributes including arrays', () => {
			const state = {
				... DEFAULT_STATE,
				iframeViewport: 1280,
				viewports: {
					0: 'Default',
					375: 'Mobile',
					768: 'Tablet',
					1280: 'Desktop',
				},
				valids: {
					'client-id': {
						0: {
							style: {},
						},
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
			} as State;
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
			} as Action;

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
						0: {
							style: {},
						},
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
					}
				}
			} as State;
			const result = updateBlockChanges( state, action );

			// Ignore css, inlineStyle and spectrum sets to debug in generator.test.ts
			result.cssSet = check.cssSet;
			result.inlineStyleSets = check.inlineStyleSets;
			result.spectrumSets = check.spectrumSets;

			expect( result ).toEqual( check );
		} );

		test( 'can removeBlock()', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				init: {
					'client-id': true,
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
			} ) as State;
			const action = {
				type: 'REMOVE_BLOCK',
				clientId: 'client-id',
			} as Action;

			const check = {
				... DEFAULT_STATE,
				init: {},
				saves: {},
				changes: {},
				valids: {},
			} as State;
			const result = removeBlock( state, action );

			// Ignore css, inlineStyle and spectrum sets to debug in generator.test.ts
			result.cssSet = check.cssSet;
			result.inlineStyleSets = check.inlineStyleSets;
			result.spectrumSets = check.spectrumSets;

			expect( result ).toStrictEqual( check );
		} );

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
							style: {},
						},
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
				},
				changes: {
					'client-id': {
						768: {
							style: {
								dimensions: {
									padding: {
										top: "60px",
										bottom: "60px",
									}
								}
							}
						},
						1280: {
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
							style: {
								dimensions: {
									padding: {
										top: "60px",
										bottom: "60px",
									}
								}
							}
						},
					}
				},
				valids: {
					'client-id': {
						0: {
							style: {}
						},
						375: {
							style: {}
						},
						768: {
							style: {
								dimensions: {
									padding: {
										top: "60px",
										bottom: "60px",
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
				},
				changes: {
					'client-id': {
						768: {
							style: {
								dimensions: {
									padding: {
										top: "60px",
										bottom: "60px",
									}
								}
							}
						},
						1280: {
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
			} as State;
			const action = {
				type: 'RESTORE_BLOCK_SAVES',
				clientId: 'client-id',
				viewport: 1280,
				props: [ 'dimensions' ],
			} as Action;

			const check = {
				... state,
				changes: {
					'client-id': {
						768: {
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
				},
				valids: {
					'client-id': {
						0: {
							style: {},
						},
						375: {
							style: {},
						},
						768: {
							style: {
								dimensions: {
									padding: {
										top: "60px",
										bottom: "60px",
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
						},
						1280: {
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
				},
				changes: {
					'client-id': {
						768: {
							style: {
								dimensions: {
									width: "50%",
								},
							}
						},
						1280: {
							style: {
								spacing: {
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
								dimensions: {
									width: "100%",
								},
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
						},
						1280: {
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
				},
				changes: {},
				removes: {},
				valids: {
					'client-id': {
						0: {
							style: {}
						},
						375: {
							style: {}
						},
						768: {
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
						},
						1280: {
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
				},
			} as State;
			const result = saveBlock( state, action );

			// Ignore css, inlineStyle and spectrum sets to debug in generator.test.ts
			result.cssSet = check.cssSet;
			result.inlineStyleSets = check.inlineStyleSets;
			result.spectrumSets = check.spectrumSets;

			expect( result ).toEqual( check );
		} );

		test( 'can clearBlocks()', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				viewports: {
					0: 'Default',
					768: 'Tablet',
					1280: 'Desktop',
				},
				init: {
					'client-id': true,
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
			} ) as State;
			const action = {
				type: 'CLEAR_BLOCKS',
			} as Action;

			const check = {
				... state,
				init: {},
				saves: {},
				changes: {},
				removes: {},
				valids: {},
			} as State;
			const result = clearBlocks( state, action );

			expect( result ).toEqual( check );
		} );

		test( 'can registerRenderer() on existing property with different priorities', () => {
			const callback1 = () => {};
			const callback2 = () => {};

			const state = deepFreeze( {
				... DEFAULT_STATE,
				renderer: {
					foo: {
						1: {
							type: "custom",
							callback: callback1,
							selectors: {
								panel: '.panel',
								label: '.label',
							},
							mapping: {},
						}
					}
				}
			} ) as State;
			const action = {
				type: 'REGISTER_RENDERER',
				prop: 'foo',
				callback: callback2,
				priority: 10,
				selectors: {
					panel: '.custom-panel',
					label: '.custom-label',
				}
			} as Action;

			const check = {
				... state,
				renderer: {
					foo: {
						1: {
							type: "custom",
							callback: callback1,
							selectors: {
								panel: '.panel',
								label: '.label',
							},
							mapping: {},
						},
						10: {
							type: "custom",
							callback: callback2,
							selectors: {
								panel: '.custom-panel',
								label: '.custom-label',
							},
							mapping: {},
						}
					}
				}
			} as State;
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
							selectors: {
								panel: '.panel',
								label: '.label',
							}
						}
					}
				}
			} ) as State;
			const action = {
				type: 'REGISTER_RENDERER',
				prop: 'foo',
				callback: callback2,
				priority: 1,
				selectors: {
					panel: '.custom-panel',
					label: '.custom-label',
				}
			} as Action;

			const check = {
				... state,
				renderer: {
					foo: {
						1: {
							type: "custom",
							callback: callback2,
							selectors: {
								panel: '.custom-panel',
								label: '.custom-label',
							},
							mapping: {},
						}
					}
				}
			} as State;
			const result = registerRenderer( state, action );

			expect( result ).toStrictEqual( check );
		} );
	} );
} );