import type { State } from './types';

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
	viewports: {
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
	},
	viewport: 0,
	isRegistering: false,
	isReady: false,
	isActive: false,
	isInspecting: false,
	inspectorPosition: 'left',
	isEditing: false,
	isSaving: false,
	isAutoSaving: false,
	isLoading: false,
	desktop: 1360,
	tablet: 768,
	mobile: 375,
	init: {},
	defaults: {},
	saves: {},
	changes: {},
	removes: {},
	valids: {},
	inspect: false,
	lastEdit: 0,
	renderer:  {},
} as State;