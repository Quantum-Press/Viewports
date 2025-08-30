import {
	cleanupViewportSet,
	collapseViewportSet,
	updateBlockDifferences,
	updateStyleProperty,
} from '@viewports/store/utils';
import { traverseGet } from '@viewports/utils';
import type {
	clientId,
	BlockStyles,
	State,
	BlockDifferences,
	BlockAttributes,
	ViewportSet,
	ViewportStyleSets,
	viewport,
} from '@viewports/types';

const {
	cloneDeep,
	isUndefined,
	isNull
} = window[ 'lodash' ];

import { diff } from '@opentf/obj-diff';


/**
 * Sanitize differences object.
 *
 * @param changes
 * @param removes
 *
 * @returns
 */
const sanitizeDifferences = ( changes, removes ) : BlockDifferences => {
	return {
		changes: cleanupViewportSet( changes ),
		removes: cleanupViewportSet( removes ),
	};
}

/**
 * Find differences between actual state and saved state.
 *
 * @param clientId
 * @param attributes
 * @param state
 * @param actionViewport
 */
export const findBlockDifferences = (
	clientId : clientId,
	attributes : BlockAttributes,
	state : State,
	actionViewport : viewport
) : BlockDifferences => {
	const {
		iframeViewport,
		isEditing,
	} = state;

	// Nicht vergessen!
	const elementState = 'default';
	const isPrint = false;

	const selectedViewport = actionViewport ? actionViewport : iframeViewport ? iframeViewport : 0;
	const viewports = Object.keys( state.viewports ).map( Number );

	const blockStyle : BlockStyles = cloneDeep( traverseGet( [ 'style' ], attributes ) ) || {};
	const blockValids : ViewportSet = cloneDeep( traverseGet( [ clientId ], state.valids ) ) || {};
	const blockChanges : ViewportSet = cloneDeep( traverseGet( [ clientId ], state.changes ) ) || {};
	const blockRemoves : ViewportSet = cloneDeep( traverseGet( [ clientId ], state.removes ) ) || {};
	const blockSaves : ViewportSet = cloneDeep( traverseGet( [ clientId ], state.saves ) ) || {};

	// console.log( 'blockValids', blockValids );
	// console.log( 'blockChanges', blockChanges );
	// console.log( 'blockRemoves', blockRemoves );
	// console.log( 'blockSaves', blockSaves );

	const validsViewportStyleSets = traverseGet( [ selectedViewport ], blockValids, undefined ) as ViewportStyleSets;
	if( isUndefined( validsViewportStyleSets ) || isNull( validsViewportStyleSets ) ) {
		console.error( 'You tried to change styles without having a valid viewport' );
		return sanitizeDifferences( blockChanges, blockRemoves );
	}

	const collapsedBlockValids = collapseViewportSet( blockValids, selectedViewport );
	const collapsedBlockChanges = collapseViewportSet( blockChanges, selectedViewport );
	const collapsedBlockRemoves = collapseViewportSet( blockRemoves, selectedViewport );
	const collapsedBlockSaves = collapseViewportSet( blockSaves, selectedViewport );

	// console.log( 'collapsedBlockValids', collapsedBlockValids );
	// console.log( 'collapsedBlockChanges', collapsedBlockChanges );
	// console.log( 'collapsedBlockRemoves', collapsedBlockRemoves );
	// console.log( 'collapsedBlockSaves', collapsedBlockSaves );

	const styleProperties = Object.keys( blockStyle );
	const validsProperties = Object.keys( collapsedBlockValids );
	const removesProperties = Object.keys( collapsedBlockRemoves );

	const combinedProperties = Array.from( new Set( [ ... validsProperties, ... removesProperties, ... styleProperties ] ) );

	// console.log( 'styleProperties', styleProperties );
	// console.log( 'validsProperties', validsProperties );
	// console.log( 'removesProperties', removesProperties );
	// console.log( 'combinedProperties', combinedProperties );

	for( let index = 0; index < combinedProperties.length; index++ ) {
		const property = combinedProperties[ index ];

		const collapsedValidsValue = traverseGet( [ property ], collapsedBlockValids );
		const stylesValue = traverseGet( [ property ], blockStyle );

		// Add new style to changes.
		updateStyleProperty(
			selectedViewport,
			viewports,
			isEditing,
			isPrint,
			elementState,
			blockValids,
			blockChanges,
			blockRemoves,
			blockSaves,
			property,
			stylesValue,
			collapsedValidsValue
		);
	}

	return sanitizeDifferences( blockChanges, blockRemoves );;
}
