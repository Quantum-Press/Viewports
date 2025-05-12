import type { State, Action, ReducerManager } from '../types';
import { DEFAULT_STATE } from './default';
import { getMergedObject, traverseGet, traverseFilled, traverseExist } from '../utils';
import {
	mobileDefaultViewport,
	tabletDefaultViewport,
	desktopDefaultViewport,
} from './default';
import {
	isInMobileRange,
	isInTabletRange,
	isInDesktopRange,
	getHighestPossibleViewport,
	findBlockSaves,
	findBlockValids,
	findBlockDifferences,
	findRemoves,
	findCleanedChanges,
	clearEmptySaves,
	clearDuplicateSaves,
	getSpectrumProperties,
	getPrevViewport,
	getNextViewport,
	getViewports,
} from './utils';

const { cloneDeep } = window[ 'lodash' ];


/**
 * Set reducer to update viewports list.
 *
 * @param {State} state current
 * @param {Action} action dispatched
 *
 * @return {State} updated state
 */
export const setViewports = ( state : State , action : Action ) : State => {
	switch ( action.type ) {
		case 'SET_VIEWPORTS' :
			return {
				... state,
				viewports: {
					... state.viewports,
					... action.viewports
				},
			};
	}

	return state;
}
setViewports.handlesAction = ( actionType ) => actionType === 'SET_VIEWPORTS';


/**
 * Set reducer to update viewport.
 *
 * @param {State} state current
 * @param {Action} action dispatched
 *
 * @return {State} updated state
 */
export const setViewport = ( state : State, action : Action ) : State => {
	switch ( action.type ) {
		case 'SET_VIEWPORT' :
			const smallestViewport = Math.min( ... Object.keys( state.viewports )
				.map( Number ) // convert keys to numbers
				.filter( key => key !== 0 ) // exclude zero
			);

			return {
				... state,
				viewport: action.viewport,
				isEditing: action.viewport === smallestViewport ? false : true,
			};
	}

	return state;
}
setViewport.handlesAction = ( actionType ) => actionType === 'SET_VIEWPORT';


/**
 * Set reducer to update viewport by viewportType.
 *
 * @param {State} state current
 * @param {Action} action dispatched
 *
 * @return {State} updated state
 */
export const setViewportType = ( state : State, action : Action ) : State => {
	switch ( action.type ) {
		case 'SET_VIEWPORT_TYPE' :
			let viewportType = action.viewportType;

			const smallestViewport = Math.min( ... Object.keys( state.viewports )
				.map( Number ) // convert keys to numbers
				.filter( key => key !== 0 ) // exclude zero
			);

			if( viewportType === 'mobile' ) {
				return {
					... state,
					isActive: true,
					isEditing: smallestViewport === mobileDefaultViewport ? false : true,
					viewport: mobileDefaultViewport,
				}
			}

			if( viewportType === 'tablet' ) {
				return {
					... state,
					isActive: true,
					isEditing: true,
					viewport: tabletDefaultViewport,
				}
			}

			if( viewportType === 'desktop' ) {
				return {
					... state,
					isActive: true,
					isEditing: true,
					viewport: desktopDefaultViewport,
				}
			}
	}

	return state;
}
setViewportType.handlesAction = ( actionType ) => actionType === 'SET_VIEWPORT_TYPE';


/**
 * Set reducer to update to prev viewport.
 *
 * @param {State} state current
 * @param {Action} action dispatched
 *
 * @return {State} updated state
 */
export const setPrevViewport = ( state : State, action : Action ) : State => {
	switch ( action.type ) {
		case 'SET_PREV_VIEWPORT' :
			switch ( action.viewportType ) {
				case '' :
					const smallestViewport = Math.min( ... Object.keys( state.viewports )
						.map( Number ) // convert keys to numbers
						.filter( key => key !== 0 ) // exclude zero
					);
					const prev = getPrevViewport( state.viewport, state.viewports );

					if( prev > 0 ) {
						return {
							... state,
							isEditing: prev === smallestViewport ? false : true,
							viewport: prev !== 0 ? prev : state.viewport,
						};
					} else {
						return state;
					}

				case 'mobile' :
					const mobileViewports = getViewports( 'mobile', state.viewports );

					if( isInMobileRange( state.viewport ) ) {
						const prev = getPrevViewport( state.viewport, mobileViewports );
						const lastMobileViewport = Object.keys( mobileViewports )
							.map( Number ) // Keys to number.
							.sort( ( a, b ) => a - b ) // Sort numeric
							.pop();

						return {
							... state,
							viewport: prev !== 0 ? prev : lastMobileViewport,
						};

					} else {
						return {
							... state,
							viewport: mobileDefaultViewport,
						}
					}

				case 'tablet' :
					const tabletViewports = getViewports( 'tablet', state.viewports );

					if( isInTabletRange( state.viewport ) ) {
						const prev = getPrevViewport( state.viewport, tabletViewports );
						const lastTabletViewport = Object.keys( tabletViewports )
							.map( Number ) // Keys to number.
							.sort( ( a, b ) => a - b ) // Sort numeric
							.pop();

						return {
							... state,
							viewport: prev !== state.viewport ? prev : lastTabletViewport,
						};

					} else {
						return {
							... state,
							viewport: tabletDefaultViewport,
						}
					}


				case 'desktop' :
					const desktopViewports = getViewports( 'desktop', state.viewports );

					if( isInDesktopRange( state.viewport ) ) {
						const prev = getPrevViewport( state.viewport, desktopViewports );
						const firstDesktopViewport = Object.keys( desktopViewports )
							.map( Number ) // Keys to number.
							.sort( ( a, b ) => a - b ) // Sort numeric
							.shift();

						return {
							... state,
							viewport: prev !== state.viewport ? prev : firstDesktopViewport,
						};

					} else {
						return {
							... state,
							viewport: desktopDefaultViewport,
						}
					}
			}
	}

	return state;
}
setPrevViewport.handlesAction = ( actionType ) => actionType === 'SET_PREV_VIEWPORT';


/**
 * Set reducer to update to next viewport.
 *
 * @param {State} state current
 * @param {Action} action dispatched
 *
 * @return {State} updated state
 */
export const setNextViewport = ( state : State, action : Action ) : State => {
	switch ( action.type ) {
		case 'SET_NEXT_VIEWPORT' :
			switch ( action.viewportType ) {
				case '' :
					const next = getNextViewport( state.viewport, state.viewports );

					return {
						... state,
						isEditing: true,
						viewport: next !== 0 ? next : state.viewport,
					};

				case 'mobile' :
					const mobileViewports = getViewports( 'mobile', state.viewports );

					if( isInMobileRange( state.viewport ) ) {
						const next = getNextViewport( state.viewport, mobileViewports );
						const firstMobileViewport = Object.keys( mobileViewports )
							.map( Number ) // Keys to number.
							.sort( ( a, b ) => a - b ) // Sort numeric
							.shift();

						return {
							... state,
							viewport: next !== state.viewport ? next : firstMobileViewport,
						};

					} else {
						return {
							... state,
							viewport: mobileDefaultViewport,
						}
					}

				case 'tablet' :
					const tabletViewports = getViewports( 'tablet', state.viewports );

					if( isInTabletRange( state.viewport ) ) {
						const next = getNextViewport( state.viewport, tabletViewports );
						const firstTabletViewport = Object.keys( tabletViewports )
							.map( Number ) // Keys to number.
							.sort( ( a, b ) => a - b ) // Sort numeric
							.shift();

						return {
							... state,
							viewport: next !== state.viewport ? next : firstTabletViewport,
						};

					} else {
						return {
							... state,
							viewport: tabletDefaultViewport,
						}
					}


				case 'desktop' :
					const desktopViewports = getViewports( 'desktop', state.viewports );

					if( isInDesktopRange( state.viewport ) ) {
						const next = getNextViewport( state.viewport, desktopViewports );
						const firstDesktopViewport = Object.keys( desktopViewports )
							.map( Number ) // Keys to number.
							.sort( ( a, b ) => a - b ) // Sort numeric
							.shift();

						return {
							... state,
							viewport: next !== state.viewport ? next : firstDesktopViewport,
						};

					} else {
						return {
							... state,
							viewport: desktopDefaultViewport,
						}
					}
			}
	}

	return state;
}
setNextViewport.handlesAction = ( actionType ) => actionType === 'SET_NEXT_VIEWPORT';


/**
 * Set reducer to update desktop viewport size.
 *
 * @param {State} state current
 * @param {Action} action dispatched
 *
 * @return {State} updated state
 */
export const setDesktop = ( state : State, action : Action ) : State => {
	switch ( action.type ) {
		case 'SET_DESKTOP' :
			if( isInDesktopRange( state.viewport ) ) {
				return {
					... state,
					desktop: state.viewport,
				};
			}

			return state;
	}

	return state;
}
setDesktop.handlesAction = ( actionType ) => actionType === 'SET_DESKTOP';


/**
 * Set reducer to update tablet viewport size.
 *
 * @param {State} state current
 * @param {Action} action dispatched
 *
 * @return {State} updated state
 */
export const setTablet = ( state : State, action : Action ) : State => {
	switch ( action.type ) {
		case 'SET_TABLET' :
			if( isInTabletRange( state.viewport ) ) {
				return {
					... state,
					tablet: state.viewport,
				};
			}

			return state;
	}

	return state;
}
setTablet.handlesAction = ( actionType ) => actionType === 'SET_TABLET';


/**
 * Set reducer to update mobile viewport size.
 *
 * @param {State} state current
 * @param {Action} action dispatched
 *
 * @return {State} updated state
 */
export const setMobile = ( state : State, action : Action ) : State => {
	switch ( action.type ) {
		case 'SET_MOBILE' :
			if( isInMobileRange( state.viewport ) ) {
				return {
					... state,
					mobile: state.viewport,
				};
			}

			return state;
	}

	return state;
}
setMobile.handlesAction = ( actionType ) => actionType === 'SET_MOBILE';


/**
 * Set reducer to update iframe size.
 *
 * @param {State} state current
 * @param {Action} action dispatched
 *
 * @return {State} updated state
 */
export const setIframeSize = ( state : State, action : Action ) : State => {
	switch ( action.type ) {
		case 'SET_IFRAME_SIZE' :
			const iframeViewport = getHighestPossibleViewport( state.viewports, action.size.width );

			if( state.iframeViewport !== iframeViewport ) {
				return {
					... state,
					iframeSize: action.size,
					iframeViewport,
				};
			}

			return {
				... state,
				iframeSize: action.size,
			};
	}

	return state;
}
setIframeSize.handlesAction = ( actionType ) => actionType === 'SET_IFRAME_SIZE';


/**
 * Set reducer to update registering indicator to boolean true.
 *
 * @param {State} state current
 * @param {Action} action dispatched
 *
 * @return {State} updated state
 */
export const setRegistering = ( state : State, action : Action ) : State => {
	switch ( action.type ) {
		case 'SET_REGISTERING' :
			return {
				... state,
				isRegistering: true,
			};
	}

	return state;
}
setRegistering.handlesAction = ( actionType ) => actionType === 'SET_REGISTERING';


/**
 * Set reducer to update registering indicator to boolean false.
 *
 * @param {State} state current
 * @param {Action} action dispatched
 *
 * @return {State} updated state
 */
export const unsetRegistering = ( state : State, action : Action ) : State => {
	switch ( action.type ) {
		case 'UNSET_REGISTERING' :
			return {
				... state,
				isRegistering: false,
			};
	}

	return state;
}
unsetRegistering.handlesAction = ( actionType ) => actionType === 'UNSET_REGISTERING';


/**
 * Set reducer to update ready indicator to boolean true.
 *
 * @param {State} state current
 * @param {Action} action dispatched
 *
 * @return {State} updated state
 */
export const setReady = ( state : State, action : Action ) : State => {
	switch ( action.type ) {
		case 'SET_READY' :
			return {
				... state,
				isReady: true,
			};
	}

	return state;
}
setReady.handlesAction = ( actionType ) => actionType === 'SET_READY';


/**
 * Set reducer to update loading indicator to boolean true.
 *
 * @param {State} state current
 * @param {Action} action dispatched
 *
 * @return {State} updated state
 */
export const setLoading = ( state : State, action : Action ) : State => {
	switch ( action.type ) {
		case 'SET_LOADING' :
			return {
				... state,
				isLoading: true,
			};
	}

	return state;
}
setLoading.handlesAction = ( actionType ) => actionType === 'SET_LOADING';


/**
 * Set reducer to update loading indicator to boolean false.
 *
 * @param {State} state current
 * @param {Action} action dispatched
 *
 * @return {State} updated state
 */
export const unsetLoading = ( state : State, action : Action ) : State => {
	switch ( action.type ) {
		case 'UNSET_LOADING' :
			return {
				... state,
				isLoading: false,
			};
	}

	return state;
}
unsetLoading.handlesAction = ( actionType ) => actionType === 'UNSET_LOADING';


/**
 * Set reducer to update saving indicator to boolean true.
 *
 * @param {State} state current
 * @param {Action} action dispatched
 *
 * @return {State} updated state
 */
export const setSaving = ( state : State, action : Action ) : State => {
	switch ( action.type ) {
		case 'SET_SAVING' :
			return {
				... state,
				isSaving: true,
			};
	}

	return state;
}
setSaving.handlesAction = ( actionType ) => actionType === 'SET_SAVING';


/**
 * Set reducer to update saving indicator to boolean false.
 *
 * @param {State} state current
 * @param {Action} action dispatched
 *
 * @return {State} updated state
 */
export const unsetSaving = ( state : State, action : Action ) : State => {
	switch ( action.type ) {
		case 'UNSET_SAVING' :
			return {
				... state,
				isSaving: false,
			};
	}

	return state;
}
unsetSaving.handlesAction = ( actionType ) => actionType === 'UNSET_SAVING';


/**
 * Set reducer to update autosaving indicator to boolean true.
 *
 * @param {State} state current
 * @param {Action} action dispatched
 *
 * @return {State} updated state
 */
export const setAutoSaving = ( state : State, action : Action ) : State => {
	switch ( action.type ) {
		case 'SET_AUTOSAVING' :
			return {
				... state,
				isAutoSaving: true,
			};
	}

	return state;
}
setAutoSaving.handlesAction = ( actionType ) => actionType === 'SET_AUTOSAVING';


/**
 * Set reducer to update autosaving indicator to boolean false.
 *
 * @param {State} state current
 * @param {Action} action dispatched
 *
 * @return {State} updated state
 */
export const unsetAutoSaving = ( state : State, action : Action ) : State => {
	switch ( action.type ) {
		case 'UNSET_AUTOSAVING' :
			return {
				... state,
				isAutoSaving: false,
			};
	}

	return state;
}
unsetAutoSaving.handlesAction = ( actionType ) => actionType === 'UNSET_AUTOSAVING';


/**
 * Set reducer to update state for an active viewport simulation.
 *
 * @param {State} state current
 * @param {Action} action dispatched
 *
 * @return {State} updated state
 */
export const setActive = ( state : State, action : Action ) : State => {
	switch ( action.type ) {
		case 'SET_ACTIVE' :
			let { viewport } = state;

			if( 0 === viewport ) {
				viewport = getHighestPossibleViewport( state.viewports, state.iframeSize.width );
			}

			const smallestViewport = Math.min( ... Object.keys( state.viewports )
				.map( Number ) // convert keys to numbers
				.filter( key => key !== 0 ) // exclude zero
			);

			return {
				... state,
				isActive: true,
				isLoading: false,
				isEditing: viewport === smallestViewport ? false : true,
				viewport: viewport,
			};
	}

	return state;
}
setActive.handlesAction = ( actionType ) => actionType === 'SET_ACTIVE';


/**
 * Set reducer to update state to shut down viewport simulation.
 *
 * @param {State} state current
 * @param {Action} action dispatched
 *
 * @return {State} updated state
 */
export const unsetActive = ( state : State, action : Action ) : State => {
	switch ( action.type ) {
		case 'UNSET_ACTIVE' :
			return {
				... state,
				isActive: false,
				isEditing: false,
			};
	}

	return state;
}
unsetActive.handlesAction = ( actionType ) => actionType === 'UNSET_ACTIVE';


/**
 * Set reducer to set inspecting flag to true.
 *
 * @param {State} state current
 * @param {Action} action dispatched
 *
 * @return {State} updated state
 */
export const setInspecting = ( state : State, action : Action ) : State => {
	switch ( action.type ) {
		case 'SET_INSPECTING' :
			return {
				... state,
				isInspecting: true,
			};
	}

	return state;
}
setInspecting.handlesAction = ( actionType ) => actionType === 'SET_INSPECTING';


/**
 * Set reducer to set inspecting flag to false.
 *
 * @param {State} state current
 * @param {Action} action dispatched
 *
 * @return {State} updated state
 */
export const unsetInspecting = ( state : State, action : Action ) : State => {
	switch ( action.type ) {
		case 'UNSET_INSPECTING' :
			return {
				... state,
				isInspecting: false,
			};
	}

	return state;
}
unsetInspecting.handlesAction = ( actionType ) => actionType === 'UNSET_INSPECTING';


/**
 * Set reducer to toggle inspecting flag.
 *
 * @param {State} state current
 * @param {Action} action dispatched
 *
 * @return {State} updated state
 */
export const toggleInspecting = ( state : State, action : Action ) : State => {
	switch ( action.type ) {
		case 'TOGGLE_INSPECTING' :
			return {
				... state,
				isInspecting: ! state.isInspecting,
			};
	}

	return state;
}
toggleInspecting.handlesAction = ( actionType ) => actionType === 'TOGGLE_INSPECTING';


/**
 * Set reducer to set inspector position.
 *
 * @param {State} state current
 * @param {Action} action dispatched
 *
 * @return {State} updated state
 */
export const setInspectorPosition = ( state : State, action : Action ) : State => {
	switch ( action.type ) {
		case 'SET_INSPECTOR_POSITION' :
			return {
				... state,
				inspectorPosition: action.position,
			};
	}

	return state;
}
setInspectorPosition.handlesAction = ( actionType ) => actionType === 'SET_INSPECTOR_POSITION';


/**
 * Set reducer to update state for active editing.
 *
 * @param {State} state current
 * @param {Action} action dispatched
 *
 * @return {State} updated state
 */
export const setEditing = ( state : State, action : Action ) : State => {
	switch ( action.type ) {
		case 'SET_EDITING' :
			return {
				... state,
				isEditing: true,
			};
	}

	return state;
}
setEditing.handlesAction = ( actionType ) => actionType === 'SET_EDITING';


/**
 * Set reducer to update state to shut down editing.
 *
 * @param {State} state current
 * @param {Action} action dispatched
 *
 * @return {State} updated state
 */
export const unsetEditing = ( state : State, action : Action ) : State => {
	switch ( action.type ) {
		case 'UNSET_EDITING' :
			return {
				... state,
				isEditing: false,
			};
	}

	return state;
}
unsetEditing.handlesAction = ( actionType ) => actionType === 'UNSET_EDITING';


/**
 * Set reducer to toggle editing flag.
 *
 * @param {State} state current
 * @param {Action} action dispatched
 *
 * @return {State} updated state
 */
export const toggleEditing = ( state : State, action : Action ) : State => {
	switch ( action.type ) {
		case 'TOGGLE_EDITING' :
			return {
				... state,
				isEditing: ! state.isEditing,
			};
	}

	return state;
}
toggleEditing.handlesAction = ( actionType ) => actionType === 'TOGGLE_EDITING';


/**
 * Set reducer to toggle active and inactive viewport simulation.
 *
 * @param {State} state current
 * @param {Action} action dispatched
 *
 * @return {State} updated state
 */
export const toggleActive = ( state : State, action : Action ) : State => {
	switch ( action.type ) {
		case 'TOGGLE_ACTIVE' :
			const isActive = state.isActive ? false : true;
			let viewport = state.viewport;

			if( isActive && 0 === viewport ) {
				viewport = getHighestPossibleViewport( state.viewports, state.iframeSize.width );
			}

			const smallestViewport = Math.min( ... Object.keys( state.viewports )
				.map( Number ) // convert keys to numbers
				.filter( key => key !== 0 ) // exclude zero
			);

			return {
				... state,
				isActive: isActive,
				isEditing: viewport === smallestViewport ? false : true,
				viewport: viewport,
			};
	}

	return state;
}
toggleActive.handlesAction = ( actionType ) => actionType === 'TOGGLE_ACTIVE';


/**
 * Set reducer to toggle viewport to stored desktop viewport.
 *
 * @param {State} state current
 * @param {Action} action dispatched
 *
 * @return {State} updated state
 */
export const toggleDesktop = ( state : State, action : Action ) : State => {
	switch ( action.type ) {
		case 'TOGGLE_DESKTOP' :
			return {
				... state,
				isEditing: true,
				viewport: state.desktop,
			};
	}

	return state;
}
toggleDesktop.handlesAction = ( actionType ) => actionType === 'TOGGLE_DESKTOP';


/**
 * Set reducer to toggle viewport to stored tablet viewport.
 *
 * @param {State} state current
 * @param {Action} action dispatched
 *
 * @return {State} updated state
 */
export const toggleTablet = ( state : State, action : Action ) : State => {
	switch ( action.type ) {
		case 'TOGGLE_TABLET' :
			return {
				... state,
				isEditing: true,
				viewport: state.tablet,
			};
	}

	return state;
}
toggleTablet.handlesAction = ( actionType ) => actionType === 'TOGGLE_TABLET';


/**
 * Set reducer to toggle viewport to stored mobile viewport.
 *
 * @param {State} state current
 * @param {Action} action dispatched
 *
 * @return {State} updated state
 */
export const toggleMobile = ( state : State, action : Action ) : State => {
	switch ( action.type ) {
		case 'TOGGLE_MOBILE' :
			const smallestViewport = Math.min( ... Object.keys( state.viewports )
				.map( Number ) // convert keys to numbers
				.filter( key => key !== 0 ) // exclude zero
			);

			return {
				... state,
				isEditing: state.mobile === smallestViewport ? false : true,
				viewport: state.mobile,
			};
	}

	return state;
}
toggleMobile.handlesAction = ( actionType ) => actionType === 'TOGGLE_MOBILE';


/**
 * Set reducer to register a block init.
 *
 * @param {State} state current
 * @param {Action} action dispatched
 *
 * @return {State} updated state
 */
export const registerBlockInit = ( state : State, action : Action ) : State => {
	switch ( action.type ) {
		case 'REGISTER_BLOCK_INIT' :
			// console.log( 'REGISTER_BLOCK_INIT' );

			// Deconstruct action.
			const {
				clientId,
				blockName,
				attributes
			} = action;

			// Bubble out on undefined clientId.
			if( '' === clientId || 'undefined' === typeof clientId ) {
				return state;
			}

			// Deconstruct state.
			const { saves, valids } = state;

			// Find defaults and viewport saves.
			const blockSaves = findBlockSaves( attributes );

			// Set initState.
			const initState = {
				... state,
				saves: {
					... saves,
					[ clientId ]: blockSaves,
				}
			}

			// Set blockValids.
			const blockValids = findBlockValids( clientId, initState );

			// Set spectrumState for spectrumSet generation.
			const spectrumState = {
				valids: blockValids,
				saves: blockSaves,
				changes: {},
				removes: {},
				rendererPropertySet: initState.renderer,
				isSaving: initState.isSaving,
				viewport: initState.viewport,
			};

			// Deconstruct spectrumProperties.
			const {
				cssViewportSet,
				spectrumSet,
				inlineStyle,
			} = getSpectrumProperties( clientId, blockName, spectrumState );

			// Return new state.
			return {
				... initState,
				valids: {
					... valids,
					[ clientId ]: blockValids
				},
				cssSet: {
					... initState.cssSet,
					[ clientId ]: cssViewportSet,
				},
				spectrumSets: {
					... initState.spectrumSets,
					[ clientId ]: spectrumSet,
				},
				inlineStyleSets: {
					... initState.inlineStyleSets,
					[ clientId ]: inlineStyle,
				},
			}
	}

	return state;
}
registerBlockInit.handlesAction = ( actionType ) => actionType === 'REGISTER_BLOCK_INIT';


/**
 * Set reducer to update block changes.
 *
 * @param {State} state current
 * @param {Action} action dispatched
 *
 * @return {State} updated state
 */
export const updateBlockChanges = ( state : State, action : Action ) : State => {
	switch ( action.type ) {
		case 'UPDATE_BLOCK_CHANGES' :

			// Deconstruct state and action.
			const { changes, removes, valids } = state;
			const {
				clientId,
				blockName,
				attributes
			} = action;

			// Set new generated block changes by comparing it to the actual viewport valid.
			// Here you will get just the difference between both.
			const viewport = null !== action.viewport ? action.viewport : state.isEditing ? state.viewport : state.iframeViewport;

			// Set differences resulting from new attribute state.
			const differences = findBlockDifferences( clientId, cloneDeep( attributes ), state, viewport );
			const blockChanges = differences.changes;
			const blockRemoves = differences.removes;
			const hasChanges = traverseExist( [ clientId ], blockChanges );
			const hasRemoves = traverseExist( [ clientId ], blockRemoves );

			// Set initial nextState.
			let nextState : any = { ... state };

			// Set new changes state.
			if( hasChanges ) {
				nextState = {
					... nextState,
					changes: {
						... changes,
						[ clientId ]: traverseGet( [ clientId ], blockChanges ),
					}
				}
			} else {
				if( traverseExist( [ clientId ], changes ) ) {
					delete nextState.changes[ clientId ];
				}
			}

			// Set new removes state.
			if( hasRemoves ) {
				nextState = {
					... nextState,
					removes: {
						... removes,
						[ clientId ]: traverseGet( [ clientId ], blockRemoves ),
					}
				}
			} else {
				if( traverseExist( [ clientId ], removes ) ) {
					delete nextState.removes[ clientId ];
				}
			}

			// Set new generated block valids from new generated block changes.
			const blockValids = findBlockValids( clientId, nextState );

			// Set spectrumState for spectrumSet generation.
			const spectrumState = {
				valids: blockValids,
				saves: traverseGet( [ clientId ], nextState.saves ) || {},
				changes: traverseGet( [ clientId ], nextState.changes ),
				removes: traverseGet( [ clientId ], nextState.removes ),
				rendererPropertySet: nextState.renderer,
				isSaving: nextState.isSaving,
				viewport: nextState.viewport,
			};

			// Deconstruct spectrumProperties.
			const {
				cssViewportSet,
				spectrumSet,
				inlineStyle,
			} = getSpectrumProperties( clientId, blockName, spectrumState );

			// Return new state.
			return {
				... nextState,
				viewports: state.viewports,
				lastEdit: state.lastEdit,
				valids: {
					... valids,
					[ clientId ]: blockValids,
				},
				cssSet: {
					... state.cssSet,
					[ clientId ]: cssViewportSet,
				},
				spectrumSets: {
					... state.spectrumSets,
					[ clientId ]: spectrumSet,
				},
				inlineStyleSets: {
					... state.inlineStyleSets,
					[ clientId ]: inlineStyle,
				},
			}
	}

	return state;
}
updateBlockChanges.handlesAction = ( actionType ) => actionType === 'UPDATE_BLOCK_CHANGES';


/**
 * Set reducer to add block changes.
 *
 * @param {State} state current
 * @param {Action} action dispatched
 *
 * @return {State} updated state
 */
export const addBlockPropertyChanges = ( state : State, action : Action ) : State => {
	switch ( action.type ) {
		case 'ADD_BLOCK_PROPERTY_CHANGES' :

			// Deconstruct state and action.
			const { changes, valids } = state;
			const {
				clientId,
				blockName,
				viewport,
				prop
			} = action;

			// Check if changes already filled with prop for viewport.
			if( traverseFilled( [ clientId, viewport, 'style', prop ], changes ) ) {
				return state;
			}

			// From now on we know that we need to merge a new property set.
			const validStyle = traverseGet( [ clientId, viewport, 'style', prop ], valids, {} );

			// Set initial nextState.
			let nextState : any = {};

			// Check if we need to merge to the deepest.
			if( traverseFilled( [ clientId, viewport, 'style' ], changes ) ) {
				nextState = {
					... state,
					changes: {
						... changes,
						[ clientId ]: {
							... changes[ clientId ],
							[ viewport ]: {
								style: {
									... changes[ clientId ][ viewport ][ 'style' ],
									[ prop ]: validStyle,
								}
							}
						}
					}
				}
			} else {

				// Check if we need to merge on clientId.
				if( traverseFilled( [ clientId ], changes ) ) {
					nextState = {
						... state,
						changes: {
							... changes,
							[ clientId ]: {
								... changes[ clientId ],
								[ viewport ]: {
									style: {
										[ prop ]: validStyle,
									}
								}
							}
						}
					}
				} else {

					// Merge new clientId.
					nextState = {
						... state,
						changes: {
							... changes,
							[ clientId ]: {
								[ viewport ]: {
									style: {
										[ prop ]: validStyle,
									}
								}
							}
						}
					}
				}
			}

			// Set new generated block valids from new generated block changes.
			const blockValids = findBlockValids( clientId, nextState );

			// Set spectrumState for spectrumSet generation.
			const spectrumState = {
				valids: blockValids,
				saves: traverseGet( [ clientId ], nextState.saves ) || {},
				changes: traverseGet( [ clientId ], nextState.changes ),
				removes: traverseGet( [ clientId ], nextState.removes ),
				rendererPropertySet: nextState.renderer,
				isSaving: nextState.isSaving,
				viewport: nextState.viewport,
			};

			// Deconstruct spectrumProperties.
			const {
				cssViewportSet,
				spectrumSet,
				inlineStyle,
			} = getSpectrumProperties( clientId, blockName, spectrumState );

			// Return new state.
			return {
				... nextState,
				viewports: state.viewports,
				lastEdit: state.lastEdit,
				valids: {
					... valids,
					[ clientId ]: blockValids,
				},
				cssSet: {
					... state.cssSet,
					[ clientId ]: cssViewportSet,
				},
				spectrumSets: {
					... state.spectrumSets,
					[ clientId ]: spectrumSet,
				},
				inlineStyleSets: {
					... state.inlineStyleSets,
					[ clientId ]: inlineStyle,
				},
			}
	}

	return state;
}
addBlockPropertyChanges.handlesAction = ( actionType ) => actionType === 'ADD_BLOCK_PROPERTY_CHANGES';


/**
 * Set reducer to remove block.
 *
 * @param {State} state current
 * @param {Action} action dispatched
 *
 * @return {State} updated state
 */
export const removeBlock = ( state : State, action : Action ) : State => {
	switch ( action.type ) {
		case 'REMOVE_BLOCK' :

			// Deconstruct action.
			const { clientId } = action;

			// Remove saves entry.
			const saves = { ... state.saves };
			delete saves[ clientId ];

			// Remove changes entry.
			const changes = { ... state.changes };
			delete changes[ clientId ];

			// Remove removes entry.
			const removes = { ... state.removes };
			delete removes[ clientId ];

			// Remove valids entry.
			const valids = { ... state.valids };
			delete valids[ clientId ];

			// Return new state.
			return {
				... state,
				saves,
				changes,
				removes,
				valids,
			};
	}

	return state;
}
removeBlock.handlesAction = ( actionType ) => actionType === 'REMOVE_BLOCK';


/**
 * Set reducer to remove block saves.
 *
 * @param {State} state current
 * @param {Action} action dispatched
 *
 * @return {State} updated state
 */
export const removeBlockSaves = ( state : State, action : Action ) : State => {
	switch ( action.type ) {
		case 'REMOVE_BLOCK_SAVES' :
			const {
				clientId,
				blockName,
				viewport,
				props
			} = action;

			const {
				saves,
				removes,
				valids
			} = state;

			// Set states.
			const blockSaves = traverseGet( [ clientId, viewport, 'style' ], saves ) || {};
			const blockRemoves = traverseGet( [ clientId, viewport, 'style' ], removes ) || {};

			// Set indicators.
			const hasBlockSaves = Object.keys( blockSaves ).length ? true : false;
			const hasBlockRemoves = Object.keys( blockRemoves ).length ? true : false;

			// Check if there are blockSaves to remove.
			if ( hasBlockSaves ) {
				const foundRemoves = findRemoves( [ ... props ], cloneDeep( blockSaves ) );

				let nextRemoves = {};
				if ( hasBlockRemoves ) {
					nextRemoves = getMergedObject( blockRemoves, foundRemoves );
				} else {
					nextRemoves = foundRemoves;
				}

				let nextState : State = {
					... state,
					removes: {
						... removes,
						[ clientId ]: {
							... removes[ clientId ],
							[ viewport ]: {
								style: nextRemoves,
							},
						}
					}
				}

				// Generate new valids from new state.
				const blockValids = findBlockValids( clientId, nextState );

				// Set spectrumState for spectrumSet generation.
				const spectrumState = {
					valids: blockValids,
					saves: traverseGet( [ clientId ], nextState.saves ) || {},
					changes: traverseGet( [ clientId ], nextState.changes ),
					removes: traverseGet( [ clientId ], nextState.removes ),
					rendererPropertySet: nextState.renderer,
					isSaving: nextState.isSaving,
					viewport: nextState.viewport,
				};

				// Deconstruct spectrumProperties.
				const {
					cssViewportSet,
					spectrumSet,
					inlineStyle,
				} = getSpectrumProperties( clientId, blockName, spectrumState );

				// Return new state.
				return {
					... nextState,
					valids: {
						... valids,
						[ clientId ]: blockValids
					},
					cssSet: {
						... state.cssSet,
						[ clientId ]: cssViewportSet,
					},
					spectrumSets: {
						... state.spectrumSets,
						[ clientId ]: spectrumSet,
					},
					inlineStyleSets: {
						... state.inlineStyleSets,
						[ clientId ]: inlineStyle,
					},
					lastEdit: Date.now(),
				}
			}
	}

	return state;
}
removeBlockSaves.handlesAction = ( actionType ) => actionType === 'REMOVE_BLOCK_SAVES';


/**
 * Set reducer to restore block saves.
 *
 * @param {State} state current
 * @param {Action} action dispatched
 *
 * @return {State} updated state
 */
export const restoreBlockSaves = ( state : State, action : Action ) : State => {
	switch ( action.type ) {
		case 'RESTORE_BLOCK_SAVES' :

			// Deconstruct state and action.
			const {
				clientId,
				blockName,
				viewport,
				props
			} = action;

			const {
				changes,
				removes,
				valids
			} = state;

			// Set nextState.
			let nextState : any = { ... state };

			// Set states.
			const blockChangesStyle = cloneDeep( traverseGet( [ clientId, viewport, 'style' ], changes ) );
			const blockRemovesStyle = cloneDeep( traverseGet( [ clientId, viewport, 'style' ], removes ) );

			// Set indicators.
			const hasChanges = blockChangesStyle && Object.keys( blockChangesStyle ).length ? true : false;
			const hasRemoves = blockRemovesStyle && Object.keys( blockRemovesStyle ).length ? true : false;

			// Check if there is an entry for clientId and viewport to remove from changes.
			if ( hasChanges ) {

				// Check if we need to restore a specific key, or if we need to restore everything.
				const blockRemoves = props.length > 0 ? findRemoves( [ ... props ], blockChangesStyle ) : blockChangesStyle;
				const blockChanges = findCleanedChanges( blockChangesStyle, blockRemoves );

				// Check viewport changes to update or to remove viewport changes.
				if ( 0 < Object.entries( blockChanges ).length ) {
					nextState = {
						... nextState,
						changes: {
							... changes,
							[ clientId ]: {
								... changes[ clientId ],
								[ viewport ]: {
									style: blockChanges,
								}
							}
						}
					}
				} else {
					const cleanedViewports = {
						... changes,
						[ clientId ]: {
							... changes[ clientId ]
						}
					};
					delete cleanedViewports[ clientId ][ viewport ];

					nextState = {
						... nextState,
						changes: cleanedViewports,
					}
				}

				// Check clientId changes on emptyness to cleanup.
				if ( 0 === Object.entries( nextState.changes[ clientId ] ).length ) {
					const cleanedChanges = {
						... changes,
					};

					delete cleanedChanges[ clientId ];

					nextState = {
						... nextState,
						changes: cleanedChanges,
					}
				}
			}

			// Check if there is an entry for clientId and viewport to remove from removes.
			if ( hasRemoves ) {

				// Set new block removes and changes.
				const blockRemoves = findRemoves( [ ... props ], blockRemovesStyle );
				const blockChanges = findCleanedChanges( blockRemovesStyle, blockRemoves );

				// Check viewport removes to update or to remove viewport removes.
				if ( 0 < Object.entries( blockChanges ).length ) {
					nextState = {
						... nextState,
						removes: {
							... removes,
							[ clientId ]: {
								... removes[ clientId ],
								[ viewport ]: {
									style: blockChanges,
								}
							}
						}
					}
				} else {
					const cleanedViewports = {
						... removes,
						[ clientId ]: {
							... removes[ clientId ]
						}
					};
					delete cleanedViewports[ clientId ][ viewport ];

					nextState = {
						... nextState,
						removes: cleanedViewports,
					}
				}

				// Check clientId removes on emptyness to cleanup.
				if ( 0 === Object.entries( nextState.removes[ clientId ] ).length ) {
					const cleanedRemoves = {
						... removes,
					};

					delete cleanedRemoves[ clientId ];

					nextState = {
						... nextState,
						removes: cleanedRemoves,
					}
				}
			}

			// Generate new valids from new state.
			const blockValids = findBlockValids( clientId, nextState );

			// Set spectrumState for spectrumSet generation.
			const spectrumState = {
				valids: blockValids,
				saves: traverseGet( [ clientId ], nextState.saves ) || {},
				changes: traverseGet( [ clientId ], nextState.changes ),
				removes: traverseGet( [ clientId ], nextState.removes ),
				rendererPropertySet: nextState.renderer,
				isSaving: nextState.isSaving,
				viewport: nextState.viewport,
			};

			// Deconstruct spectrumProperties.
			const {
				cssViewportSet,
				spectrumSet,
				inlineStyle,
			} = getSpectrumProperties( clientId, blockName, spectrumState );

			// Return new state.
			return {
				... nextState,
				valids: {
					... valids,
					[ clientId ]: blockValids
				},
				cssSet: {
					... state.cssSet,
					[ clientId ]: cssViewportSet,
				},
				spectrumSets: {
					... state.spectrumSets,
					[ clientId ]: spectrumSet,
				},
				inlineStyleSets: {
					... state.inlineStyleSets,
					[ clientId ]: inlineStyle,
				},
				lastEdit: Date.now(),
			}
	}

	return state;
}
restoreBlockSaves.handlesAction = ( actionType ) => actionType === 'RESTORE_BLOCK_SAVES';


/**
 * Set reducer to save block.
 *
 * @param {State} state current
 * @param {Action} action dispatched
 *
 * @return {State} updated state
 */
export const saveBlock = ( state : State, action : Action ) : State => {
	switch ( action.type ) {
		case 'SAVE_BLOCK' :
			const { clientId, blockName } = action;
			const {
				saves,
				changes,
				removes,
				valids
			} = state;

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
				return state;
			}

			// Set merged blockSaves.
			blockSaves = getMergedObject( blockSaves, blockChanges );

			// Cleanup saves from removes.
			blockSaves = findCleanedChanges( blockSaves, blockRemoves );

			// Cleanup saves on emptyness.
			blockSaves = clearEmptySaves( blockSaves );
			blockSaves = clearDuplicateSaves( blockSaves );

			// Cleanup changes and removes.
			if( hasBlockChanges ) {
				delete changes[ clientId ];
			}
			if( hasBlockRemoves ) {
				delete removes[ clientId ];
			}

			// Build nextState to build new block valids.
			const nextState = {
				... state,
				saves: {
					... saves,
					[ clientId ]: blockSaves,
				},
				changes: { ... changes },
				removes: { ... removes },
			}

			// Generate new valids from new state.
			const blockValids = findBlockValids( clientId, nextState );

			// Set spectrumState for spectrumSet generation.
			const spectrumState = {
				valids: blockValids,
				saves: traverseGet( [ clientId ], nextState.saves ) || {},
				changes: traverseGet( [ clientId ], nextState.changes ),
				removes: traverseGet( [ clientId ], nextState.removes ),
				rendererPropertySet: nextState.renderer,
				isSaving: nextState.isSaving,
				viewport: nextState.viewport,
			};

			// Deconstruct spectrumProperties.
			const {
				cssViewportSet,
				spectrumSet,
				inlineStyle,
			} = getSpectrumProperties( clientId, blockName, spectrumState );

			return {
				... nextState,
				valids: {
					... valids,
					[ clientId ]: blockValids
				},
				cssSet: {
					... state.cssSet,
					[ clientId ]: cssViewportSet,
				},
				spectrumSets: {
					... state.spectrumSets,
					[ clientId ]: spectrumSet,
				},
				inlineStyleSets: {
					... state.inlineStyleSets,
					[ clientId ]: inlineStyle,
				},
			}
	}

	return state;
}
saveBlock.handlesAction = ( actionType ) => actionType === 'SAVE_BLOCK';


/**
 * Set reducer to clear blocks.
 *
 * @param {State} state current
 * @param {Action} action dispatched
 *
 * @return {State} updated state
 */
export const clearBlocks = ( state : State, action : Action ) : State => {
	switch ( action.type ) {
		case 'CLEAR_BLOCKS':
			return {
				... state,
				saves: {},
				changes: {},
				removes: {},
				valids: {},
			}
	}

	return state;
}
clearBlocks.handlesAction = ( actionType ) => actionType === 'CLEAR_BLOCKS';


/**
 * Set reducer to register custom style renderer.
 *
 * @param {State} state current
 * @param {Action} action dispatched
 *
 * @return {State} updated state
 */
export const registerRenderer = ( state : State, action : Action ) : State => {
	if( action.type === 'REGISTER_RENDERER' ) {
		const {
			prop,
			callback,
			priority,
			selectors,
			mapping
		} = action;

		if ( state.renderer.hasOwnProperty( prop ) ) {
			return {
				... state,
				renderer: {
					... state.renderer,
					[ prop ]: {
						... state.renderer[ prop ],
						[ priority ]: {
							type: 'custom',
							callback,
							selectors,
							mapping: mapping ?? {},
						}
					}
				}
			}
		}

		return {
			... state,
			renderer: {
				... state.renderer,
				[ prop ]: {
					[ priority ]: {
						type: 'custom',
						callback,
						selectors,
						mapping: mapping ?? {},
					}
				}
			},
			lastEdit: Date.now(),
		}
	}

	return state;
}
registerRenderer.handlesAction = ( actionType ) => actionType === 'REGISTER_RENDERER';


/**
 * Set reducer to handle.
 */
export const defaultReducers = {
	setViewports,
	setViewport,
	setViewportType,
	setPrevViewport,
	setNextViewport,
	setDesktop,
	setTablet,
	setMobile,
	setIframeSize,
	setRegistering,
	unsetRegistering,
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
	toggleInspecting,
	setInspectorPosition,
	setEditing,
	unsetEditing,
	toggleEditing,
	toggleActive,
	toggleDesktop,
	toggleTablet,
	toggleMobile,
	registerBlockInit,
	updateBlockChanges,
	addBlockPropertyChanges,
	removeBlock,
	removeBlockSaves,
	restoreBlockSaves,
	saveBlock,
	clearBlocks,
	registerRenderer,
};


/**
 * Set function to get reduced next state.
 *
 * @param {State} state
 * @param {Action} action
 * @param {typeof defaultReducers} reducers
 *
 * @return {State} nextState
 */
const getReducedNextState = ( state : State, action : Action, reducers : typeof defaultReducers ) : State => {
	let nextState = state;

	if( ! nextState ) {
		nextState = DEFAULT_STATE;
	}

	for( const [ name, callback ] of Object.entries( reducers ) ) {
		if( callback.handlesAction && ! callback.handlesAction( action.type ) ) {
			continue;
		}

		nextState = callback( nextState, action );
	}

	return nextState;
};


/**
 * Set function to create the reducer manager to append reducers.
 *
 * @param {typeof defaultReducers} defaultReducers
 *
 * @return {ReducerManager}
 */
const createReducerManager = ( defaultReducers ) : ReducerManager => {
	const reducers = { ... defaultReducers };

	return {
		reducer: ( state, action ) => getReducedNextState( state, action, reducers ),
		addReducer: ( name, reducer ) => {
			if( ! name || reducers[ name ] ) {
				return;
			}

			reducers[ name ] = reducer;
		},
	};
};

/**
 * Create reducerManager with default reducers and export it.
 */
const reducerManager = createReducerManager( defaultReducers );
export default reducerManager;
