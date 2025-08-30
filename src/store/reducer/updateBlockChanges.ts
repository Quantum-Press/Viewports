import type { State, Action } from '../../types';
import {
	traverseGet,
	traverseSet,
	traverseDelete
} from '../../utils';
import {
	findBlockValids,
	findBlockDifferences,
	getSpectrumProperties,
} from '../utils';

const {
	cloneDeep,
	isEmpty
} = window[ 'lodash' ];


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
			const viewport = null !== action.viewport ? action.viewport : state.iframeViewport;

			// Set differences resulting from new attribute state.
			const differences = findBlockDifferences( clientId, cloneDeep( attributes ), state, viewport );
			const blockChanges = differences.changes;
			const blockRemoves = differences.removes;
			const hasChanges = ! isEmpty( blockChanges );
			const hasRemoves = ! isEmpty( blockRemoves );

			// Set initial nextState.
			let nextState : any = { ... state };

			// Set new changes state.
			if( hasChanges ) {
				nextState = {
					... nextState,
					changes: {
						... changes,
						[ clientId ]: blockChanges,
					}
				}
			} else {
				traverseDelete( [ 'changes', clientId ], nextState );
			}

			// Set new removes state.
			if( hasRemoves ) {
				nextState = {
					... nextState,
					removes: {
						... removes,
						[ clientId ]: blockRemoves,
					}
				}
			} else {
				traverseDelete( [ 'removes', clientId ], nextState );
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