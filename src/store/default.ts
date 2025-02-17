import type { State, Viewports, ViewportsConfig } from '../types';

const {
	styleEngine: {
		compileCSS,
	}
} = window[ 'wp' ];

declare const qpViewportsConfig: ViewportsConfig | undefined;

function getViewports() : Viewports {
	if ( typeof qpViewportsConfig === 'undefined' ) {
		return {
			1920: 'Quantum - Desktop large',
			1360: 'Quantum - Desktop small',
			780: 'Wordpress - Tablet',
			360: 'Wordpress - Mobile',
			0: 'Default',
		};
	}

	if( 'pro' === qpViewportsConfig.distribution ) {
		return {
			3440: 'Quantum - Desktop xxlarge',
			2560: 'Quantum - Desktop xlarge',
			1920: 'Quantum - Desktop large',
			1650: 'Quantum - Desktop medium',
			1360: 'Quantum - Desktop small',
			1280: 'Quantum - Desktop tiny',
			1180: 'Quantum - Tablet xlarge',
			1024: 'Quantum - Tablet large',
			820: 'Quantum - Tablet medium',
			780: 'Wordpress - Tablet',
			768: 'Quantum - Tablet small',
			540: 'Quantum - Tablet tiny',
			425: 'Quantum - Mobile large',
			375: 'Quantum - Mobile medium',
			360: 'Wordpress - Mobile',
			320: 'Quantum - Mobile small',
			0: 'Default',
		}
	}

	return {
		1920: 'Quantum - Desktop large',
		1360: 'Quantum - Desktop small',
		780: 'Wordpress - Tablet',
		360: 'Wordpress - Mobile',
		0: 'Default',
	};
}


function getDesktopViewport() : number {
	return 1360;
}

function getTabletViewport() : number {
	if ( typeof qpViewportsConfig === 'undefined' ) {
		return 780;
	}

	if( 'pro' === qpViewportsConfig.distribution ) {
		return 768;
	}

	return 780;
}

function getMobileViewport() : number {
	if ( typeof qpViewportsConfig === 'undefined' ) {
		return 360;
	}

	if( 'pro' === qpViewportsConfig.distribution ) {
		return 320;
	}

	return 360;
}


function getDesktopBreakpoint() : number {
	return 1360;
}
function getTabletBreakpoint() : number {
	if ( typeof qpViewportsConfig === 'undefined' ) {
		return 780;
	}

	if( 'pro' === qpViewportsConfig.distribution ) {
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
	init: {},
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