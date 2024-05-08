import type { State, Action, Reducers } from './types';
import { DEFAULT_STATE } from './default';
import { isObject, getMergedAttributes, traverseGet } from '../utils';
import {
	isInMobileRange,
	isInTabletRange,
	isInDesktopRange,
	getHighestPossibleViewport,
	findBlockSaves,
	findBlockValids,
	findBlockChanges,
	findRemoves,
	findCleanedChanges,
	clearEmptySaves,
	clearDuplicateSaves,
	getSpectrumProperties
} from './utils';

const { isEqual, cloneDeep } = window[ 'lodash' ];


/**
 * Set reducer to update viewports list.
 *
 * @param {State} state current
 * @param {Action} action dispatched
 *
 * @since 0.1.0
 *
 * @return {State} updated state
 */
export function setViewports( state : State , action : Action ) : State {
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


/**
 * Set reducer to update viewport.
 *
 * @param {State} state current
 * @param {Action} action dispatched
 *
 * @since 0.1.0
 *
 * @return {State} updated state
 */
export function setViewport( state : State, action : Action ) : State {
	switch ( action.type ) {
		case 'SET_VIEWPORT' :
			let viewport = action.viewport;

			if( ! state.isActive ) {
				let wrap = document.querySelector( '.interface-interface-skeleton__content' );
				viewport = wrap ? wrap.getBoundingClientRect().width : state.viewport;
			}

			return {
				... state,
				viewport: viewport,
			};
	}

	return state;
}


/**
 * Set reducer to update to prev viewport.
 *
 * @param {State} state current
 * @param {Action} action dispatched
 *
 * @since 0.1.0
 *
 * @return {State} updated state
 */
export function setPrevViewport( state : State, action : Action ) : State {
	switch ( action.type ) {
		case 'SET_PREV_VIEWPORT' :
			let last = 0;

			for( const [ dirtyViewport ] of Object.entries( state.viewports ) ) {
				const viewport = parseInt( dirtyViewport );

				if( state.viewport === viewport ) {
					break;
				}

				last = viewport;
			}

			if( last === 0 ) {
				return state;
			}

			return {
				... state,
				viewport: last,
			};
	}

	return state;
}


/**
 * Set reducer to update to next viewport.
 *
 * @param {State} state current
 * @param {Action} action dispatched
 *
 * @since 0.1.0
 *
 * @return {State} updated state
 */
export function setNextViewport( state : State, action : Action ) : State {
	switch ( action.type ) {
		case 'SET_NEXT_VIEWPORT' :
			let next = 0;

			for( const [ dirtyViewport ] of Object.entries( state.viewports ) ) {
				const viewport = parseInt( dirtyViewport );

				next = viewport;

				if( state.viewport < viewport ) {
					break;
				}

			}

			if( next === state.viewport ) {
				return state;
			}

			return {
				... state,
				viewport: next,
			};
	}

	return state;
}


/**
 * Set reducer to update desktop viewport size.
 *
 * @param {State} state current
 * @param {Action} action dispatched
 *
 * @since 0.1.0
 *
 * @return {State} updated state
 */
export function setDesktop( state : State, action : Action ) : State {
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


/**
 * Set reducer to update tablet viewport size.
 *
 * @param {State} state current
 * @param {Action} action dispatched
 *
 * @since 0.1.0
 *
 * @return {State} updated state
 */
export function setTablet( state : State, action : Action ) : State {
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


/**
 * Set reducer to update mobile viewport size.
 *
 * @param {State} state current
 * @param {Action} action dispatched
 *
 * @since 0.1.0
 *
 * @return {State} updated state
 */
export function setMobile( state : State, action : Action ) : State {
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


/**
 * Set reducer to update iframe size.
 *
 * @param {State} state current
 * @param {Action} action dispatched
 *
 * @since 0.1.0
 *
 * @return {State} updated state
 */
export function setIframeSize( state : State, action : Action ) : State {
	switch ( action.type ) {
		case 'SET_IFRAME_SIZE' :
			return {
				... state,
				iframeSize: action.size,
			};
	}

	return state;
}


/**
 * Set reducer to update registering indicator to boolean true.
 *
 * @param {State} state current
 * @param {Action} action dispatched
 *
 * @since 0.1.0
 *
 * @return {State} updated state
 */
export function setRegistering( state : State, action : Action ) : State {
	switch ( action.type ) {
		case 'SET_REGISTERING' :
			return {
				... state,
				isRegistering: true,
			};
	}

	return state;
}


/**
 * Set reducer to update registering indicator to boolean false.
 *
 * @param {State} state current
 * @param {Action} action dispatched
 *
 * @since 0.1.0
 *
 * @return {State} updated state
 */
export function unsetRegistering( state : State, action : Action ) : State {
	switch ( action.type ) {
		case 'UNSET_REGISTERING' :
			return {
				... state,
				isRegistering: false,
			};
	}

	return state;
}


/**
 * Set reducer to update ready indicator to boolean true.
 *
 * @param {State} state current
 * @param {Action} action dispatched
 *
 * @since 0.1.0
 *
 * @return {State} updated state
 */
export function setReady( state : State, action : Action ) : State {
	switch ( action.type ) {
		case 'SET_READY' :
			return {
				... state,
				isReady: true,
			};
	}

	return state;
}


/**
 * Set reducer to update loading indicator to boolean true.
 *
 * @param {State} state current
 * @param {Action} action dispatched
 *
 * @since 0.1.0
 *
 * @return {State} updated state
 */
export function setLoading( state : State, action : Action ) : State {
	switch ( action.type ) {
		case 'SET_LOADING' :
			return {
				... state,
				isLoading: true,
			};
	}

	return state;
}


/**
 * Set reducer to update loading indicator to boolean false.
 *
 * @param {State} state current
 * @param {Action} action dispatched
 *
 * @since 0.1.0
 *
 * @return {State} updated state
 */
export function unsetLoading( state : State, action : Action ) : State {
	switch ( action.type ) {
		case 'UNSET_LOADING' :
			return {
				... state,
				isLoading: false,
			};
	}

	return state;
}


/**
 * Set reducer to update saving indicator to boolean true.
 *
 * @param {State} state current
 * @param {Action} action dispatched
 *
 * @since 0.1.0
 *
 * @return {State} updated state
 */
export function setSaving( state : State, action : Action ) : State {
	switch ( action.type ) {
		case 'SET_SAVING' :
			return {
				... state,
				isSaving: true,
			};
	}

	return state;
}


/**
 * Set reducer to update saving indicator to boolean false.
 *
 * @param {State} state current
 * @param {Action} action dispatched
 *
 * @since 0.1.0
 *
 * @return {State} updated state
 */
export function unsetSaving( state : State, action : Action ) : State {
	switch ( action.type ) {
		case 'UNSET_SAVING' :
			return {
				... state,
				isSaving: false,
			};
	}

	return state;
}


/**
 * Set reducer to update autosaving indicator to boolean true.
 *
 * @param {State} state current
 * @param {Action} action dispatched
 *
 * @since 0.1.0
 *
 * @return {State} updated state
 */
export function setAutoSaving( state : State, action : Action ) : State {
	switch ( action.type ) {
		case 'SET_AUTOSAVING' :
			return {
				... state,
				isAutoSaving: true,
			};
	}

	return state;
}


/**
 * Set reducer to update autosaving indicator to boolean false.
 *
 * @param {State} state current
 * @param {Action} action dispatched
 *
 * @since 0.1.0
 *
 * @return {State} updated state
 */
export function unsetAutoSaving( state : State, action : Action ) : State {
	switch ( action.type ) {
		case 'UNSET_AUTOSAVING' :
			return {
				... state,
				isAutoSaving: false,
			};
	}

	return state;
}


/**
 * Set reducer to update state for an active viewport simulation.
 *
 * @param {State} state current
 * @param {Action} action dispatched
 *
 * @since 0.1.0
 *
 * @return {State} updated state
 */
export function setActive( state : State, action : Action ) : State {
	switch ( action.type ) {
		case 'SET_ACTIVE' :
			let { viewport } = state;

			if( 0 === viewport ) {
				viewport = getHighestPossibleViewport( state.viewports );
			}

			return {
				... state,
				isActive:   true,
				isLoading:  false,
				viewport:   viewport,
			};
	}

	return state;
}


/**
 * Set reducer to update state to shut down viewport simulation.
 *
 * @param {State} state current
 * @param {Action} action dispatched
 *
 * @since 0.1.0
 *
 * @return {State} updated state
 */
export function unsetActive( state : State, action : Action ) : State {
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


/**
 * Set reducer to set inspecting flag to true.
 *
 * @param {State} state current
 * @param {Action} action dispatched
 *
 * @since 0.2.2
 *
 * @return {State} updated state
 */
export function setInspecting( state : State, action : Action ) : State {
	switch ( action.type ) {
		case 'SET_INSPECTING' :
			return {
				... state,
				isInspecting: true,
			};
	}

	return state;
}


/**
 * Set reducer to set inspecting flag to false.
 *
 * @param {State} state current
 * @param {Action} action dispatched
 *
 * @since 0.2.2
 *
 * @return {State} updated state
 */
export function unsetInspecting( state : State, action : Action ) : State {
	switch ( action.type ) {
		case 'UNSET_INSPECTING' :
			return {
				... state,
				isInspecting: false,
			};
	}

	return state;
}


/**
 * Set reducer to set inspector position.
 *
 * @param {State} state current
 * @param {Action} action dispatched
 *
 * @since 0.2.2
 *
 * @return {State} updated state
 */
export function setInspectorPosition( state : State, action : Action ) : State {
	switch ( action.type ) {
		case 'SET_INSPECTOR_POSITION' :
			return {
				... state,
				inspectorPosition: action.position,
			};
	}

	return state;
}


/**
 * Set reducer to update state for active editing.
 *
 * @param {State} state current
 * @param {Action} action dispatched
 *
 * @since 0.1.0
 *
 * @return {State} updated state
 */
export function setEditing( state : State, action : Action ) : State {
	switch ( action.type ) {
		case 'SET_EDITING' :
			return {
				... state,
				isEditing: true,
			};
	}

	return state;
}


/**
 * Set reducer to update state to shut down editing.
 *
 * @param {State} state current
 * @param {Action} action dispatched
 *
 * @since 0.1.0
 *
 * @return {State} updated state
 */
export function unsetEditing( state : State, action : Action ) : State {
	switch ( action.type ) {
		case 'UNSET_EDITING' :
			return {
				... state,
				isEditing: false,
			};
	}

	return state;
}


/**
 * Set reducer to toggle active and inactive viewport simulation.
 *
 * @param {State} state current
 * @param {Action} action dispatched
 *
 * @since 0.1.0
 *
 * @return {State} updated state
 */
export function toggleActive( state : State, action : Action ) : State {
	switch ( action.type ) {
		case 'TOGGLE_ACTIVE' :
			const isActive = state.isActive ? false : true;
			let viewport = state.viewport;

			if( isActive && 0 === viewport ) {
				viewport = getHighestPossibleViewport( state.viewports );
			}

			return {
				... state,
				isActive: isActive,
				viewport: viewport,
			};
	}

	return state;
}


/**
 * Set reducer to toggle viewport to stored desktop viewport.
 *
 * @param {State} state current
 * @param {Action} action dispatched
 *
 * @since 0.1.0
 *
 * @return {State} updated state
 */
export function toggleDesktop( state : State, action : Action ) : State {
	switch ( action.type ) {
		case 'TOGGLE_DESKTOP' :
			return {
				... state,
				viewport: state.desktop,
			};
	}

	return state;
}


/**
 * Set reducer to toggle viewport to stored tablet viewport.
 *
 * @param {State} state current
 * @param {Action} action dispatched
 *
 * @since 0.1.0
 *
 * @return {State} updated state
 */
export function toggleTablet( state : State, action : Action ) : State {
	switch ( action.type ) {
		case 'TOGGLE_TABLET' :
			return {
				... state,
				viewport: state.tablet,
			};
	}

	return state;
}


/**
 * Set reducer to toggle viewport to stored mobile viewport.
 *
 * @param {State} state current
 * @param {Action} action dispatched
 *
 * @since 0.1.0
 *
 * @return {State} updated state
 */
export function toggleMobile( state : State, action : Action ) : State {
	switch ( action.type ) {
		case 'TOGGLE_MOBILE' :
			return {
				... state,
				viewport: state.mobile,
			};
	}

	return state;
}


/**
 * Set reducer to register a block init.
 *
 * @param {State} state current
 * @param {Action} action dispatched
 *
 * @since 0.1.0
 *
 * @return {State} updated state
 */
export function registerBlockInit( state : State, action : Action ) : State {
	switch ( action.type ) {
		case 'REGISTER_BLOCK_INIT' :

			// Deconstruct action.
			const { clientId, attributes } = action;

			// Bubble out on undefined clientId.
			if( '' === clientId || 'undefined' === typeof clientId ) {
				return state;
			}

			// Deconstruct state.
			const { init, saves, valids } = state;

			// Find defaults and viewport saves.
			const blockSaves = findBlockSaves( attributes );

			console.log( 'blockSaves', blockSaves );

			// Set initState.
			const initState = {
				... state,
				init: {
					... init,
					[ clientId ]: true,
				},
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
				css,
				spectrumSet,
				inlineStyle,
			} = getSpectrumProperties( clientId, spectrumState );

			// Return new state.
			return {
				... initState,
				valids: {
					... valids,
					[ clientId ]: blockValids
				},
				cssSet: {
					... initState.cssSet,
					[ clientId ]: css,
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


/**
 * Set reducer to update block changes.
 *
 * @param {State} state current
 * @param {Action} action dispatched
 *
 * @since 0.1.0
 *
 * @return {State} updated state
 */
export function updateBlockChanges( state : State, action : Action ) : State {
	switch ( action.type ) {
		case 'UPDATE_BLOCK_CHANGES' :

			// Deconstruct state and action.
			const { isActive, isEditing, changes, valids } = state;
			const { clientId, attributes } = action;

			// Set viewport.
			const viewport = isActive && isEditing ? state.viewport : 0;

			// Set new generated block changes by comparing it to the actual viewport valid.
			// Here you will get just the difference between both.
			let difference = findBlockChanges( viewport, clientId, cloneDeep( attributes ), state );

			// Set indicator for existing differences.
			const hasDifference = 0 < Object.entries( difference ).length;
			if ( ! hasDifference ) {
				return state;
			}

			// Set initial nextState.
			let nextState : any = {};

			// Set indicator for existing state changes and differences.
			const blockChanges = traverseGet( [ clientId, viewport, 'style' ].join( '.' ), cloneDeep( changes ) ) || {};
			const hasChanges = Object.keys( blockChanges ).length ? true : false;

			// If we have differences
			if ( hasChanges ) {
				nextState = {
					... state,
					changes: {
						... changes,
						[ clientId ]: {
							... changes[ clientId ],
							[ viewport ]: {
								style: getMergedAttributes( blockChanges, difference ),
							}
						}
					}
				}
			} else {
				nextState = {
					... state,
					changes: {
						... changes,
						[ clientId ]: {
							... changes[ clientId ],
							[ viewport ]: {
								style: difference,
							},
						}
					}
				}
			}

			// Set new generated block valids from new generated block changes.
			const blockValids = findBlockValids( clientId, nextState );

			// Set spectrumState for spectrumSet generation.
			const spectrumState = {
				valids: blockValids,
				saves: traverseGet( clientId, nextState.saves ) || {},
				changes: traverseGet( clientId, nextState.changes ),
				removes: traverseGet( clientId, nextState.removes ),
				rendererPropertySet: nextState.renderer,
				isSaving: nextState.isSaving,
				viewport: nextState.viewport,
			};

			// Deconstruct spectrumProperties.
			const {
				css,
				spectrumSet,
				inlineStyle,
			} = getSpectrumProperties( clientId, spectrumState );

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
					[ clientId ]: css,
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


/**
 * Set reducer to update block valids.
 *
 * @param {State} state current
 * @param {Action} action dispatched
 *
 * @since 0.1.0
 *
 * @return {State} updated state
 */
export function updateBlockValids( state : State, action : Action ) : State {
	switch ( action.type ) {
		case 'UPDATE_BLOCK_VALIDS' :

			// Deconstruct state and action.
			const { valids } = state;
			const { clientId } = action;

			// Generate new valids from new state.
			const blockValids = findBlockValids( clientId, state );

			// Set spectrumState for spectrumSet generation.
			const spectrumState = {
				valids: blockValids,
				saves: traverseGet( clientId, state.saves ) || {},
				changes: traverseGet( clientId, state.changes ),
				removes: traverseGet( clientId, state.removes ),
				rendererPropertySet: state.renderer,
				isSaving: state.isSaving,
				viewport: state.viewport,
			};

			// Deconstruct spectrumProperties.
			const {
				css,
				spectrumSet,
				inlineStyle,
			} = getSpectrumProperties( clientId, spectrumState );

			// Return new state.
			return {
				... state,
				valids: {
					... valids,
					[ clientId ]: blockValids,
				},
				cssSet: {
					... state.cssSet,
					[ clientId ]: css,
				},
				spectrumSets: {
					... state.spectrumSets,
					[ clientId ]: spectrumSet,
				},
				inlineStyleSets: {
					... state.inlineStyleSets,
					[ clientId ]: inlineStyle,
				},
			};
	}

	return state;
}


/**
 * Set reducer to remove block.
 *
 * @param {State} state current
 * @param {Action} action dispatched
 *
 * @since 0.1.0
 *
 * @return {State} updated state
 */
export function removeBlock( state : State, action : Action ) : State {
	switch ( action.type ) {
		case 'REMOVE_BLOCK' :

			// Deconstruct action.
			const { clientId } = action;

			// Remove init entry.
			const init = { ... state.init };
			delete init[ clientId ];

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
				init,
				saves,
				changes,
				removes,
				valids,
			};
	}

	return state;
}


/**
 * Set reducer to remove block saves.
 *
 * @param {State} state current
 * @param {Action} action dispatched
 *
 * @since 0.1.0
 *
 * @return {State} updated state
 */
export function removeBlockSaves( state : State, action : Action ) : State {
	switch ( action.type ) {
		case 'REMOVE_BLOCK_SAVES' :
			const { clientId, viewport, props } = action;
			const { saves, removes, valids } = state;

			// Set states.
			const blockSaves = traverseGet( [ clientId, viewport, 'style' ].join( '.' ), saves ) || {};
			const blockRemoves = traverseGet( [ clientId, viewport, 'style' ].join( '.' ), removes ) || {};

			// Cleanup props from reference.
			const propsCloned = [ ... props ];

			// Set indicators.
			const hasBlockSaves = Object.keys( blockSaves ).length ? true : false;
			const hasBlockRemoves = Object.keys( blockRemoves ).length ? true : false;

			// Check if there are blockSaves to remove.
			if ( hasBlockSaves ) {
				const foundRemoves = findRemoves( propsCloned, cloneDeep( blockSaves ) );

				let nextRemoves = {};
				if ( hasBlockRemoves ) {
					nextRemoves = getMergedAttributes( blockRemoves, foundRemoves );
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
					saves: traverseGet( clientId, nextState.saves ) || {},
					changes: traverseGet( clientId, nextState.changes ),
					removes: traverseGet( clientId, nextState.removes ),
					rendererPropertySet: nextState.renderer,
					isSaving: nextState.isSaving,
					viewport: nextState.viewport,
				};

				// Deconstruct spectrumProperties.
				const {
					css,
					spectrumSet,
					inlineStyle,
				} = getSpectrumProperties( clientId, spectrumState );

				// Return new state.
				return {
					... nextState,
					valids: {
						... valids,
						[ clientId ]: blockValids
					},
					cssSet: {
						... state.cssSet,
						[ clientId ]: css,
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


/**
 * Set reducer to restore block saves.
 *
 * @param {State} state current
 * @param {Action} action dispatched
 *
 * @since 0.1.0
 *
 * @return {State} updated state
 */
export function restoreBlockSaves( state : State, action : Action ) : State {
	switch ( action.type ) {
		case 'RESTORE_BLOCK_SAVES' :

			// Deconstruct state and action.
			const { clientId, viewport, props } = action;
			const { changes, removes, valids } = state;

			// Set nextState.
			let nextState : any = { ... state };

			// Set states.
			const blockChangesStyle = cloneDeep( traverseGet( [ clientId, viewport, 'style' ].join( '.' ), changes ) );
			const blockRemovesStyle = cloneDeep( traverseGet( [ clientId, viewport, 'style' ].join( '.' ), removes ) );

			// Set indicators.
			const hasChanges = blockChangesStyle && Object.keys( blockChangesStyle ).length ? true : false;
			const hasRemoves = blockRemovesStyle && Object.keys( blockRemovesStyle ).length ? true : false;

			// Check if there is an entry for clientId and viewport to remove from changes.
			if ( hasChanges ) {

				// Set new block removes and changes.
				const blockRemoves = findRemoves( cloneDeep( props ), blockChangesStyle );
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
				const blockRemoves = findRemoves( cloneDeep( props ), blockRemovesStyle );
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
				saves: traverseGet( clientId, nextState.saves ) || {},
				changes: traverseGet( clientId, nextState.changes ),
				removes: traverseGet( clientId, nextState.removes ),
				rendererPropertySet: nextState.renderer,
				isSaving: nextState.isSaving,
				viewport: nextState.viewport,
			};

			// Deconstruct spectrumProperties.
			const {
				css,
				spectrumSet,
				inlineStyle,
			} = getSpectrumProperties( clientId, spectrumState );

			// Return new state.
			return {
				... nextState,
				valids: {
					... valids,
					[ clientId ]: blockValids
				},
				cssSet: {
					... state.cssSet,
					[ clientId ]: css,
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


/**
 * Set reducer to save block.
 *
 * @param {State} state current
 * @param {Action} action dispatched
 *
 * @since 0.1.0
 *
 * @return {State} updated state
 */
export function saveBlock( state : State, action : Action ) : State {
	switch ( action.type ) {
		case 'SAVE_BLOCK' :
			const { clientId } = action;
			const { saves, changes, removes, valids } = state;

			// Set states.
			let blockSaves = saves.hasOwnProperty( clientId ) ? saves[ clientId ] : {};
			let blockChanges = changes.hasOwnProperty( clientId ) ? changes[ clientId ] : {};
			let blockRemoves = removes.hasOwnProperty( clientId ) ? removes[ clientId ] : {};

			// Set indicators.
			const hasBlockSaves = Object.keys( blockSaves ).length ? true : false;
			const hasBlockChanges = Object.keys( blockChanges ).length ? true : false;
			const hasBlockRemoves = Object.keys( blockRemoves ).length ? true : false;

			// Check if we can skip the save call.
			if( ! hasBlockSaves && ! hasBlockChanges && ! hasBlockRemoves ) {
				return state;
			}

			// Set merged blockSaves.
			blockSaves = getMergedAttributes( blockSaves, blockChanges );

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
				saves: traverseGet( clientId, nextState.saves ) || {},
				changes: traverseGet( clientId, nextState.changes ),
				removes: traverseGet( clientId, nextState.removes ),
				rendererPropertySet: nextState.renderer,
				isSaving: nextState.isSaving,
				viewport: nextState.viewport,
			};

			// Deconstruct spectrumProperties.
			const {
				css,
				spectrumSet,
				inlineStyle,
			} = getSpectrumProperties( clientId, spectrumState );

			return {
				... nextState,
				valids: {
					... valids,
					[ clientId ]: blockValids
				},
				cssSet: {
					... state.cssSet,
					[ clientId ]: css,
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


/**
 * Set reducer to clear blocks.
 *
 * @param {State} state current
 * @param {Action} action dispatched
 *
 * @since 0.1.0
 *
 * @return {State} updated state
 */
export function clearBlocks( state : State, action : Action ) : State {
	switch ( action.type ) {
		case 'CLEAR_BLOCKS':
			return {
				... state,
				init: {},
				saves: {},
				changes: {},
				removes: {},
				valids: {},
			}
	}

	return state;
}


/**
 * Set reducer to register custom style renderer.
 *
 * @param {State} state current
 * @param {Action} action dispatched
 *
 * @since 0.1.0
 *
 * @return {State} updated state
 */
export function registerRenderer( state : State, action : Action ) : State {
	if( action.type === 'REGISTER_RENDERER' ) {
		const { prop, callback, priority } = action;

		if ( state.renderer.hasOwnProperty( prop ) ) {
			return {
				... state,
				renderer: {
					... state.renderer,
					[ prop ]: {
						... state.renderer[ prop ],
						[ priority ]: {
							callback,
							selectorPanel: action.selectorPanel,
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
						callback,
						selectorPanel: action.selectorPanel,
					}
				}
			}
		}
	}

	return state;
}


/**
 * Set reducer to handle.
 *
 * @since 0.1.0
 */
export const combinedReducers = {
	setViewports,
	setViewport,
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
	setInspectorPosition,
	setEditing,
	unsetEditing,
	toggleActive,
	toggleDesktop,
	toggleTablet,
	toggleMobile,
	registerBlockInit,
	updateBlockChanges,
	updateBlockValids,
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
 * @param {Reducers} reducers
 *
 * @since 0.1.0
 *
 * @return {State} nextState
 */
const getReducedNextState = ( state : State, action : Action, reducers : Reducers ) : State => {
	let nextState = state;

	for( const [ name, callback ] of Object.entries( reducers ) ) {
		nextState = callback( nextState, action );
	}

	return nextState;
}


/**
 * Set function to run with every change in store.
 *
 * @param {Reducers} reducers
 *
 * @since 0.1.0
 *
 * @return {Function} reducing
 */
const withChanges = ( reducers : Reducers ) : Function => {
	return ( state : State = DEFAULT_STATE, action : Action ) : State => {
		const nextState = getReducedNextState( state, action, reducers );

		if( ! state ) {
			// console.log( 'reducer withChanges without state', action );
			return nextState;
		}

		if( isEqual( state, nextState ) ) {
			// console.log( 'reducer withChanges equal state', action );
			return state;
		}

		// console.log( 'reducer withChanges different state', action );
		return {
			... nextState,
		};
	}
}

export default withChanges( combinedReducers );