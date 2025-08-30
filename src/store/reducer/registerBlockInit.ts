import type { State, Action } from '../../types';
import {
	findBlockSaves,
	findBlockValids,
	getSpectrumProperties,
} from '../utils';

const {
	cloneDeep,
} = window[ 'lodash' ];


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
			const blockSaves = findBlockSaves( cloneDeep( attributes ) );

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