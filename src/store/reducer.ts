import type { State, Action, Reducers } from './types';

import { DEFAULT_STATE } from './default';
import { getMergedAttributes } from '../utils/attributes';
import {
	isInMobileRange,
	isInTabletRange,
	isInDesktopRange,
	getHighestPossibleViewport,
	findBlockSaves,
	findBlockDefaults,
	findBlockValids,
	findBlockChanges,
	findRemoves,
	findCleanedChanges,
	clearEmptySaves,
	clearDuplicateSaves,
} from './utils';

const { isEqual, cloneDeep } = window[ 'lodash' ];


/**
 * Set reducer to update viewports list.
 *
 * @param {object} state  current
 * @param {object} action dispatched
 *
 * @since 0.1.0
 *
 * @return {object} updated state
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
 * @param {object} state  current
 * @param {object} action dispatched
 *
 * @since 0.1.0
 *
 * @return {object} updated state
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
 * @param {object} state  current
 * @param {object} action dispatched
 *
 * @since 0.1.0
 *
 * @return {object} updated state
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
 * @param {object} state  current
 * @param {object} action dispatched
 *
 * @since 0.1.0
 *
 * @return {object} updated state
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
 * @param {object} state  current
 * @param {object} action dispatched
 *
 * @since 0.1.0
 *
 * @return {object} updated state
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
 * @param {object} state  current
 * @param {object} action dispatched
 *
 * @since 0.1.0
 *
 * @return {object} updated state
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
 * @param {object} state  current
 * @param {object} action dispatched
 *
 * @since 0.1.0
 *
 * @return {object} updated state
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
 * Set reducer to update registering indicator to boolean true.
 *
 * @param {object} state  current
 * @param {object} action dispatched
 *
 * @since 0.1.0
 *
 * @return {object} updated state
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
 * @param {object} state  current
 * @param {object} action dispatched
 *
 * @since 0.1.0
 *
 * @return {object} updated state
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
 * @param {object} state  current
 * @param {object} action dispatched
 *
 * @since 0.1.0
 *
 * @return {object} updated state
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
 * @param {object} state  current
 * @param {object} action dispatched
 *
 * @since 0.1.0
 *
 * @return {object} updated state
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
 * @param {object} state  current
 * @param {object} action dispatched
 *
 * @since 0.1.0
 *
 * @return {object} updated state
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
 * @param {object} state  current
 * @param {object} action dispatched
 *
 * @since 0.1.0
 *
 * @return {object} updated state
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
 * @param {object} state  current
 * @param {object} action dispatched
 *
 * @since 0.1.0
 *
 * @return {object} updated state
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
 * @param {object} state  current
 * @param {object} action dispatched
 *
 * @since 0.1.0
 *
 * @return {object} updated state
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
 * @param {object} state  current
 * @param {object} action dispatched
 *
 * @since 0.1.0
 *
 * @return {object} updated state
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
 * @param {object} state  current
 * @param {object} action dispatched
 *
 * @since 0.1.0
 *
 * @return {object} updated state
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
 * @param {object} state  current
 * @param {object} action dispatched
 *
 * @since 0.1.0
 *
 * @return {object} updated state
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
 * @param {object} state  current
 * @param {object} action dispatched
 *
 * @since 0.2.2
 *
 * @return {object} updated state
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
 * @param {object} state  current
 * @param {object} action dispatched
 *
 * @since 0.2.2
 *
 * @return {object} updated state
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
 * @param {object} state  current
 * @param {object} action dispatched
 *
 * @since 0.2.2
 *
 * @return {object} updated state
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
 * @param {object} state  current
 * @param {object} action dispatched
 *
 * @since 0.1.0
 *
 * @return {object} updated state
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
 * @param {object} state  current
 * @param {object} action dispatched
 *
 * @since 0.1.0
 *
 * @return {object} updated state
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
 * @param {object} state  current
 * @param {object} action dispatched
 *
 * @since 0.1.0
 *
 * @return {object} updated state
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
 * @param {object} state  current
 * @param {object} action dispatched
 *
 * @since 0.1.0
 *
 * @return {object} updated state
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
 * @param {object} state  current
 * @param {object} action dispatched
 *
 * @since 0.1.0
 *
 * @return {object} updated state
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
 * @param {object} state  current
 * @param {object} action dispatched
 *
 * @since 0.1.0
 *
 * @return {object} updated state
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
 * @param {object} state  current
 * @param {object} action dispatched
 *
 * @since 0.1.0
 *
 * @return {object} updated state
 */
export function registerBlockInit( state : State, action : Action ) : State {
	switch ( action.type ) {
		case 'REGISTER_BLOCK_INIT' :
			const { clientId, attributes } = action;

			// Bubble out on undefined clientId.
			if( '' === clientId || 'undefined' === typeof clientId ) {
				return state;
			}

			const { init, defaults, saves, valids } = state;

			const initState = {
				... state,
				init: {
					... init,
					[ clientId ]: true,
				},
				defaults: {
					... defaults,
					... findBlockDefaults( clientId, attributes ),
				},
				saves: {
					... saves,
					... findBlockSaves( clientId, attributes )
				}
			}

			const blockValids = findBlockValids( clientId, initState );

			return {
				... initState,
				valids: {
					... valids,
					[ clientId ]: blockValids
				},
			}
	}

	return state;
}


/**
 * Set reducer to update block changes.
 *
 * @param {object} state  current
 * @param {object} action dispatched
 *
 * @since 0.1.0
 *
 * @return {object} updated state
 */
export function updateBlockChanges( state : State, action : Action ) : State {
	switch ( action.type ) {
		case 'UPDATE_BLOCK_CHANGES' :
			const { viewport, changes, valids } = state;
			const { clientId, attributes } = action;

			// Set new generated block changes by comparing it to the actual viewport valid.
			// Here you will get just the difference between both.
			let difference = findBlockChanges( viewport, clientId, attributes, state );

			// Set indicator for existing differences.
			const hasDifference = 0 < Object.entries( difference ).length;
			if ( ! hasDifference ) {
				return state;
			}

			// Set initial nextState.
			let nextState : any = {};

			// Set indicator for existing state changes and differences.
			const hasChanges = changes.hasOwnProperty( clientId );
			const hasViewportChanges = hasChanges && changes[ clientId ].hasOwnProperty( viewport );

			// If we have differences
			if ( hasViewportChanges ) {
				nextState = {
					... state,
					changes: {
						... changes,
						[ clientId ]: {
							... changes[ clientId ],
							[ viewport ]: getMergedAttributes( changes[ clientId ][ viewport ], { style: difference } ),
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
							[ viewport ]: { style: difference },
						}
					}
				}
			}

			// Set new generated block valids from new generated block changes.
			const blockValids = findBlockValids( clientId, nextState );

			return {
				... nextState,
				viewports: state.viewports,
				lastEdit: state.lastEdit,
				valids: {
					... valids,
					[ clientId ]: blockValids
				},
			}
	}

	return state;
}


/**
 * Set reducer to update block defaults.
 *
 * @param {object} state  current
 * @param {object} action dispatched
 *
 * @since 0.1.0
 *
 * @return {object} updated state
 */
export function updateBlockDefaults( state : State, action : Action ) : State {
	switch ( action.type ) {
		case 'UPDATE_BLOCK_DEFAULTS' :
			const { defaults, valids } = state;
			const { clientId, attributes } = action;

			const blockDefaults = { style: cloneDeep( attributes.style ) };

			const nextState = {
				... state,
				defaults: {
					... defaults,
					[ clientId ]: blockDefaults,
				}
			};

			const blockValids = findBlockValids( clientId, nextState );

			return {
				... nextState,
				valids: {
					... valids,
					[ clientId ]: blockValids,
				}
			}
	}

	return state;
}


/**
 * Set reducer to update block valids.
 *
 * @param {object} state  current
 * @param {object} action dispatched
 *
 * @since 0.1.0
 *
 * @return {object} updated state
 */
export function updateBlockValids( state : State, action : Action ) : State {
	switch ( action.type ) {
		case 'UPDATE_BLOCK_VALIDS' :
			const { valids } = state;
			const { clientId } = action;

			const blockValids = findBlockValids( clientId, state );

			return {
				... state,
				valids: {
					... valids,
					[ clientId ]: blockValids,
				},
			};
	}

	return state;
}


/**
 * Set reducer to remove block.
 *
 * @param {object} state  current
 * @param {object} action dispatched
 *
 * @since 0.1.0
 *
 * @return {object} updated state
 */
export function removeBlock( state : State, action : Action ) : State {
	switch ( action.type ) {
		case 'REMOVE_BLOCK' :
			const { clientId } = action;

			const init = { ... state.init };
			delete init[ clientId ];

			const defaults = { ... state.defaults };
			delete defaults[ clientId ];

			const saves = { ... state.saves };
			delete saves[ clientId ];

			const changes = { ... state.changes };
			delete changes[ clientId ];

			const removes = { ... state.removes };
			delete removes[ clientId ];

			const valids = { ... state.valids };
			delete valids[ clientId ];

			return {
				... state,
				init,
				defaults,
				saves,
				changes,
				removes,
				valids,
			};
	}

	return state;
}


/**
 * Set reducer to remove block defaults.
 *
 * @param {object} state  current
 * @param {object} action dispatched
 *
 * @since 0.1.0
 *
 * @return {object} updated state
 */
export function removeBlockDefaults( state : State, action : Action ) : State {
	switch ( action.type ) {
		case 'REMOVE_BLOCK_DEFAULTS' :
			const { clientId, viewport, props } = action;
			const { defaults, valids } = state;

			if ( defaults.hasOwnProperty( clientId ) ) {

				const blockRemoves = findRemoves( props, defaults[ clientId ][ 'style' ] );
				const blockChanges = findCleanedChanges( defaults[ clientId ][ 'style' ], blockRemoves );

				let nextState : any = {};

				// Set blockChanges if they are empty or not.
				nextState = {
					... state,
					defaults: {
						... defaults,
						[ clientId ]: {
							style: {
								... blockChanges
							}
						}
					}
				}

				// Generate new valids from new state.
				const blockValids = findBlockValids( clientId, nextState );

				return {
					... nextState,
					valids: {
						... valids,
						[ clientId ]: blockValids
					},
					lastEdit: Date.now(),
				}
			}
	}

	return state;
}


/**
 * Set reducer to remove block changes.
 *
 * @param {object} state  current
 * @param {object} action dispatched
 *
 * @since 0.1.0
 *
 * @return {object} updated state
 */
export function removeBlockChanges( state : State, action : Action ) : State {
	switch ( action.type ) {
		case 'REMOVE_BLOCK_CHANGES' :
			const { clientId, viewport, props } = action;
			const { changes, valids } = state;

			if ( changes.hasOwnProperty( clientId ) && changes[ clientId ].hasOwnProperty( viewport ) ) {
				const blockRemoves = findRemoves( props, changes[ clientId ][ viewport ] );
				const blockChanges = findCleanedChanges( changes[ clientId ][ viewport ], blockRemoves );

				let nextState : any = {};

				// Check viewport changes to update or to remove viewport changes.
				if ( 0 < Object.entries( blockChanges ).length ) {
					nextState = {
						... state,
						changes: {
							... changes,
							[ clientId ]: {
								... changes[ clientId ],
								[ viewport ]: blockChanges
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
						... state,
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
						... state,
						changes: cleanedChanges,
					}
				}

				// Generate new valids from new state.
				const blockValids = findBlockValids( clientId, nextState );

				return {
					... nextState,
					valids: {
						... valids,
						[ clientId ]: blockValids
					},
					lastEdit: Date.now(),
				}
			}
	}

	return state;
}


/**
 * Set reducer to remove block saves.
 *
 * @param {object} state  current
 * @param {object} action dispatched
 *
 * @since 0.1.0
 *
 * @return {object} updated state
 */
export function removeBlockSaves( state : State, action : Action ) : State {
	switch ( action.type ) {
		case 'REMOVE_BLOCK_SAVES' :
			const { clientId, viewport, props } = action;
			const { saves, removes, valids } = state;

			if ( saves.hasOwnProperty( clientId ) && saves[ clientId ].hasOwnProperty( viewport ) ) {
				const blockRemoves = findRemoves( props, saves[ clientId ][ viewport ] );
				const blockChanges = findCleanedChanges( saves[ clientId ][ viewport ], blockRemoves );

				let nextState : any = {};
				let nextRemoves = {};

				if ( removes.hasOwnProperty( clientId ) && removes[ clientId ].hasOwnProperty( viewport ) ) {
					nextRemoves = getMergedAttributes( removes[ clientId ][ viewport ], blockRemoves );
				} else {
					nextRemoves = blockRemoves;
				}

				// Check viewport changes to update or to remove viewport changes.
				if ( 0 < Object.entries( blockChanges ).length ) {
					nextState = {
						... state,
						saves: {
							... saves,
							[ clientId ]: {
								... saves[ clientId ],
								[ viewport ]: blockChanges
							}
						},
						removes: {
							... removes,
							[ clientId ]: {
								... removes[ clientId ],
								[ viewport ]: nextRemoves,
							}
						}
					}
				} else {
					const cleanedViewports = {
						... saves,
						[ clientId ]: {
							... saves[ clientId ]
						}
					};
					delete cleanedViewports[ clientId ][ viewport ];

					nextState = {
						... state,
						saves: cleanedViewports,
						removes: {
							... removes,
							[ clientId ]: {
								... removes[ clientId ],
								[ viewport ]: nextRemoves,
							}
						},
					}
				}

				// Check clientId changes on emptyness to cleanup.
				if ( 0 === Object.entries( nextState.saves[ clientId ] ).length ) {
					const cleanedChanges = {
						... saves,
					};

					delete cleanedChanges[ clientId ];

					nextState = {
						... nextState,
						saves: cleanedChanges,
					}
				}

				const blockValids = findBlockValids( clientId, nextState );

				return {
					... nextState,
					valids: {
						... valids,
						[ clientId ]: blockValids
					},
					lastEdit: Date.now(),
				}
			}
	}

	return state;
}


/**
 * Set reducer to remove block removes.
 *
 * @param {object} state  current
 * @param {object} action dispatched
 *
 * @since 0.1.0
 *
 * @return {object} updated state
 */
export function removeBlockRemoves( state : State, action : Action ) : State {
	switch ( action.type ) {
		case 'REMOVE_BLOCK_REMOVES' :
			const { clientId, viewport, props } = action;
			const { saves, removes, valids } = state;

			if ( removes.hasOwnProperty( clientId ) && removes[ clientId ].hasOwnProperty( viewport ) ) {
				const blockRemoves = findRemoves( props, removes[ clientId ][ viewport ] );
				const blockChanges = findCleanedChanges( removes[ clientId ][ viewport ], blockRemoves );

				let nextState : any = {};
				let nextSaves = {};

				if ( saves.hasOwnProperty( clientId ) && saves[ clientId ].hasOwnProperty( viewport ) ) {
					nextSaves = getMergedAttributes( saves[ clientId ][ viewport ], blockRemoves );
				} else {
					nextSaves = blockRemoves;
				}

				// Check viewport changes to update or to remove viewport changes.
				if ( 0 < Object.entries( blockChanges ).length ) {
					nextState = {
						... state,
						saves: {
							... saves,
							[ clientId ]: {
								... saves[ clientId ],
								[ viewport ]: nextSaves,
							}
						},
						removes: {
							... removes,
							[ clientId ]: {
								... removes[ clientId ],
								[ viewport ]: blockChanges
							}
						},
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
						... state,
						saves: {
							... saves,
							[ clientId ]: {
								... saves[ clientId ],
								[ viewport ]: nextSaves,
							}
						},
						removes: cleanedViewports,
					}
				}

				// Check clientId changes on emptyness to cleanup.
				if ( 0 === Object.entries( nextState.removes[ clientId ] ).length ) {
					const cleanedChanges = {
						... removes,
					};

					delete cleanedChanges[ clientId ];

					nextState = {
						... nextState,
						removes: cleanedChanges,
					}
				}

				const blockValids = findBlockValids( clientId, nextState );

				return {
					... nextState,
					valids: {
						... valids,
						[ clientId ]: blockValids
					},
					lastEdit: Date.now(),
				}
			}
	}

	return state;
}


/**
 * Set reducer to save block.
 *
 * @param {object} state  current
 * @param {object} action dispatched
 *
 * @since 0.1.0
 *
 * @return {object} updated state
 */
export function saveBlock( state : State, action : Action ) : State {
	switch ( action.type ) {
		case 'SAVE_BLOCK' :
			const { clientId } = action;
			const { saves, changes, removes, valids } = state;

			// Set states.
			let blockSaves = saves.hasOwnProperty( clientId ) ? saves[ clientId ] : {};
			const blockChanges = changes.hasOwnProperty( clientId ) ? changes[ clientId ] : {};
			const blockRemoves = removes.hasOwnProperty( clientId ) ? removes[ clientId ] : {};

			// Check if we can skip the save call.
			const skipSave = ! Object.keys( blockChanges ).length && ! Object.keys( blockSaves ).length && ! Object.keys( blockRemoves ).length;
			if( skipSave ) {
				return state;
			}

			// Build new blockSaves.
			blockSaves = getMergedAttributes( blockSaves, blockChanges );
			blockSaves = clearEmptySaves( blockSaves );
			blockSaves = clearDuplicateSaves( blockSaves );

			// Remove changes and removes.
			const newChanges = { ... changes };
			delete newChanges[ clientId ];
			const newRemoves = { ... removes };
			delete newRemoves[ clientId ];

			// Build nextState to build new block valids.
			const nextState = {
				... state,
				saves: {
					... saves,
					[ clientId ]: blockSaves,
				},
				changes: newChanges,
				removes: newRemoves,
			}

			const blockValids = findBlockValids( clientId, nextState );

			return {
				... nextState,
				valids: {
					... valids,
					[ clientId ]: blockValids
				}
			}
	}

	return state;
}


/**
 * Set reducer to clear blocks.
 *
 * @param {object} state  current
 * @param {object} action dispatched
 *
 * @since 0.1.0
 *
 * @return {object} updated state
 */
export function clearBlocks( state : State, action : Action ) : State {
	switch ( action.type ) {
		case 'CLEAR_BLOCKS':
			return {
				... state,
				init: {},
				defaults: {},
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
 * @param state  The current state
 * @param action The action to be dispatched
 *
 * @since 0.1.0
 *
 * @return The updated state
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
						[ priority ]: callback,
					}
				}
			}
		}

		return {
			... state,
			renderer: {
				... state.renderer,
				[ prop ]: {
					[ priority ]: callback,
				}
			}
		}
	}

	return state;
}


/**
 * Set reducer to handle.
 *
 * @type {object}
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
	updateBlockDefaults,
	updateBlockValids,
	removeBlock,
	removeBlockDefaults,
	removeBlockChanges,
	removeBlockSaves,
	removeBlockRemoves,
	saveBlock,
	clearBlocks,
	registerRenderer,
};


/**
 * Set function to get reduced next state.
 *
 * @param {object} state
 * @param {object} action
 * @param {object} reducers
 *
 * @since 0.1.0
 *
 * @return {object} nextState
 */
const getReducedNextState = ( state : State, action : Action, reducers: Reducers ) => {
	let nextState = state;

	for( const [ name, callback ] of Object.entries( reducers ) ) {
		nextState = callback( nextState, action );
	}

	return nextState;
}


/**
 * Set function to run with every change in store.
 *
 * @param {object} reducers
 *
 * @since 0.1.0
 *
 * @return {object} containing reducer
 */
const withChanges = ( reducers ) => {
	return ( state : State = DEFAULT_STATE, action : Action ) => {
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