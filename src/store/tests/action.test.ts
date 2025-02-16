// Import test environment.
import { describe, expect, test } from '@jest/globals';

// Import store parts.
import * as actions from '../actions';

// Deconstruct functions to test.
const {
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
	removeBlockSaves,
	restoreBlockSaves,
	saveBlock,
	clearBlocks,
	registerRenderer,
} = actions;


describe( 'store actions', () => {

	test( 'setViewports', () => {
		const viewports = {
			320: 'Mobile',
			768: 'Tablet',
			1280: 'Desktop',
		};
		const check = {
			type: 'SET_VIEWPORTS',
			viewports,
		};
		const result = setViewports( viewports );

		expect( check ).toStrictEqual( result );
	});

	test( 'setViewport', () => {
		const check = {
			type: 'SET_VIEWPORT',
			viewport: 320,
		};
		const result = setViewport( 320 );

		expect( check ).toStrictEqual( result );
	});

	test( 'setDesktop', () => {
		const check = {
			type: 'SET_DESKTOP',
		};
		const result = setDesktop();

		expect( check ).toStrictEqual( result );
	});

	test( 'setTablet', () => {
		const check = {
			type: 'SET_TABLET',
		};
		const result = setTablet();

		expect( check ).toStrictEqual( result );
	});

	test( 'setMobile', () => {
		const check = {
			type: 'SET_MOBILE',
		};
		const result = setMobile();

		expect( check ).toStrictEqual( result );
	});

	test( 'setReady', () => {
		const check = {
			type: 'SET_READY',
		};
		const result = setReady();

		expect( check ).toStrictEqual( result );
	});

	test( 'setLoading', () => {
		const check = {
			type: 'SET_LOADING',
		};
		const result = setLoading();

		expect( check ).toStrictEqual( result );
	});

	test( 'unsetLoading', () => {
		const check = {
			type: 'UNSET_LOADING',
		};
		const result = unsetLoading();

		expect( check ).toStrictEqual( result );
	});

	test( 'setSaving', () => {
		const check = {
			type: 'SET_SAVING',
		};
		const result = setSaving();

		expect( check ).toStrictEqual( result );
	});

	test( 'unsetSaving', () => {
		const check = {
			type: 'UNSET_SAVING',
		};
		const result = unsetSaving();

		expect( check ).toStrictEqual( result );
	});

	test( 'setAutoSaving', () => {
		const check = {
			type: 'SET_AUTOSAVING',
		};
		const result = setAutoSaving();

		expect( check ).toStrictEqual( result );
	});

	test( 'unsetAutoSaving', () => {
		const check = {
			type: 'UNSET_AUTOSAVING',
		};
		const result = unsetAutoSaving();

		expect( check ).toStrictEqual( result );
	});

	test( 'setActive', () => {
		const check = {
			type: 'SET_ACTIVE',
		};
		const result = setActive();

		expect( check ).toStrictEqual( result );
	});

	test( 'unsetActive', () => {
		const check = {
			type: 'UNSET_ACTIVE',
		};
		const result = unsetActive();

		expect( check ).toStrictEqual( result );
	});

	test( 'setInspecting', () => {
		const check = {
			type: 'SET_INSPECTING',
		};
		const result = setInspecting();

		expect( check ).toStrictEqual( result );
	});

	test( 'unsetInspecting', () => {
		const check = {
			type: 'UNSET_INSPECTING',
		};
		const result = unsetInspecting();

		expect( check ).toStrictEqual( result );
	});

	test( 'setInspectorPosition', () => {
		const check = {
			type: 'SET_INSPECTOR_POSITION',
			position: 'right',
		};
		const result = setInspectorPosition( 'right' );

		expect( check ).toStrictEqual( result );
	});

	test( 'toggleActive', () => {
		const check = {
			type: 'TOGGLE_ACTIVE',
		};
		const result = toggleActive();

		expect( check ).toStrictEqual( result );
	});

	test( 'toggleDesktop', () => {
		const check = {
			type: 'TOGGLE_DESKTOP',
		};
		const result = toggleDesktop();

		expect( check ).toStrictEqual( result );
	});

	test( 'toggleTablet', () => {
		const check = {
			type: 'TOGGLE_TABLET',
		};
		const result = toggleTablet();

		expect( check ).toStrictEqual( result );
	});

	test( 'toggleMobile', () => {
		const check = {
			type: 'TOGGLE_MOBILE',
		};
		const result = toggleMobile();

		expect( check ).toStrictEqual( result );
	});

	test( 'registerBlockInit', () => {
		const attributes = {
			styles: {},
			content: '',
		}
		const check = {
			type: 'REGISTER_BLOCK_INIT',
			clientId: 'client-id',
			blockName: 'core/group',
			attributes: attributes,
		};
		const result = registerBlockInit( 'client-id', 'core/group', attributes );

		expect( check ).toStrictEqual( result );
	});

	test( 'updateBlockChanges', () => {
		const attributes = {
			styles: {},
			content: '',
		}
		const check = {
			type: 'UPDATE_BLOCK_CHANGES',
			clientId: 'client-id',
			blockName: 'core/group',
			attributes: attributes,
			viewport: null,
		};
		const result = updateBlockChanges( 'client-id', 'core/group', attributes );

		expect( check ).toStrictEqual( result );
	});


	test( 'removeBlock', () => {
		const check = {
			type: 'REMOVE_BLOCK',
			clientId: 'client-id',
			blockName: 'core/group',
		};
		const result = removeBlock( 'client-id' );

		expect( check ).toStrictEqual( result );
	});

	test( 'restoreBlockSaves', () => {
		const props = []
		const check = {
			type: 'RESTORE_BLOCK_SAVES',
			clientId: 'client-id',
			blockName: 'core/group',
			props: props,
			viewport: 320,
		};
		const result = restoreBlockSaves( 'client-id', 'core/group', props, 320 );

		expect( check ).toStrictEqual( result );
	});

	test( 'removeBlockSaves', () => {
		const props = []
		const check = {
			type: 'REMOVE_BLOCK_SAVES',
			clientId: 'client-id',
			blockName: 'core/group',
			props: props,
			viewport: 320,
		};
		const result = removeBlockSaves( 'client-id', 'core/group', props, 320 );

		expect( check ).toStrictEqual( result );
	});

	test( 'saveBlock', () => {
		const check = {
			type: 'SAVE_BLOCK',
			clientId: 'client-id',
			blockName: 'core/group',
		};
		const result = saveBlock( 'client-id', 'core/group' );

		expect( check ).toStrictEqual( result );
	});

	test( 'clearBlocks', () => {
		const check = {
			type: 'CLEAR_BLOCKS',
		};
		const result = clearBlocks();

		expect( check ).toStrictEqual( result );
	});

	test( 'registerRenderer', () => {
		const callback = () => {};
		const check = {
			type: 'REGISTER_RENDERER',
			prop: 'style-key',
			callback: callback,
			selectors: {
				panel: '.panel',
				label: '.label',
			},
			mapping: {},
			priority: 10,
		};
		const result = registerRenderer( 'style-key', callback, 10, {
			panel: '.panel',
			label: '.label',
		} );

		expect( check ).toStrictEqual( result );
	});

} );