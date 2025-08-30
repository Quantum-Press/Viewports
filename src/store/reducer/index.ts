import type { State, Action, ReducerManager } from '@viewports/types';
import {
	isInMobileRange,
	isInTabletRange,
	isInDesktopRange,
	getHighestPossibleViewport,
	getPrevViewport,
	getNextViewport,
	getViewports,
} from '@viewports/store/utils';

import {
	DEFAULT_STATE,
	mobileDefaultViewport,
	tabletDefaultViewport,
	desktopDefaultViewport,
} from '../default';
import { updateBlockChanges } from './updateBlockChanges';
import { registerBlockInit } from './registerBlockInit';
import { removeBlock } from './removeBlock';
import { removeBlockSaves } from './removeBlockSaves';
import { restoreBlockSaves } from './restoreBlockSaves';
import { saveBlock } from './saveBlock';


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
			}
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
