import type { State, Action } from '../../types';


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