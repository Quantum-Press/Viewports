import type { Attributes } from '../utils/types';
import type { State } from './types';

import { getMergedAttributes } from '../utils/attributes';
import {
	isInMobileRange,
	isInTabletRange,
	isInDesktopRange,
	clearEmptySaves,
} from './utils';

const { isObject } = window[ 'lodash' ];

/**
 * Set selector to return viewports.
 *
 * @param {object} state current
 *
 * @since 0.1.0
 *
 * @return {object} viewports
 */
export const getViewports = ( state : State ) : object => {
	return state.viewports;
};


/**
 * Set selector to return active viewport.
 *
 * @param {object} state current
 *
 * @since 0.1.0
 *
 * @return {integer} viewport
 */
export const getViewport = ( state : State ) : number => {
	if( 0 === state.viewport ) {
		return document.querySelector( '.components-resizable-box__container, .edit-post-visual-editor' )?.getBoundingClientRect().width;
	}

	return state.viewport;
};


/**
 * Set selector to return desktop viewport.
 *
 * @param {object} state current
 *
 * @since 0.1.0
 *
 * @return {integer} desktop viewport
 */
export const getDesktop = ( state : State ) : number => {
	return state.desktop;
};


/**
 * Set selector to return tablet viewport.
 *
 * @param {object} state current
 *
 * @since 0.1.0
 *
 * @return {integer} tablet viewport
 */
export const getTablet = ( state : State ) : number => {
	return state.tablet;
};


/**
 * Set selector to return mobile viewport.
 *
 * @param {object} state current
 *
 * @since 0.1.0
 *
 * @return {integer} mobile viewport
 */
export const getMobile = ( state : State ) : number => {
	return state.mobile;
};


/**
 * Set selector to return isRegistering indicator.
 *
 * @param {object} state current
 *
 * @since 0.1.0
 *
 * @return {boolean}
 */
export const isRegistering = ( state : State ) : boolean => {
	return state.isRegistering;
};


/**
 * Set selector to return isReady indicator.
 *
 * @param {object} state current
 *
 * @since 0.1.0
 *
 * @return {boolean}
 */
export const isReady = ( state : State ) : boolean => {
	return state.isReady;
};


/**
 * Set selector to return isLoading indicator.
 *
 * @param {object} state current
 *
 * @since 0.1.0
 *
 * @return {boolean}
 */
export const isLoading = ( state : State ) : boolean => {
	return state.isLoading;
};


/**
 * Set selector to return isSaving indicator.
 *
 * @param {object} state current
 *
 * @since 0.1.0
 *
 * @return {boolean}
 */
export const isSaving = ( state : State ) : boolean => {
	return state.isSaving;
};


/**
 * Set selector to return isAutoSaving indicator.
 *
 * @param {object} state current
 *
 * @since 0.1.0
 *
 * @return {boolean}
 */
export const isAutoSaving = ( state : State ) : boolean => {
	return state.isAutoSaving;
};


/**
 * Set selector to return isActive indicator.
 *
 * @param {object} state current
 *
 * @since 0.1.0
 *
 * @return {boolean}
 */
export const isActive = ( state : State ) : boolean => {
	return state.isActive;
};


/**
 * Set selector to return isExpanded indicator.
 *
 * @param {object} state current
 *
 * @since 0.1.0
 *
 * @return {boolean}
 */
export const isExpanded = ( state : State ) : boolean => {
	return state.isExpanded;
};


/**
 * Set selector to return isEditing indicator.
 *
 * @param {object} state current
 *
 * @since 0.1.0
 *
 * @return {boolean}
 */
export const isEditing = ( state : State ) : boolean => {
	return state.isEditing;
};


/**
 * Set selector to indicate inDesktopRange.
 *
 * @param {object} state current
 *
 * @since 0.1.0
 *
 * @return {boolean}
 */
export const inDesktopRange = ( state : State ) : boolean => {
	return isInDesktopRange( state.viewport );
};


/**
 * Set selector to indicate inTabletRange.
 *
 * @param {object} state current
 *
 * @since 0.1.0
 *
 * @return {boolean}
 */
export const inTabletRange = ( state : State ) : boolean => {
	return isInTabletRange( state.viewport );
};


/**
 * Set selector to indicate inMobileRange.
 *
 * @param {object} state current
 *
 * @since 0.1.0
 *
 * @return {boolean}
 */
export const inMobileRange = ( state : State ) : boolean => {
	return isInMobileRange( state.viewport );
};


/**
 * Set selector to indicate hasBlockViewports.
 *
 * @param {object} state current
 * @param {string} clientId
 *
 * @since 0.1.0
 *
 * @return {boolean}
 */
export const hasBlockViewports = ( state : State, clientId : string ) : boolean => {
	const hasSaves = state.saves.hasOwnProperty( clientId ) && Object.keys( state.saves[ clientId ] ).length ? true : false;
	const hasChanges = state.changes.hasOwnProperty( clientId ) && Object.keys( state.changes[ clientId ] ).length ? true : false;
	const hasRemoves = state.removes.hasOwnProperty( clientId ) && Object.keys( state.removes[ clientId ] ).length ? true : false;

	if( hasSaves || hasChanges || hasRemoves ) {
		return true;
	}

	return false;
};


/**
 * Set selector to indicate hasBlockDefaults.
 *
 * @param {object} state current
 * @param {string} clientId
 *
 * @since 0.1.0
 *
 * @return {boolean}
 */
export const hasBlockDefaults = ( state : State, clientId : string ) : boolean => {
	return state.defaults.hasOwnProperty( clientId ) && isObject( state.defaults[ clientId ] ) && state.defaults[ clientId ].hasOwnProperty( 'style' ) && isObject( state.defaults[ clientId ][ 'style' ] ) && Object.keys( state.defaults[ clientId ][ 'style' ] ).length ? true : false;
};


/**
 * Set selector to indicate hasBlockSaves.
 *
 * @param {object} state current
 * @param {string} clientId
 *
 * @since 0.1.0
 *
 * @return {boolean}
 */
export const hasBlockSaves = ( state : State, clientId : string ) : boolean => {
	return state.saves.hasOwnProperty( clientId ) && isObject( state.saves[ clientId ] ) && Object.keys( state.saves[ clientId ] ).length ? true : false;
};


/**
 * Set selector to indicate hasBlockChanges.
 *
 * @param {object} state current
 * @param {string} clientId
 *
 * @since 0.1.0
 *
 * @return {boolean}
 */
export const hasBlockChanges = ( state : State, clientId : string ) : boolean => {
	return state.changes.hasOwnProperty( clientId ) && isObject( state.changes[ clientId ] ) && Object.keys( state.changes[ clientId ] ).length ? true : false;
};


/**
 * Set selector to indicate hasBlockValids.
 *
 * @param {object} state current
 * @param {string} clientId
 *
 * @since 0.1.0
 *
 * @return {boolean}
 */
export const hasBlockValids = ( state : State, clientId : string ) : boolean => {
	return state.valids.hasOwnProperty( clientId ) && isObject( state.valids[ clientId ] ) && Object.keys( state.valids[ clientId ] ).length ? true : false;
};


/**
 * Set selector to indicate hasBlockRemoves.
 *
 * @param {object} state current
 * @param {string} clientId
 *
 * @since 0.1.0
 *
 * @return {boolean}
 */
export const hasBlockRemoves = ( state : State, clientId : string ) : boolean => {
	return state.removes.hasOwnProperty( clientId ) && Object.keys( state.removes[ clientId ] ).length ? true : false;
};


/**
 * Set selector to return all saves.
 *
 * @param {object} state current
 *
 * @since 0.1.0
 *
 * @return {object} saves
 */
export const getSaves = ( state : State ) : object => {
	return state.saves;
};


/**
 * Set selector to return saves from a single block.
 *
 * @param {object} state current
 * @param {string} clientId
 *
 * @since 0.1.0
 *
 * @return {object} block saves
 */
export const getBlockSaves = ( state : State, clientId : string ) : object => {
	if( state.saves.hasOwnProperty( clientId ) ) {
		return state.saves[ clientId ];
	}

	return {};
};


/**
 * Set selector to return new generated saves from a single block.
 *
 * @param {object} state current
 * @param {string} clientId
 *
 * @since 0.1.0
 *
 * @return {object} block saves
 */
export const getGeneratedBlockSaves = ( state : State, clientId : string ) : object => {
	let blockChanges = state.changes.hasOwnProperty( clientId ) ? state.changes[ clientId ] : {};
	let blockSaves = state.saves.hasOwnProperty( clientId ) ? state.saves[ clientId ] : {};

	if( ! Object.keys( blockChanges ).length && ! Object.keys( blockSaves ).length ) {
		return {};
	}

	blockSaves = getMergedAttributes( blockSaves, blockChanges );
	blockSaves = clearEmptySaves( blockSaves );

	return blockSaves;
};


/**
 * Set selector to return all changes.
 *
 * @param {object} state current
 *
 * @since 0.1.0
 *
 * @return {object} changes
 */
export const getChanges = ( state : State ) : object => {
	return state.changes;
};


/**
 * Set selector to return changes from a single block.
 *
 * @param {object} state current
 * @param {string} clientId
 *
 * @since 0.1.0
 *
 * @return {object} block changes
 */
export const getBlockChanges = ( state : State, clientId : string ) : object => {
	if( state.changes.hasOwnProperty( clientId ) ) {
		return state.changes[ clientId ];
	}

	return {};
};


/**
 * Set selector to return all defaults.
 *
 * @param {object} state current
 *
 * @since 0.1.0
 *
 * @return {object} defaults
 */
export const getDefaults = ( state : State ) : object => {
	return state.defaults;
};


/**
 * Set selector to return defaults from a single block.
 *
 * @param {object} state current
 * @param {string} clientId
 *
 * @since 0.1.0
 *
 * @return {object} block defaults
 */
export const getBlockDefaults = ( state : State, clientId : string ) : object => {
	if( state.defaults.hasOwnProperty( clientId ) && 0 < Object.entries( state.defaults[ clientId ] ).length ) {
		return state.defaults[ clientId ];
	}

	return {
		style: {},
	};
};


/**
 * Set selector to return all valids.
 *
 * @param {object} state current
 *
 * @since 0.1.0
 *
 * @return {object} valids
 */
export const getValids = ( state : State ) : object => {
	return state.valids;
}


/**
 * Set selector to return valids from a single block.
 *
 * @param {object} state current
 * @param {string} clientId
 *
 * @since 0.1.0
 *
 * @return {object} block valids
 */
export const getBlockValids = ( state : State, clientId : string ) : object => {
	if( state.valids.hasOwnProperty( clientId ) ) {
		return state.valids[ clientId ];
	}

	return {};
};


/**
 * Set selector to return all valids by actual viewport.
 *
 * @param {object} state current
 *
 * @since 0.1.0
 *
 * @return {object} valids for actual viewport
 */
export const getViewportValids = ( state : State ) : object => {
	const { valids, isActive, isEditing } = state;
	const viewport = isActive && isEditing ? state.viewport : 0;
	const viewportValids : Attributes = {};

	for( const [ clientId, viewports ] of Object.entries( valids ) ) {
		if( viewports.hasOwnProperty( viewport ) ) {
			viewportValids[ clientId ] = viewports[ viewport ];
		}
	}

	return viewportValids;
};


/**
 * Set selector to return block valids from a single block by actual viewport.
 *
 * @param {object} state current
 * @param {string} clientId
 *
 * @since 0.1.0
 *
 * @return {object} block valid
 */
export const getViewportBlockValids = ( state : State, clientId : string ) : object => {
	const { valids, viewport } = state;

	if( valids.hasOwnProperty( clientId ) ) {
		if( valids[ clientId ].hasOwnProperty( viewport ) ) {
			return valids[ clientId ][ viewport ];
		}
	}

	return {};
};


/**
 * Set selector to return all removes.
 *
 * @param {object} state current
 *
 * @since 0.1.0
 *
 * @return {object} removes
 */
export const getRemoves = ( state : State ) : object => {
	return state.removes;
}


/**
 * Set selector to return removes from a single block.
 *
 * @param {object} state current
 * @param {string} clientId
 *
 * @since 0.1.0
 *
 * @return {object} block removes
 */
export const getBlockRemoves = ( state : State, clientId : string ) : object => {
	if( state.removes.hasOwnProperty( clientId ) ) {
		return state.removes[ clientId ];
	}

	return {};
};


/**
 * Set selector to return actual inspected block.
 *
 * @param {object} state current
 *
 * @since 0.1.0
 *
 * @return {mixed} object block || boolean false
 */
export const getInspect = ( state : State ) : object | boolean => {
	return state.inspect;
}


/**
 * Set selector to return timestamp when we last edited from outside block context.
 *
 * @param {object} state current
 *
 * @since 0.1.0
 *
 * @return {integer} last edited timestamp
 */
export const getLastEdit = ( state : State ) : number => {
	return state.lastEdit;
}


/**
 * Set selector to return all renderers.
 *
 * @param {object} state current
 *
 * @since 0.1.0
 *
 * @return {object} renderers
 */
export const getRenderers = ( state : State ) : object => {
	return state.renderer;
}


/**
 * Set selector to return renderer by given key.
 *
 * @param {object} state current
 * @param {string} key
 *
 * @since 0.1.0
 *
 * @return {mixed} function || boolean false
 */
export const getRenderer = ( state : State, key : string ) : Function | boolean => {
	return state.renderer.hasOwnProperty( key ) ? state.renderer[ key ] : false;
}


/**
 * Set selector to indicate whether actual style attributes need a custom renderer.
 *
 * @param {object} state current
 * @param {object} style
 *
 * @since 0.1.0
 *
 * @return {boolean}
 */
export const needsRenderer = ( state : State, style : Attributes ) : boolean => {
	let need = false;
	for( const [ prop ] of Object.entries( style ) ) {
		if( state.renderer.hasOwnProperty( prop ) ) {
			need = true;
		}
	}

	return need;
}


/**
 * Set selector to indicate whether we have a registered renderer for given property key.
 *
 * @param {object} state current
 * @param {string} key
 *
 * @since 0.1.0
 *
 * @return {boolean}
 */
export const hasRenderer = ( state : State, key : string ) : boolean => {
	return state.renderer.hasOwnProperty( key );
}
