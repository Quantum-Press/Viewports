import type { State, Action } from '../../types';
import {
	getMergedObject,
	traverseGet
} from '../../utils';
import {
	findRemoves,
	findBlockValids,
	getSpectrumProperties,
} from '../utils';

const {
	cloneDeep,
} = window[ 'lodash' ];


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
			const blockSaves = traverseGet( [ clientId, viewport ], saves ) || {};
			const blockRemoves = traverseGet( [ clientId, viewport ], removes ) || {};

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
							[ viewport ]: nextRemoves,
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
