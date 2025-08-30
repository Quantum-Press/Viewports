import type { State, Action } from '../../types';
import { cleanupObject, getMergedObject, traverseGet } from '../../utils';
import {
	findBlockValids,
	findCleanedChanges,
	getSpectrumProperties,
	cleanupViewportSet,
} from '../utils';

const {
	cloneDeep,
} = window[ 'lodash' ];


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
			blockSaves = cleanupViewportSet( blockSaves );
			blockSaves = cleanupObject( blockSaves );

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