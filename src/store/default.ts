import type { State, Viewports, ViewportsConfig } from '../types';

const {
	styleEngine: {
		compileCSS,
	}
} = window[ 'wp' ];

declare const viewportsConfig: ViewportsConfig | undefined;

function getViewports() : Viewports {
	if ( typeof viewportsConfig === 'undefined' ) {
		return {
			1920: 'VP - Desktop large',
			1360: 'VP - Desktop small',
			780: 'Wordpress - Tablet',
			360: 'Wordpress - Mobile',
			0: 'Default',
		};
	}

	if( 'extended' === viewportsConfig.distribution ) {
		return {
			3440: 'VP - Desktop xxlarge',
			2560: 'VP - Desktop xlarge',
			1920: 'VP - Desktop large',
			1650: 'VP - Desktop medium',
			1360: 'VP - Desktop small',
			1280: 'VP - Desktop tiny',
			1180: 'VP - Tablet xlarge',
			1024: 'VP - Tablet large',
			820: 'VP - Tablet medium',
			780: 'Wordpress - Tablet',
			768: 'VP - Tablet small',
			540: 'VP - Tablet tiny',
			425: 'VP - Mobile large',
			375: 'VP - Mobile medium',
			360: 'Wordpress - Mobile',
			320: 'VP - Mobile small',
			0: 'Default',
		}
	}

	return {
		1920: 'VP - Desktop large',
		1360: 'VP - Desktop small',
		780: 'Wordpress - Tablet',
		360: 'Wordpress - Mobile',
		0: 'Default',
	};
}


function getDesktopViewport() : number {
	return 1360;
}

function getTabletViewport() : number {
	if ( typeof viewportsConfig === 'undefined' ) {
		return 780;
	}

	if( 'extended' === viewportsConfig.distribution ) {
		return 768;
	}

	return 780;
}

function getMobileViewport() : number {
	if ( typeof viewportsConfig === 'undefined' ) {
		return 360;
	}

	if( 'extended' === viewportsConfig.distribution ) {
		return 320;
	}

	return 360;
}


function getDesktopBreakpoint() : number {
	return 1360;
}
function getTabletBreakpoint() : number {
	if ( typeof viewportsConfig === 'undefined' ) {
		return 780;
	}

	if( 'extended' === viewportsConfig.distribution ) {
		return 540;
	}

	return 780;
}

/**
 * The default store settings
 *
 * @property {boolean}       viewports      List of default viewports paired by int: title
 * @property {mixed}         viewport       Actual selected viewport int or 'full'
 * @property {integer}       viewport       Actual selected viewport
 * @property {boolean}       isActive       Indicates whether we simulate viewports
 * @property {boolean}       isSaving       Indicates whether we are in save process
 * @property {boolean}       isLoading      Indicates whether we are loading simulation
 * @property {integer}       desktop        Actual int value for a desktop viewport
 * @property {integer}       tablet         Actual int value for a tablet viewport
 * @property {integer}       mobile         Actual int value for a mobile viewport
 * @property {object}        init           Object with clientId based flags to indicate its block initialization
 * @property {object}        saves          Object with clientId based viewport styles that represents actual block save state
 * @property {object}        changes        Object with clientId based viewport styles that represents actual block changes state
 * @property {object}        defaults       Object with clientId based viewport styles that represents actual block default state
 * @property {object}        removes        Object with clientId based viewport styles that represents actual block removes state
 * @property {object}        valids         Object with clientId based viewport styles that represents actual block valids state
 * @property {mixed}         inspect        Boolean false or object containing block props
 * @property {integer}       lastEdit       Contains last edit timestamp to keep interface up to date.
 * @property {object}        renderer       Object with property key based style renderer functions
 */
export const DEFAULT_STATE = {
	viewports: getViewports(),
	viewport: 0,
	iframeSize: {
		width: 0,
		height: 0,
	},
	iframeViewport: 0,
	isRegistering: false,
	isReady: false,
	isActive: false,
	isInspecting: false,
	inspectorPosition: 'right',
	isEditing: false,
	isSaving: false,
	isAutoSaving: false,
	isLoading: false,
	desktop: getDesktopViewport(),
	tablet: getTabletViewport(),
	mobile: getMobileViewport(),
	saves: {},
	changes: {},
	removes: {},
	valids: {},
	inspect: false,
	lastEdit: 0,
	renderer: {
		background: {
			5: {
				type: 'wp',
				callback: compileCSS,
				selectors: {
					label: '.background-block-support-panel .components-tools-panel-header',
					panel: '.background-block-support-panel',
				},
				mapping: {},
			},
		},
		border: {
			5: {
				type: 'wp',
				callback: compileCSS,
				selectors: {
					label: '.border-block-support-panel .components-tools-panel-header',
					panel: '.border-block-support-panel',
				},
				mapping: {
					'core/image': '> img',
				},
			},
		},
		dimensions: {
			5: {
				type: 'wp',
				callback: compileCSS,
				selectors: {
					label: '.dimensions-block-support-panel .components-tools-panel-item.last .block-editor-height-control',
					panel: '.dimensions-block-support-panel .components-tools-panel-item.last',
				},
				mapping: {},
			},
		},
		shadow: {
			5: {
				type: 'wp',
				callback: compileCSS,
				selectors: {
					label: '.border-block-support-panel .components-tools-panel-header',
					panel: '.border-block-support-panel',
				},
				mapping: {
					'core/image': '> img',
				},
			},
		},
		spacing: {
			5: {
				type: 'wp',
				callback: compileCSS,
				selectors: {
					label: '.dimensions-block-support-panel .components-tools-panel-header',
					panel: '.dimensions-block-support-panel .components-tools-panel-item.tools-panel-item-spacing',
				},
				mapping: {},
			},
		},
	},
	cssSet: {},
	ruleSets: {},
	spectrumSets: {},
	inlineStyleSets: {},

} as State;

export const mobileDefaultViewport = getMobileViewport();
export const tabletDefaultViewport = getTabletViewport();
export const desktopDefaultViewport = getDesktopViewport();

export const tabletBreakpoint = getTabletBreakpoint();
export const desktopBreakpoint = getDesktopBreakpoint();