import type { State, Action } from '../../types';
import {
	traverseDelete,
	traverseExist,
	traverseGet,
	traverseSet
} from '../../utils';
import {
	findBlockValids,
	getSpectrumProperties,
	cleanupViewportStyleSets,
} from '../utils';

const {
	cloneDeep,
	isEmpty,
} = window[ 'lodash' ];


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
			let blockChanges = cloneDeep( traverseGet( [ clientId, viewport ], changes ) );
			let blockRemoves = cloneDeep( traverseGet( [ clientId, viewport ], removes ) );

			// Set indicators.
			const hasChanges = blockChanges && ! isEmpty( blockChanges ) ? true : false;
			const hasRemoves = blockRemoves && ! isEmpty( blockRemoves ) ? true : false;

			// Remove change and removes entries if they exist.
			let updatedChanges = false;
			let updatedRemoves = false;

			if( props.length > 0 ) {
				if ( hasChanges && traverseExist( props, blockChanges ) ) {
					traverseDelete( props, blockChanges );
					blockChanges = cleanupViewportStyleSets( blockChanges );

					updatedChanges = true;
				}
				if( hasRemoves && traverseExist( props, blockRemoves ) ) {
					traverseDelete( props, blockRemoves );
					blockRemoves = cleanupViewportStyleSets( blockRemoves );

					updatedRemoves = true;
				}
			} else {
				traverseDelete( [ 'changes', clientId, viewport ], nextState );
				traverseDelete( [ 'removes', clientId, viewport ], nextState );
			}

			// Update block changes in nextState.
			if( updatedChanges ) {
				console.log( 'updatedChanges' );

				if( ! isEmpty( blockChanges ) ) {
					traverseSet( [ 'changes', clientId, viewport ], nextState, blockChanges );
				} else {
					traverseDelete( [ 'changes', clientId, viewport ], nextState );
				}
			}

			// Update block removes in nextState.
			if( updatedRemoves ) {
				console.log( 'updatedRemoves' );

				if( ! isEmpty( blockRemoves ) ) {
					traverseSet( [ 'removes', clientId, viewport ], nextState, blockRemoves );
				} else {
					traverseDelete( [ 'removes', clientId, viewport ], nextState );
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