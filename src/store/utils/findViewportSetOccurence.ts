import {
	viewport,
	ViewportSet,
	ViewportSetOccurence,
} from "@viewports/types";
import {
	findObjectOccurence,
	getMerged,
	traverseExist,
	traverseGet,
	traverseSet
} from "@viewports/utils";
import { findViewportSetIterators } from "@viewports/store/utils";

const {
	isNull,
} = window[ 'lodash' ];


/**
 * Set function to find highest viewport occurences from viewportSet by given value.
 *
 * @param {number} actionViewport
 * @param {ViewportSet} viewportSet
 * @param {string} property
 * @param {any} value
 *
 * @return {number} viewport
 */
export const findViewportSetOccurence = (
	actionViewport : viewport,
	viewportSet : ViewportSet,
	property : string,
	value : any,
) : ViewportSetOccurence => {

	// Setup containers to store occurences.
	let missing = {};
	let complete = false;
	let viewportSetOccurence = {}

	// Deconstruct iterators.
	let {
		viewports,
		maxWidths
	} = findViewportSetIterators( viewportSet );

	// console.log( '- - - - - incoming viewportSet' );
	// console.dir( viewportSet, { depth: 3 } );

	// Iterate over viewportSet in reverse order.
	for( const viewport of viewports ) {

		// console.log( '- - - - - incoming viewport', viewport );

		// Skip viewports over actionViewport.
		if( viewport > actionViewport || complete ) {
			continue;
		}

		// Iterate over maxWidths.
		for( const maxWidth of maxWidths ) {
			// console.log( '- - - - - incoming maxWidth', maxWidth );

			if( ! traverseExist( [ viewport, maxWidth ], viewportSet ) ) {
				continue;
			}

			// Get the viewportStyle valid for given viewport.
			const viewportStyle = viewportSet[ viewport ][ maxWidth ];
			// console.log( '- traverseExist viewportStyle', traverseExist( [ 'style', property ], viewportStyle ) );
			// console.log( '- viewportStyle' );
			// console.dir( viewportStyle, { depth: 3 } );

			// Check if we can find the property on valid viewportStyle.
			if( traverseExist( [ 'style', property ], viewportStyle ) ) {
				const checkValue = traverseGet( [ 'style', property ], viewportStyle );
				const occurence = findObjectOccurence(
					{ [ property ] : value },
					{ [ property ] : checkValue },
				);

				// console.log( '- - checkValue' );
				// console.dir( checkValue, { depth: 3 } );

				// console.log( '- - occurence' );
				// console.dir( occurence, { depth: 3 } );

				if( ! isNull( occurence.missing ) ) {
					missing = occurence.missing;
				} else {
					missing = {};
				}

				const found = occurence.found.hasOwnProperty( property ) && Object.keys( occurence.found[ property ] ).length > 0
					? occurence.found[ property ]
					: null;

				if( ! isNull( found ) ) {
					const partial = {
						path: [ viewport, maxWidth, 'style', property ],
						value: occurence.found.hasOwnProperty( property ) ? occurence.found[ property ] : null,
						merged: null,
					}

					traverseSet( [ viewport, maxWidth ], viewportSetOccurence, partial );
				}
			} else {
				continue;
			}

			// console.log( '- - - - - - - - viewport', viewport );
			// console.log( '- - - - - - - - maxWidth', maxWidth );
			// console.log( '- - - - - - - - missing', missing );

			if( 0 === Object.keys( missing ).length ) {
				complete = true;
				break;
			}
		}
	}

	if( 0 === Object.keys( viewportSetOccurence ).length ) {
		viewportSetOccurence = {
			0: {
				0 : {
					path: [ 0, 0, 'style', property ],
					value: null,
					merged: null,
				}
			}
		}
	} else {
		let {
			viewports,
			maxWidths
		} = findViewportSetIterators( viewportSetOccurence, false );

		let merged = null;

		console.log( '- - - viewportSetOccurence' );
		console.dir( viewportSetOccurence, { depth: 6 } );

		for( const viewport of viewports ) {
			for( const maxWidth of maxWidths ) {
				const checkValue = traverseGet( [ viewport, maxWidth, 'value' ], viewportSetOccurence );
				if( isNull( checkValue ) ) {
					continue;
				}

				merged = getMerged( checkValue, merged );

				// console.log( '- - - - checkValue', checkValue );
				// console.log( '- - - - merged', merged );

				traverseSet( [ viewport, maxWidth, 'merged' ], viewportSetOccurence, merged );
			}
		}
	}

	return viewportSetOccurence;
}
