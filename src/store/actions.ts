import type { Action, Viewports, SelectorSet } from './';
import type { Attributes } from '../utils';
import type { Size } from '../hooks';


/**
 * Set Action that updates viewport.
 *
 * @param {Viewports} viewports
 *
 * @since 0.1.0
 *
 * @return {Action}
 */
export const setViewports = ( viewports : Viewports ) : Action => {
	return {
		type: 'SET_VIEWPORTS',
		viewports,
	};
}


/**
 * Set Action that updates viewport.
 *
 * @param {number} viewport
 *
 * @since 0.1.0
 *
 * @return {Action}
 */
export const setViewport = ( viewport : number ) : Action => {
	return {
		type: 'SET_VIEWPORT',
		viewport,
	};
}


/**
 * Set Action that updates to prev viewport.
 *
 * @param {number} viewport
 *
 * @since 0.1.0
 *
 * @return {Action}
 */
export const setPrevViewport = ( viewport : number ) : Action => {
	return {
		type: 'SET_PREV_VIEWPORT',
		viewport,
	};
}


/**
 * Set Action that updates to next viewport.
 *
 * @param {number} viewport
 *
 * @since 0.1.0
 *
 * @return {Action}
 */
export const setNextViewport = ( viewport : number ) : Action => {
	return {
		type: 'SET_NEXT_VIEWPORT',
		viewport,
	};
}


/**
 * Set Action that updates desktop viewport.
 *
 * @since 0.1.0
 *
 * @return {Action}
 */
export const setDesktop = () : Action => {
	return {
		type: 'SET_DESKTOP',
	};
}


/**
 * Set Action that updates tablet viewport.
 *
 * @since 0.1.0
 *
 * @return {Action}
 */
export const setTablet = () : Action => {
	return {
		type: 'SET_TABLET',
	};
}


/**
 * Set Action that updates mobile viewport.
 *
 * @since 0.1.0
 *
 * @return {Action}
 */
export const setMobile = () : Action => {
	return {
		type: 'SET_MOBILE',
	};
}


/**
 * Set Action that updates iframe size.
 *
 * @since 0.2.5
 *
 * @return {Action}
 */
export const setIframeSize = ( size : Size ) : Action => {
	return {
		type: 'SET_IFRAME_SIZE',
		size,
	};
}


/**
 * Set Action that updates ready indicator to true.
 *
 * @since 0.1.0
 *
 * @return {Action}
 */
export const setReady = () : Action => {
	return {
		type: 'SET_READY',
	};
}


/**
 * Set Action that updates registering indicator to true.
 *
 * @since 0.1.0
 *
 * @return {Action}
 */
export const setRegistering = () : Action => {
	return {
		type: 'SET_REGISTERING',
	};
}


/**
 * Set Action that updates registering indicator to false.
 *
 * @since 0.1.0
 *
 * @return {Action}
 */
export const unsetRegistering = () : Action => {
	return {
		type: 'UNSET_REGISTERING',
	};
}


/**
 * Set Action that updates loading indicator to true.
 *
 * @since 0.1.0
 *
 * @return {Action}
 */
export const setLoading = () : Action => {
	return {
		type: 'SET_LOADING',
	};
}


/**
 * Set Action that updates loading indicator to false.
 *
 * @since 0.1.0
 *
 * @return {Action}
 */
export const unsetLoading = () : Action => {
	return {
		type: 'UNSET_LOADING',
	};
}


/**
 * Set Action that updates saving indicator to true.
 *
 * @since 0.1.0
 *
 * @return {Action}
 */
export const setSaving = () : Action => {
	return {
		type: 'SET_SAVING',
	};
}


/**
 * Set Action that updates saving indicator to false.
 *
 * @since 0.1.0
 *
 * @return {Action}
 */
export const unsetSaving = () : Action => {
	return {
		type: 'UNSET_SAVING',
	};
}


/**
 * Set Action that updates autosaving indicator to true.
 *
 * @since 0.1.0
 *
 * @return {Action}
 */
export const setAutoSaving = () : Action => {
	return {
		type: 'SET_AUTOSAVING',
	};
}


/**
 * Set Action that updates autosaving indicator to false.
 *
 * @since 0.1.0
 *
 * @return {Action}
 */
export const unsetAutoSaving = () : Action => {
	return {
		type: 'UNSET_AUTOSAVING',
	};
}


/**
 * Set Action that updates active indicator to true.
 *
 * @since 0.1.0
 *
 * @return {Action}
 */
export const setActive = () : Action => {
	return {
		type: 'SET_ACTIVE',
	};
}


/**
 * Set Action that updates active indicator to false.
 *
 * @since 0.1.0
 *
 * @return {Action}
 */
export const unsetActive = () : Action => {
	return {
		type: 'UNSET_ACTIVE',
	};
}


/**
 * Set Action that updates inspecting indicator to true.
 *
 * @since 0.2.2
 *
 * @return {Action}
 */
export const setInspecting = () : Action => {
	return {
		type: 'SET_INSPECTING',
	};
}


/**
 * Set Action that updates inspecting indicator to false.
 *
 * @since 0.2.2
 *
 * @return {Action}
 */
export const unsetInspecting = () : Action => {
	return {
		type: 'UNSET_INSPECTING',
	};
}


/**
 * Set Action that updatess inspector position.
 *
 * @param {string}
 *
 * @since 0.2.2
 *
 * @return {Action}
 */
export const setInspectorPosition = ( position : string ) : Action => {
	return {
		type: 'SET_INSPECTOR_POSITION',
		position,
	};
}


/**
 * Set Action that updates editing indicator to true.
 *
 * @since 0.1.0
 *
 * @return {Action}
 */
export const setEditing = () : Action => {
	return {
		type: 'SET_EDITING',
	};
}


/**
 * Set Action that updates editing indicator to false.
 *
 * @since 0.1.0
 *
 * @return {Action}
 */
export const unsetEditing = () : Action => {
	return {
		type: 'UNSET_EDITING',
	};
}


/**
 * Set Action that toggle viewport simulation.
 *
 * @since 0.1.0
 *
 * @return {Action}
 */
export const toggleActive = () : Action => {
	return {
		type: 'TOGGLE_ACTIVE',
	};
}


/**
 * Set Action that toggle desktop viewport.
 *
 * @since 0.1.0
 *
 * @return {Action}
 */
export const toggleDesktop = () : Action => {
	return {
		type: 'TOGGLE_DESKTOP',
	};
}


/**
 * Set Action that toggle tablet viewport.
 *
 * @since 0.1.0
 *
 * @return {Action}
 */
export const toggleTablet = () : Action => {
	return {
		type: 'TOGGLE_TABLET',
	};
}


/**
 * Set Action that toggle mobile viewport.
 *
 * @since 0.1.0
 *
 * @return {Action}
 */
export const toggleMobile = () : Action => {
	return {
		type: 'TOGGLE_MOBILE',
	};
}


/**
 * Set Action to register block init.
 *
 * @param {string} clientId
 * @param {Attributes} attributes
 *
 * @since 0.1.0
 *
 * @return {Action}
 */
export const registerBlockInit = ( clientId : string, attributes : Attributes ) : Action => {
	return {
		type: 'REGISTER_BLOCK_INIT',
		clientId,
		attributes,
	};
}


/**
 * Set Action to update block changes.
 *
 * @param {string} clientId
 * @param {Attributes} attributes
 *
 * @since 0.1.0
 *
 * @return {Action}
 */
export const updateBlockChanges = ( clientId : string, attributes : Attributes ) : Action => {
	return {
		type: 'UPDATE_BLOCK_CHANGES',
		clientId,
		attributes,
	};
}


/**
 * Set Action to update block valids.
 *
 * @param {string} clientId
 *
 * @since 0.1.0
 *
 * @return {Action}
 */
export const updateBlockValids = ( clientId : string ) : Action => {
	return {
		type: 'UPDATE_BLOCK_VALIDS',
		clientId,
	};
}


/**
 * Set Action to remove block.
 *
 * @param {string} clientId
 *
 * @since 0.1.0
 *
 * @return {Action}
 */
export const removeBlock = ( clientId : string ) : Action => {
	return {
		type: 'REMOVE_BLOCK',
		clientId,
	};
}


/**
 * Set Action to remove block saves.
 *
 * @param {string} clientId
 * @param {Array} props
 * @param {number} viewport
 *
 * @since 0.1.0
 *
 * @return {Action}
 */
export const removeBlockSaves = ( clientId : string, props : Array<string>, viewport : number ) : Action => {
	return {
		type: 'REMOVE_BLOCK_SAVES',
		clientId,
		props,
		viewport,
	};
}


/**
 * Set Action to restore block saves.
 *
 * @param {string} clientId
 * @param {Array} props
 * @param {number} viewport
 *
 * @since 0.1.0
 *
 * @return {Action}
 */
export const restoreBlockSaves = ( clientId : string, props : Array<string>, viewport : number ) : Action => {
	return {
		type: 'RESTORE_BLOCK_SAVES',
		clientId,
		props,
		viewport,
	};
}


/**
 * Set Action to save block.
 *
 * @param {string} clientId
 *
 * @since 0.1.0
 *
 * @return {Action}
 */
export const saveBlock = ( clientId : string ) : Action => {
	return {
		type: 'SAVE_BLOCK',
		clientId,
	};
}


/**
 * Set Action to clear blocks.
 *
 * @since 0.1.0
 *
 * @return {Action}
 */
export const clearBlocks = () : Action => {
	return {
		type: 'CLEAR_BLOCKS',
	}
}


/**
 * Set Action to register renderer.
 *
 * @param {string} prop
 * @param {Function} callback
 * @param {number} priority
 * @param {SelectorSet} selectors
 *
 * @since 0.1.0
 *
 * @return {Action}
 */
export const registerRenderer = ( prop : string, callback : Function, priority = 10, selectors = {} ) : Action => ( {
	type: 'REGISTER_RENDERER',
	prop,
	callback,
	priority,
	selectors,
} );
