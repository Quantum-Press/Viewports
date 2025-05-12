import { desktop } from '../components/svgs';
import type { Size } from '../hooks';
import type {
	State,
	RendererSet,
	RendererPropertySet,
	SpectrumSet,
	InlineStyleSet,
	ViewportStyleSets,
	IndicatorSelectorSet,
	BlockStyles,
	BlockAttributes,
} from '../types';

import {
	findObjectChanges,
	getMergedObject,
	traverseFilled,
	traverseGet,
} from '../utils';
import { DEFAULT_STATE } from './default';
import {
	isInMobileRange,
	isInTabletRange,
	isInDesktopRange,
	findCleanedChanges,
	clearEmptySaves,
	clearDuplicateSaves,
	findBlockSaves,
	findBlockValids,
	getSpectrumProperties,
} from './utils';

const { cloneDeep } = window[ 'lodash' ];

/**
 * Set selector to return viewports.
 *
 * @param {State} state current
 *
 * @return {object} viewports
 */
export const getViewports = ( state : State ) : object => {
	return state.viewports;
};


/**
 * Set selector to return active viewport.
 *
 * @param {State} state current
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
 * @param {State} state current
 *
 * @return {integer} desktop viewport
 */
export const getDesktop = ( state : State ) : number => {
	return state.desktop;
};


/**
 * Set selector to return tablet viewport.
 *
 * @param {State} state current
 *
 * @return {integer} tablet viewport
 */
export const getTablet = ( state : State ) : number => {
	return state.tablet;
};


/**
 * Set selector to return mobile viewport.
 *
 * @param {State} state current
 *
 * @return {integer} mobile viewport
 */
export const getMobile = ( state : State ) : number => {
	return state.mobile;
};


/**
 * Set selector to return iframe size.
 *
 * @param {State} state current
 *
 * @return {Size} of iframe
 */
export const getIframeSize = ( state : State ) : Size => {
	return state.iframeSize;
};


/**
 * Set selector to return iframe viewport.
 *
 * @param {State} state current
 *
 * @return {number}
 */
export const getIframeViewport = ( state : State ) : number => {
	return state.iframeViewport;
};


/**
 * Set selector to return isRegistering indicator.
 *
 * @param {State} state current
 *
 * @return {boolean}
 */
export const isRegistering = ( state : State ) : boolean => {
	return state.isRegistering;
};


/**
 * Set selector to return isReady indicator.
 *
 * @param {State} state current
 *
 * @return {boolean}
 */
export const isReady = ( state : State ) : boolean => {
	return state.isReady;
};


/**
 * Set selector to return isLoading indicator.
 *
 * @param {State} state current
 *
 * @return {boolean}
 */
export const isLoading = ( state : State ) : boolean => {
	return state.isLoading;
};


/**
 * Set selector to return isSaving indicator.
 *
 * @param {State} state current
 *
 * @return {boolean}
 */
export const isSaving = ( state : State ) : boolean => {
	return state.isSaving;
};


/**
 * Set selector to return isAutoSaving indicator.
 *
 * @param {State} state current
 *
 * @return {boolean}
 */
export const isAutoSaving = ( state : State ) : boolean => {
	return state.isAutoSaving;
};


/**
 * Set selector to return isActive indicator.
 *
 * @param {State} state current
 *
 * @return {boolean}
 */
export const isActive = ( state : State ) : boolean => {
	return state.isActive;
};


/**
 * Set selector to return isInspecting indicator.
 *
 * @param {State} state current
 *
 * @return {boolean}
 */
export const isInspecting = ( state : State ) : boolean => {
	return state.isInspecting;
};


/**
 * Set selector to return inspectorPosition.
 *
 * @param {State} state current
 *
 * @return {string}
 */
export const getInspectorPosition = ( state : State ) : string => {
	return state.inspectorPosition;
};


/**
 * Set selector to return isEditing indicator.
 *
 * @param {State} state current
 *
 * @return {boolean}
 */
export const isEditing = ( state : State ) : boolean => {
	return state.isEditing;
};


/**
 * Set selector to indicate inDesktopRange.
 *
 * @param {State} state current
 *
 * @return {boolean}
 */
export const inDesktopRange = ( state : State ) : boolean => {
	return isInDesktopRange( state.viewport );
};


/**
 * Set selector to indicate inTabletRange.
 *
 * @param {State} state current
 *
 * @return {boolean}
 */
export const inTabletRange = ( state : State ) : boolean => {
	return isInTabletRange( state.viewport );
};


/**
 * Set selector to indicate inMobileRange.
 *
 * @param {State} state current
 *
 * @return {boolean}
 */
export const inMobileRange = ( state : State ) : boolean => {
	return isInMobileRange( state.viewport );
};


/**
 * Set selector to indicate block is registered by clientId.
 *
 * @param {State} state current
 * @param {string} clientId
 *
 * @return {boolean}
 */
export const isRegistered = ( state : State, clientId : string ) : boolean => {
	return state.valids.hasOwnProperty( clientId );
}


/**
 * Set selector to indicate hasBlockViewports.
 *
 * @param {State} state current
 * @param {string} clientId
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
 * @param {State} state current
 * @param {string} clientId
 *
 * @return {boolean}
 */
export const hasBlockDefaults = ( state : State, clientId : string ) : boolean => {
	return traverseFilled( [ clientId, 0, 'style' ], state.saves );
};


/**
 * Set selector to indicate hasBlockSaves.
 *
 * @param {State} state current
 * @param {string} clientId
 *
 * @return {boolean}
 */
export const hasBlockSaves = ( state : State, clientId : string ) : boolean => {
	const saves = traverseGet( [ clientId ], state.saves, {} );

	if( 1 < Object.keys( saves ).length ) {
		return true;
	}

	return false;
};


/**
 * Set selector to indicate hasBlockChanges.
 *
 * @param {State} state current
 * @param {string} clientId
 *
 * @return {boolean}
 */
export const hasBlockChanges = ( state : State, clientId : string ) : boolean => {
	return traverseFilled( [ clientId ], state.changes );
};


/**
 * Set selector to indicate hasBlockPropertyChanges.
 *
 * @param {State} state current
 * @param {string} clientId
 * @param {number} viewport
 * @param {string} property
 *
 * @return {boolean}
 */
export const hasBlockPropertyChanges = ( state : State, clientId : string, viewport : number, property : string ) : boolean => {
	return traverseFilled( [ clientId, viewport, 'style', property ], state.changes );
};


/**
 * Set selector to indicate hasBlockValids.
 *
 * @param {State} state current
 * @param {string} clientId
 *
 * @return {boolean}
 */
export const hasBlockValids = ( state : State, clientId : string ) : boolean => {
	return traverseFilled( [ clientId ], state.valids );
};


/**
 * Set selector to indicate hasBlockRemoves.
 *
 * @param {State} state current
 * @param {string} clientId
 *
 * @return {boolean}
 */
export const hasBlockRemoves = ( state : State, clientId : string ) : boolean => {
	return traverseFilled( [ clientId ], state.removes );
};


/**
 * Set selector to indicate hasBlockPropertyChanges.
 *
 * @param {State} state current
 * @param {string} clientId
 * @param {number} viewport
 * @param {string} property
 *
 * @return {boolean}
 */
export const hasBlockPropertyRemoves = ( state : State, clientId : string, viewport : number, property : string ) : boolean => {
	return traverseFilled( [ clientId, viewport, 'style', property ], state.removes );
};


/**
 * Set selector to return all saves.
 *
 * @param {State} state current
 *
 * @return {object} saves
 */
export const getSaves = ( state : State ) : object => {
	return state.saves;
};


/**
 * Set selector to return saves from a single block.
 *
 * @param {State} state current
 * @param {string} clientId
 *
 * @return {object} block saves
 */
export const getBlockSaves = ( state : State, clientId : string ) : object => {
	return traverseGet( [ clientId ], state.saves, {} );
};


/**
 * Set selector to return saves by clientId, viewport and property.
 *
 * @param {State} state current
 * @param {string} clientId
 * @param {number} viewport
 * @param {string} property
 *
 * @return {object} block saves
 */
export const getBlockPropertySaves = ( state : State, clientId : string, viewport : number, property : string ) : object => {
	return traverseGet( [ clientId, viewport, 'style', property ], state.saves, {} );
};


/**
 * Set selector to return new generated saves from a single block.
 *
 * @param {State} state current
 * @param {string} clientId
 *
 * @return {object} block saves
 */
export const getGeneratedBlockSaves = ( state : State, clientId : string ) : object => {
	const { saves, changes, removes, valids } = state;

	// Set states.
	let blockSaves = saves.hasOwnProperty( clientId ) ? cloneDeep( saves[ clientId ] ) : {};
	let blockChanges = changes.hasOwnProperty( clientId ) ? cloneDeep( changes[ clientId ] ) : {};
	let blockRemoves = removes.hasOwnProperty( clientId ) ? cloneDeep( removes[ clientId ] ) : {};

	// Set indicators.
	const hasBlockSaves = Object.keys( blockSaves ).length ? true : false;
	const hasBlockChanges = Object.keys( blockChanges ).length ? true : false;
	const hasBlockRemoves = Object.keys( blockRemoves ).length ? true : false;

	// Check if we can skip the save call.
	if( ! hasBlockSaves && ! hasBlockChanges && ! hasBlockRemoves ) {
		return {};
	}

	// Set merged blockSaves.
	blockSaves = getMergedObject( blockSaves, blockChanges );

	// Cleanup saves from removes.
	blockSaves = findCleanedChanges( blockSaves, blockRemoves );

	// Cleanup saves on emptyness.
	blockSaves = clearEmptySaves( blockSaves );
	blockSaves = clearDuplicateSaves( blockSaves );

	// Set viewport 0 if not set.
	if( ! blockSaves.hasOwnProperty( 0 ) ) {
		blockSaves[ 0 ] = {
			style: {},
		}
	}

	// Return cleaned blockSaves.
	return blockSaves;
};


/**
 * Set selector to return all changes.
 *
 * @param {State} state current
 *
 * @return {object} changes
 */
export const getChanges = ( state : State ) : object => {
	return state.changes;
};


/**
 * Set selector to return changes from a single block.
 *
 * @param {State} state current
 * @param {string} clientId
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
 * Set selector to return changes by clientId, viewport and property.
 *
 * @param {State} state current
 * @param {string} clientId
 * @param {number} viewport
 * @param {string} property
 *
 * @return {object} block changes
 */
export const getBlockPropertyChanges = ( state : State, clientId : string, viewport : number, property : string ) : object => {
	return traverseGet( [ clientId, viewport, 'style', property ], state.changes, {} );
};


/**
 * Set selector to return all valids.
 *
 * @param {State} state current
 *
 * @return {object} valids
 */
export const getValids = ( state : State ) : object => {
	return state.valids;
}


/**
 * Set selector to return valids from a single block.
 *
 * @param {State} state current
 * @param {string} clientId
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
 * Set selector to return block valids from a single block by actual viewport.
 *
 * @param {State} state current
 * @param {string} clientId
 *
 * @return {object} block valid
 */
export const getViewportBlockValids = ( state : State, clientId : string ) : object => {
	const { viewports, iframeViewport, saves, changes, removes } = state;

	const blockSaves = cloneDeep( traverseGet( [ clientId ], saves, {} ) ) as ViewportStyleSets;
	const blockChanges = cloneDeep( traverseGet( [ clientId ], changes, {} ) ) as ViewportStyleSets;
	const blockRemoves = cloneDeep( traverseGet( [ clientId ], removes, {} ) ) as ViewportStyleSets;

	const merged = findObjectChanges( getMergedObject( blockSaves, blockChanges ), blockRemoves );
	const blockValids : ViewportStyleSets = {
		0: {
			style: {},
		},
	};

	let last = 0;

	for ( const [ viewportDirty ] of Object.entries( viewports ) ) {
		const viewport = parseInt( viewportDirty );
		const lastBlockValids = cloneDeep( blockValids[ last ] );

		if( viewport > iframeViewport ) {
			break;
		}

		if ( merged.hasOwnProperty( viewport ) ) {
			blockValids[ viewport ] = getMergedObject( lastBlockValids, merged[ viewport ] );
		} else {
			blockValids[ viewport ] = lastBlockValids;
		}

		last = viewport;
	}

	return cloneDeep( blockValids[ last ] );
};


/**
 * Set selector to return all removes.
 *
 * @param {State} state current
 *
 * @return {object} removes
 */
export const getRemoves = ( state : State ) : object => {
	return state.removes;
}


/**
 * Set selector to return removes from a single block.
 *
 * @param {State} state current
 * @param {string} clientId
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
 * Set selector to return removes by clientId, viewport and property.
 *
 * @param {State} state current
 * @param {string} clientId
 *
 * @return {object} block removes
 */
export const getBlockPropertyRemoves = ( state : State, clientId : string, viewport : number, property : string ) : object => {
	return traverseGet( [ clientId, viewport, 'style', property ], state.removes, {} );
};


/**
 * Set selector to return timestamp when we last edited from outside block context.
 *
 * @param {State} state current
 */
export const getLastEdit = ( state : State ) : number => {
	return state.lastEdit;
}


/**
 * Set selector to return all renderers.
 *
 * @param {State} state current
 */
export const getRendererPropertySet = ( state : State ) : RendererPropertySet => {
	return state.renderer;
}


/**
 * Set selector to return rendererSet by given key.
 *
 * @param {State} state current
 * @param {string} key
 */
export const getRendererSet = ( state : State, key : string ) : false | RendererSet => {
	return state.renderer.hasOwnProperty( key ) ? state.renderer[ key ] : false;
}


/**
 * Set selector to indicate whether actual style attributes need a custom renderer.
 *
 * @param {State} state current
 * @param {object} style
 */
export const needsRenderer = ( state : State, style : BlockStyles ) : boolean => {
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
 * @param {State} state current
 * @param {string} key
 */
export const hasRenderer = ( state : State, key : string ) : boolean => {
	return state.renderer.hasOwnProperty( key );
}


/**
 * Set selector to return css by clientId.
 *
 * @param {State} state current
 * @param {string} clientId
 */
export const getCSS = ( state : State, clientId : string ) : string => {
	const cssSet = state.cssSet.hasOwnProperty( clientId ) ? state.cssSet[ clientId ] : {};
	const css = [];

	Object.keys( cssSet ).forEach( viewportDirty => {
		const viewport = parseInt( viewportDirty );
		const cssParts = cssSet[ viewport ];

		if( state.iframeSize.width >= viewport ) {
			css.push( cssParts.join( '' ) );
		}
	} );

	return css.join( '' );
}


/**
 * Set selector to return preview css by attributes.
 *
 * @param {State} state current
 * @param {string} clientId
 * @param {string} blockName
 * @param {BlockAttributes} attributes
 */
export const getPreviewCSS = ( state : State, clientId : string, blockName : string, attributes : BlockAttributes ) : string => {
	const blockSaves = findBlockSaves( attributes );
	const initState = {
		... DEFAULT_STATE,
		viewports: state.viewports,
		saves: {
			[ clientId ]: blockSaves,
		},
	}

	const blockValids = findBlockValids( clientId, initState );

	// Set spectrumState for spectrumSet generation.
	const spectrumState = {
		valids: blockValids,
		saves: blockSaves,
		changes: null,
		removes: null,
		rendererPropertySet: state.renderer,
		isSaving: false,
		viewport: 1200,
	};

	// Deconstruct spectrumProperties.
	const {
		cssViewportSet,
	} = getSpectrumProperties( clientId, blockName, spectrumState );

	const css = [];

	Object.keys( cssViewportSet ).forEach( viewportDirty => {
		const viewport = parseInt( viewportDirty );
		const cssParts = cssViewportSet[ viewport ];

		if( spectrumState.viewport >= viewport ) {
			css.push( cssParts.join( '' ) );
		}
	} );

	return css.join( '' );
}


/**
 * Set selector to return spectrumSet by clientId.
 *
 * @param {State} state current
 * @param {string} clientId
 */
export const getSpectrumSet = ( state : State, clientId : string ) : SpectrumSet => {
	return state.spectrumSets.hasOwnProperty( clientId ) ? state.spectrumSets[ clientId ] : [];
}


/**
 * Set selector to return inlineStyle by clientId.
 *
 * @param {State} state current
 * @param {string} clientId
 */
export const getInlineStyle = ( state : State, clientId : string ) : InlineStyleSet => {
	return state.inlineStyleSets.hasOwnProperty( clientId ) ? state.inlineStyleSets[ clientId ] : {};
}


/**
 * Set selector to return inlineStyle by clientId.
 *
 * @param {State} state current
 * @param {string} clientId
 */
export const getIndicatorSelectorSet = ( state : State, clientId : string ) : IndicatorSelectorSet => {
	const selectorSet = {} as IndicatorSelectorSet;
	const spectrumSet = getSpectrumSet( state, clientId );

	const rendererPropertySet = getRendererPropertySet( state );

	// Iterate over all renderer property sets.
	for( const property in rendererPropertySet ) {
		if( ! rendererPropertySet.hasOwnProperty( property ) ) {
			continue;
		}

		const rendererSet = rendererPropertySet[ property ];

		// Iterate over all callbacks by priority.
		for( const priorityDirty in rendererSet ) {
			if( ! rendererSet.hasOwnProperty( priorityDirty ) ) {
				continue;
			}

			// Cleanup to number.
			const priority = parseInt( priorityDirty );

			// Try to get selector from renderer.
			const renderer = rendererSet[ priority ];

			if( ! renderer.selectors.hasOwnProperty( 'label' ) ) {
				continue;
			}

			// Set label.
			const selectorLabel = renderer.selectors.label;

			// Set empty spectrum to fill, if available.
			let collected = [];

			// Iterate over spectrumSets, to search the result of renderer.
			for( let index = 0; index < spectrumSet.length; index++ ) {
				const check = spectrumSet[ index ];

				// Continue as long as we find the property and priority.
				if( property === check.property && priority === check.priority ) {
					collected.push( check );
				}
			}

			// Set selectorSet if not already set.
			if( ! selectorSet.hasOwnProperty( selectorLabel ) ) {
				selectorSet[ selectorLabel ] = {
					property,
					spectrumSet: [],
				}
			}

			// Check if we found a spectrum.
			if( collected.length ) {
				selectorSet[ selectorLabel ].spectrumSet = collected;
			}
		}
	}

	return selectorSet;
}
