import {
	State,
	ViewportSet,
} from "@viewports/types";
import {
	findObjectDifferences,
	getMergedObject,
	traverseDelete,
	traverseGet
} from "@viewports/utils";

const {
	cloneDeep,
	isEmpty,
} = window[ 'lodash' ];


/**
 * Set function to find block valids from datastore.
 *
 * @param {clientId} clientId
 * @param {State} state
 *
 * @return {ViewportSet} valids
 */
export const findBlockValids = ( clientId : string, state : State ) : ViewportSet => {
	const { saves, changes, removes, viewports } = state;

	const blockSaves : ViewportSet = traverseGet( [ clientId ], saves ) || {};
	const blockChanges : ViewportSet = traverseGet( [ clientId ], changes ) || {};
	const blockRemoves : ViewportSet = traverseGet( [ clientId ], removes ) || {};

	const blockValids : ViewportSet = {
		0: {
			0: {
				style: {},
			},
		},
	};

	let last = 0;
	for( const [ viewportDirty ] of Object.entries( viewports ) ) {
		const viewport = parseInt( viewportDirty );

		// Filter out double inclusion of maxWidth attributes.
		let lastBlockValids = cloneDeep( blockValids[ last ] );
		if( ! lastBlockValids.hasOwnProperty( 0 ) ) {
			lastBlockValids = {
				0: {
					style: {},
				}
			}
		}

		// Merge objects.
		if( blockSaves.hasOwnProperty( viewport ) && blockChanges.hasOwnProperty( viewport ) ) {
			blockValids[ viewport ] = getMergedObject( lastBlockValids, blockSaves[ viewport ], blockChanges[ viewport ] );
		} else if( blockSaves.hasOwnProperty( viewport ) && ! blockChanges.hasOwnProperty( viewport ) ) {
			blockValids[ viewport ] = getMergedObject( lastBlockValids, blockSaves[ viewport ] );
		} else if( ! blockSaves.hasOwnProperty( viewport ) && blockChanges.hasOwnProperty( viewport ) ) {
			blockValids[ viewport ] = getMergedObject( lastBlockValids, blockChanges[ viewport ] );
		} else {
			blockValids[ viewport ] = lastBlockValids;
		}

		// Filter out maxWidth from valids if its viewport is reached.
		for( const maxWidthDirty in blockValids[ viewport ] ) {
			const maxWidth = parseInt( maxWidthDirty );
			if( maxWidth === 0 ) {
				continue;
			}

			if( viewport >= maxWidth + 1 ) {
				traverseDelete( [ viewport, maxWidth ], blockValids );
			}
		}

		// Filter out difference between valids and removes.
		if( blockRemoves.hasOwnProperty( viewport ) ) {
			blockValids[ viewport ] = findObjectDifferences( blockValids[ viewport ], blockRemoves[ viewport ] );

			if( isEmpty( blockValids[ viewport ] ) ) {
				blockValids[ viewport ] = {
					0: {
						style: {}
					}
				};
			}
		}

		last = viewport;
	}

	return blockValids;
}
