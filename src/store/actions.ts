/**
 * Set Action that updates viewport.
 *
 * @param {object} viewports
 *
 * @since 0.1.0
 *
 * @return {object} action
 */
export const setViewports = ( viewports : object ) : object => {
	return {
		type: 'SET_VIEWPORTS',
		viewports,
	};
}


/**
 * Set Action that updates viewport.
 *
 * @param {integer} viewport
 *
 * @since 0.1.0
 *
 * @return {object} action
 */
export const setViewport = ( viewport : number ) : object => {
	return {
		type: 'SET_VIEWPORT',
		viewport,
	};
}


/**
 * Set Action that updates to prev viewport.
 *
 * @param {integer} viewport
 *
 * @since 0.1.0
 *
 * @return {object} action
 */
export const setPrevViewport = ( viewport : number ) : object => {
	return {
		type: 'SET_PREV_VIEWPORT',
		viewport,
	};
}


/**
 * Set Action that updates to next viewport.
 *
 * @param {integer} viewport
 *
 * @since 0.1.0
 *
 * @return {object} action
 */
export const setNextViewport = ( viewport : number ) : object => {
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
 * @return {object} action
 */
export const setDesktop = () : object => {
	return {
		type: 'SET_DESKTOP',
	};
}


/**
 * Set Action that updates tablet viewport.
 *
 * @since 0.1.0
 *
 * @return {object} action
 */
export const setTablet = () : object => {
	return {
		type: 'SET_TABLET',
	};
}


/**
 * Set Action that updates mobile viewport.
 *
 * @since 0.1.0
 *
 * @return {object} action
 */
export const setMobile = () : object => {
	return {
		type: 'SET_MOBILE',
	};
}


/**
 * Set Action that updates ready indicator to true.
 *
 * @since 0.1.0
 *
 * @return {object} action
 */
export const setReady = () : object => {
	return {
		type: 'SET_READY',
	};
}


/**
 * Set Action that updates registering indicator to true.
 *
 * @since 0.1.0
 *
 * @return {object} action
 */
export const setRegistering = () : object => {
	return {
		type: 'SET_REGISTERING',
	};
}


/**
 * Set Action that updates registering indicator to false.
 *
 * @since 0.1.0
 *
 * @return {object} action
 */
export const unsetRegistering = () : object => {
	return {
		type: 'UNSET_REGISTERING',
	};
}


/**
 * Set Action that updates loading indicator to true.
 *
 * @since 0.1.0
 *
 * @return {object} action
 */
export const setLoading = () : object => {
	return {
		type: 'SET_LOADING',
	};
}


/**
 * Set Action that updates loading indicator to false.
 *
 * @since 0.1.0
 *
 * @return {object} action
 */
export const unsetLoading = () : object => {
	return {
		type: 'UNSET_LOADING',
	};
}


/**
 * Set Action that updates saving indicator to true.
 *
 * @since 0.1.0
 *
 * @return {object} action
 */
export const setSaving = () : object => {
	return {
		type: 'SET_SAVING',
	};
}


/**
 * Set Action that updates saving indicator to false.
 *
 * @since 0.1.0
 *
 * @return {object} action
 */
export const unsetSaving = () : object => {
	return {
		type: 'UNSET_SAVING',
	};
}


/**
 * Set Action that updates autosaving indicator to true.
 *
 * @since 0.1.0
 *
 * @return {object} action
 */
export const setAutoSaving = () : object => {
	return {
		type: 'SET_AUTOSAVING',
	};
}


/**
 * Set Action that updates autosaving indicator to false.
 *
 * @since 0.1.0
 *
 * @return {object} action
 */
export const unsetAutoSaving = () : object => {
	return {
		type: 'UNSET_AUTOSAVING',
	};
}


/**
 * Set Action that updates active indicator to true.
 *
 * @since 0.1.0
 *
 * @return {object} action
 */
export const setActive = () : object => {
	return {
		type: 'SET_ACTIVE',
	};
}


/**
 * Set Action that updates active indicator to false.
 *
 * @since 0.1.0
 *
 * @return {object} action
 */
export const unsetActive = () : object => {
	return {
		type: 'UNSET_ACTIVE',
	};
}


/**
 * Set Action that updates inspecting indicator to true.
 *
 * @since 0.2.2
 *
 * @return {object} action
 */
export const setInspecting = () : object => {
	return {
		type: 'SET_INSPECTING',
	};
}


/**
 * Set Action that updates inspecting indicator to false.
 *
 * @since 0.2.2
 *
 * @return {object} action
 */
export const unsetInspecting = () : object => {
	return {
		type: 'UNSET_INSPECTING',
	};
}


/**
 * Set Action that updatess inspector position.
 *
 * @param {string} position
 *
 * @since 0.2.2
 *
 * @return {object} action
 */
export const setInspectorPosition = ( position : string ) : object => {
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
 * @return {object} action
 */
export const setEditing = () : object => {
	return {
		type: 'SET_EDITING',
	};
}


/**
 * Set Action that updates editing indicator to false.
 *
 * @since 0.1.0
 *
 * @return {object} action
 */
export const unsetEditing = () : object => {
	return {
		type: 'UNSET_EDITING',
	};
}


/**
 * Set Action that toggle viewport simulation.
 *
 * @since 0.1.0
 *
 * @return {object} action
 */
export const toggleActive = () : object => {
	return {
		type: 'TOGGLE_ACTIVE',
	};
}


/**
 * Set Action that toggle desktop viewport.
 *
 * @since 0.1.0
 *
 * @return {object} action
 */
export const toggleDesktop = () : object => {
	return {
		type: 'TOGGLE_DESKTOP',
	};
}


/**
 * Set Action that toggle tablet viewport.
 *
 * @since 0.1.0
 *
 * @return {object} action
 */
export const toggleTablet = () : object => {
	return {
		type: 'TOGGLE_TABLET',
	};
}


/**
 * Set Action that toggle mobile viewport.
 *
 * @since 0.1.0
 *
 * @return {object} action
 */
export const toggleMobile = () : object => {
	return {
		type: 'TOGGLE_MOBILE',
	};
}


/**
 * Set Action to register block init.
 *
 * @param {string} clientId
 * @param {object} attributes
 *
 * @since 0.1.0
 *
 * @return {object} action
 */
export const registerBlockInit = ( clientId : string, attributes : object ) : object => {
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
 * @param {object} attributes
 *
 * @since 0.1.0
 *
 * @return {object} action
 */
export const updateBlockChanges = ( clientId : string, attributes : object ) : object => {
	return {
		type: 'UPDATE_BLOCK_CHANGES',
		clientId,
		attributes,
	};
}


/**
 * Set Action to update block defaults.
 *
 * @param {string} clientId
 * @param {object} attributes
 *
 * @since 0.1.0
 *
 * @return {object} action
 */
export const updateBlockDefaults = ( clientId : string, attributes : object ) : object => {
	return {
		type: 'UPDATE_BLOCK_DEFAULTS',
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
 * @return {object} action
 */
export const updateBlockValids = ( clientId : string ) : object => {
	return {
		type: 'UPDATE_BLOCK_VALIDS',
		clientId,
	};
}


/**
 * Set Action to remove block.
 *
 * @param {string}  clientId
 *
 * @since 0.1.0
 *
 * @return {object} action
 */
export const removeBlock = ( clientId : string ) : object => {
	return {
		type: 'REMOVE_BLOCK',
		clientId,
	};
}


/**
 * Set Action to remove block defaults.
 *
 * @param {string}  clientId
 * @param {object}  props
 *
 * @since 0.1.0
 *
 * @return {object} action
 */
export const removeBlockDefaults = ( clientId : string, props : object ) : object => {
	return {
		type: 'REMOVE_BLOCK_DEFAULTS',
		clientId,
		props,
	};
}


/**
 * Set Action to remove block changes.
 *
 * @param {string}  clientId
 * @param {object}  props
 * @param {integer} viewport
 *
 * @since 0.1.0
 *
 * @return {object} action
 */
export const removeBlockChanges = ( clientId : string, props : object, viewport : number ) : object => {
	return {
		type: 'REMOVE_BLOCK_CHANGES',
		clientId,
		props,
		viewport,
	};
}


/**
 * Set Action to remove block saves.
 *
 * @param {string}  clientId
 * @param {object}  props
 * @param {integer} viewport
 *
 * @since 0.1.0
 *
 * @return {object} action
 */
export const removeBlockSaves = ( clientId : string, props : object, viewport : number ) : object => {
	return {
		type: 'REMOVE_BLOCK_SAVES',
		clientId,
		props,
		viewport,
	};
}


/**
 * Set Action to remove block removes.
 *
 * @param {string}  clientId
 * @param {object}  props
 * @param {integer} viewport
 *
 * @since 0.1.0
 *
 * @return {object} action
 */
export const removeBlockRemoves = ( clientId : string, props : object, viewport : number ) : object => {
	return {
		type: 'REMOVE_BLOCK_REMOVES',
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
 * @return {object} action
 */
export const saveBlock = ( clientId : string ) : object => {
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
 * @return {object} action
 */
export const clearBlocks = () => {
	return {
		type: 'CLEAR_BLOCKS',
	}
}


/**
 * Set Action to register renderer.
 *
 * @param prop
 * @param callback
 * @param priority
 *
 * @since 0.1.0
 *
 * @return {object} action
 */
export const registerRenderer = ( prop : string, callback : Function, priority = 10 ) : object => ( {
	type: 'REGISTER_RENDERER',
	prop,
	callback,
	priority,
} );
