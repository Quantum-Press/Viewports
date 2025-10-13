import type { BlockAttributes, Action, Viewports, viewportType } from '@quantum-viewports/types';
import type { Size } from '@quantum-viewports/hooks';


/**
 * Set Action that updates viewport.
 *
 * @param {Viewports} viewports
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
 * @return {Action}
 */
export const setViewport = ( viewport : number ) : Action => {
	return {
		type: 'SET_VIEWPORT',
		viewport,
	};
}


/**
 * Set Action that updates viewportType.
 *
 * @param {viewportType} viewportType
 *
 * @return {Action}
 */
export const setViewportType = ( viewportType : viewportType ) : Action => {
	return {
		type: 'SET_VIEWPORT_TYPE',
		viewportType,
	};
}


/**
 * Set Action that updates to prev viewport.
 *
 * @param {viewportType} viewportType
 *
 * @return {Action}
 */
export const setPrevViewport = ( viewportType : viewportType = '' ) : Action => {
	return {
		type: 'SET_PREV_VIEWPORT',
		viewportType,
	};
}


/**
 * Set Action that updates to next viewport.
 *
 * @param {viewportType} viewportType
 *
 * @return {Action}
 */
export const setNextViewport = ( viewportType : viewportType = '' ) : Action => {
	return {
		type: 'SET_NEXT_VIEWPORT',
		viewportType,
	};
}


/**
 * Set Action that updates desktop viewport.
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
 * @return {Action}
 */
export const unsetInspecting = () : Action => {
	return {
		type: 'UNSET_INSPECTING',
	};
}


/**
 * Set Action that toggle editing indicator.
 *
 * @return {Action}
 */
export const toggleInspecting = () : Action => {
	return {
		type: 'TOGGLE_INSPECTING',
	};
}


/**
 * Set Action that updatess inspector position.
 *
 * @param {string}
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
 * @return {Action}
 */
export const unsetEditing = () : Action => {
	return {
		type: 'UNSET_EDITING',
	};
}


/**
 * Set Action that toggle editing indicator.
 *
 * @return {Action}
 */
export const toggleEditing = () : Action => {
	return {
		type: 'TOGGLE_EDITING',
	};
}


/**
 * Set Action that toggle viewport simulation.
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
 * @param {string} blockName
 * @param {BlockAttributes} attributes
 *
 * @return {Action}
 */
export const registerBlockInit = (
	clientId : string,
	blockName : string,
	attributes : BlockAttributes
) : Action => {
	return {
		type: 'REGISTER_BLOCK_INIT',
		clientId,
		blockName,
		attributes,
	};
}


/**
 * Set Action to update block changes.
 *
 * @param {string} clientId
 * @param {string} blockName
 * @param {BlockAttributes} attributes
 * @param {number | null} viewport
 *
 * @return {Action}
 */
export const updateBlockChanges = (
	clientId : string,
	blockName : string,
	attributes : BlockAttributes,
	viewport : number = null
) : Action => {
	return {
		type: 'UPDATE_BLOCK_CHANGES',
		clientId,
		blockName,
		attributes,
		viewport,
	};
}


/**
 * Set Action to add block changes.
 *
 * @param {string} clientId
 * @param {string} blockName
 * @param {number} viewport
 * @param {string} viewport
 *
 * @return {Action}
 */
export const addBlockPropertyChanges = (
	clientId : string,
	blockName : string,
	viewport : number,
	prop: string
) : Action => {
	return {
		type: 'ADD_BLOCK_PROPERTY_CHANGES',
		clientId,
		blockName,
		viewport,
		prop,
	};
}


/**
 * Set Action to remove block.
 *
 * @param {string} clientId
 *
 * @return {Action}
 */
export const removeBlock = (
	clientId : string,
) : Action => {
	return {
		type: 'REMOVE_BLOCK',
		clientId,
	};
}


/**
 * Set Action to remove block saves.
 *
 * @param {string} clientId
 * @param {string} blockName
 * @param {Array} props
 * @param {number} viewport
 *
 * @return {Action}
 */
export const removeBlockSaves = (
	clientId : string,
	blockName : string,
	props : Array<string>,
	viewport : number
) : Action => {
	return {
		type: 'REMOVE_BLOCK_SAVES',
		clientId,
		blockName,
		props,
		viewport,
	};
}


/**
 * Set Action to restore block saves.
 *
 * @param {string} clientId
 * @param {string} blockName
 * @param {Array} props
 * @param {number} viewport
 *
 * @return {Action}
 */
export const restoreBlockSaves = ( clientId : string, blockName : string, props : Array<string>, viewport : number ) : Action => {
	return {
		type: 'RESTORE_BLOCK_SAVES',
		clientId,
		blockName,
		props,
		viewport,
	};
}


/**
 * Set Action to save block.
 *
 * @param {string} clientId
 *
 * @return {Action}
 */
export const saveBlock = ( clientId : string, blockName : string ) : Action => {
	return {
		type: 'SAVE_BLOCK',
		clientId,
		blockName,
	};
}


/**
 * Set Action to clear blocks.
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
 * @return {Action}
 */
export const registerRenderer = ( prop : string, callback : Function, priority = 10, selectors = {}, mapping = {} ) : Action => ( {
	type: 'REGISTER_RENDERER',
	prop,
	callback,
	priority,
	selectors,
	mapping,
} );
