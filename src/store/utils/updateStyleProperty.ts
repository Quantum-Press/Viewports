import {
	BlockDifferences,
	viewport,
	ViewportSet
} from "@viewports/types";

import { diff } from '@opentf/obj-diff';
import { findEqualProperties, getMerged, getMergedObject, isNumber, isObject, subtractObject, traverseDelete, traverseDeleteCleanup, traverseGet, traversePath, traverseSet } from "@viewports/utils";

const {
	cloneDeep,
	isEmpty,
	isEqual,
	isNull,
	isUndefined,

} = window[ 'lodash' ];

type FoundPath = {
	viewport: number,
	maxWidth: number,
	value?: any,
}


function getMaxWidthsForViewport(viewportSet: ViewportSet, viewport: number): number[] {
	const maxWidths = viewportSet[ viewport ] ? Object.keys( viewportSet[ viewport ] ).map( Number ) : [];
	return maxWidths.sort( ( a, b ) => a - b );
}


function findBasePath(
	viewportSet: ViewportSet,
	viewports: number[],
	selectedViewport: number,
	attribute: string,
	basePath: string[],
	deepPath: any[],
): FoundPath|null {

	const path = [ ... basePath, ... deepPath ];
	const viewportsDesc = viewports.sort( ( a, b ) => b - a );
	const startIndex = viewportsDesc.findIndex( vp => vp <= selectedViewport );
	// console.log( '- - - - - path', path );
	// console.log( '- - - - - viewportsDesc', viewportsDesc );
	// console.log( '- - - - - startIndex', startIndex );

	for( let i = startIndex; i < viewportsDesc.length; i++ ) {
		const vp = viewportsDesc[ i ];
		const maxWidths = getMaxWidthsForViewport( viewportSet, vp ).sort( ( a, b ) => b - a );

		for( const mw of maxWidths ) {
			const styleSet = viewportSet[ vp ]?.[ mw ]?.[ attribute ];

			if( ! styleSet ) continue;

			const value = traverseGet( path, styleSet, null )

			if( value !== null ) {
				return { viewport: vp, maxWidth: mw, value: value };
			}
		}
	}

	return null;
}


function findAppendPath(
	viewportSet: ViewportSet,
	viewports: number[],
	selectedViewport: number,
	attribute: string,
	basePath: string[],
	deepPath: any[],
): FoundPath|null {

	const path = [ ... basePath, ... deepPath ];
	const viewportsDesc = viewports.sort( ( a, b ) => b - a );
	const startIndex = viewportsDesc.findIndex( vp => vp <= selectedViewport );
	// console.log( '- - - - - path', path );
	// console.log( '- - - - - viewportsDesc', viewportsDesc );
	// console.log( '- - - - - startIndex', startIndex );

	for( let i = startIndex; i < viewportsDesc.length; i++ ) {
		const vp = viewportsDesc[ i ];
		const maxWidths = getMaxWidthsForViewport( viewportSet, vp ).sort( ( a, b ) => b - a );

		for( const mw of maxWidths ) {
			if( 0 === mw ) continue;

			const styleSet = viewportSet[ vp ]?.[ mw ]?.[ attribute ];
			if( ! styleSet ) continue;

			const subPath = traversePath( path, styleSet );
			if( ! subPath.length ) continue;

			if( traverseGet( subPath, styleSet, null ) !== null ) {
				return { viewport: mw + 1, maxWidth: 0 };
			}
		}
	}

	return null; // Hier stehen geblieben.
}


function setStyleInViewportSet(
	viewportSet: ViewportSet,
	viewport: viewport,
	maxWidth: number,
	attribute: string,
	basePath: string[],
	deepPath: any[],
	value: any,
	merge: boolean = false
) {
	const path = [ viewport, maxWidth, attribute, ... basePath, ... deepPath ];

	if( merge ) {
		const prevValue = traverseGet( path, viewportSet );

		if( ! isNull( prevValue ) ) {
			traverseSet( path, viewportSet, getMerged( prevValue, value ) );
		} else {
			traverseSet( path, viewportSet, value );
		}
	} else {
		traverseSet( path, viewportSet, value );
	}
}


function removeStyleFromViewportSet(
	viewportSet: ViewportSet,
	viewport: viewport,
	maxWidth: number,
	attribute: string,
	basePath: string[],
	deepPath: any[],
) {
	const path = [ viewport, maxWidth, attribute, ... basePath, ... deepPath ];
	// console.log( '- - - delete path', path );

	traverseDeleteCleanup( path, viewportSet );
	// console.log( '- - - delete viewportSet' );
	// console.dir( viewportSet, { depth: null } );
}


function cascadeRemove(
	blockChanges: ViewportSet,
	blockRemoves: ViewportSet,
	blockSaves: ViewportSet,
	deletedViewport: number,
	attribute: string,
	basePath: string[],
	deepPath: any[]
) {
	const propertyPath = [ ... basePath, ... deepPath ];
	console.log( '- - - - propertyPath', propertyPath );

	// Suche einen niedrigeren Viewport (kleiner als deletedViewport)
	const lowerViewports = Object.keys( { ... blockSaves, ... blockChanges } )
		.map( Number )
		.filter( vp => vp < deletedViewport )
		.sort( ( a, b ) => b - a );
	console.log( '- - - - blockChanges', blockChanges );
	console.log( '- - - - blockSaves', blockSaves );
	console.log( '- - - - lowerViewports', lowerViewports );

	for( const vp of lowerViewports ) {
		const allMaxWidths = [
			... new Set( [
				... getMaxWidthsForViewport( blockSaves, vp ),
				... getMaxWidthsForViewport( blockChanges, vp )
			] )
		].sort( ( a, b ) => a - b );

		for( const mw of allMaxWidths ) {
			const changesSet = blockChanges[ vp ]?.[ mw ]?.[ attribute ];
			const changesValue = traverseGet( propertyPath, changesSet, null );

			console.log( '- - - - - changesValue', changesValue );

			if( ! isNull( changesValue ) ) {
				const restrictedMaxWidth = mw > 0 ? mw : deletedViewport - 1;

				console.log( '- - - - - - restrictedMaxWidth', restrictedMaxWidth );

				setStyleInViewportSet(
					blockChanges,
					vp,
					restrictedMaxWidth,
					attribute,
					basePath,
					deepPath,
					changesValue
				);

				setStyleInViewportSet(
					blockRemoves,
					vp,
					mw,
					attribute,
					basePath,
					deepPath,
					changesValue
				);

				if( mw === 0 ) {
					removeStyleFromViewportSet(
						blockChanges,
						vp,
						mw,
						attribute,
						basePath,
						deepPath
					);
				}

				removeStyleFromViewportSet(
					blockRemoves,
					vp,
					mw,
					attribute,
					basePath,
					deepPath
				);

				return;
			}

			const savesSet = blockSaves[ vp ]?.[ mw ]?.[ attribute ];
			const savesValue = traverseGet( propertyPath, savesSet, null );

			if(
				! isNull( savesValue ) &&
				(
					mw === 0 ||
					mw === deletedViewport - 1
				)
			) {
				const restrictedMaxWidth = deletedViewport - 1;

				setStyleInViewportSet(
					blockChanges,
					vp,
					restrictedMaxWidth,
					attribute,
					basePath,
					deepPath,
					savesValue
				);

				setStyleInViewportSet(
					blockRemoves,
					vp,
					mw,
					attribute,
					basePath,
					deepPath,
					savesValue
				);

				return;
			}
		}
	}
}


function cascadeUpdate(
	blockChanges: ViewportSet,
	blockRemoves: ViewportSet,
	blockSaves: ViewportSet,
	selectedViewport: number,
	foundValids: FoundPath,
	attribute: string,
	basePath: string[],
	deepPath: any[],
	updateValue: any
) {
	let foundCandidates = 0;
	const propertyPath = [ ... basePath, ... deepPath ];
	console.log( '- - - - - - basePath', basePath );
	console.log( '- - - - - - deepPath', deepPath );
	console.log( '- - - - - - propertyPath', propertyPath );

	const lowerViewports = Object.keys( { ... blockSaves, ... blockChanges } )
		.map( Number )
		.filter( vp => vp <= foundValids.viewport )
		.sort( ( a, b ) => b - a ) ;

	for( let vpi = 0; vpi < lowerViewports.length; vpi++ ) {
		const vp = lowerViewports[ vpi ];
		const allMaxWidths = [
			... new Set( [
				... getMaxWidthsForViewport( blockChanges, vp ),
				... getMaxWidthsForViewport( blockSaves, vp )
			] )
		].sort( ( a, b ) => b - a );

		for( let mwi = 0; mwi < allMaxWidths.length; mwi++ ) {
			const mw = allMaxWidths[ mwi ];
			console.log( '- - - - - - - vp, mw', vp, mw );

			if( isEmpty( updateValue ) ) break; // Break loop on empty updateValue.

			const changeSet = blockChanges[ vp ]?.[ mw ]?.[ attribute ];
			const saveSet = blockSaves[ vp ]?.[ mw ]?.[ attribute ];

			const candidateValue = traverseGet( propertyPath, saveSet, null )
				?? traverseGet( propertyPath, changeSet, null );

			console.log( '- - - - - - - - candidateValue', candidateValue );
			console.log( '- - - - - - - - updateValue', updateValue );

			if( ! isNull( candidateValue ) ) {
				foundCandidates++;

				if( isEqual( candidateValue, updateValue ) ) {
					removeStyleFromViewportSet( blockChanges, vp, mw, attribute, basePath, deepPath );

					setStyleInViewportSet( blockRemoves, vp, mw, attribute, basePath, deepPath, updateValue ); // Hier müsste eigentlich noch geprüft werden ob n save existiert.
					setStyleInViewportSet( blockChanges, vp, 0, attribute, basePath, deepPath, updateValue );

					updateValue = null;
				} else {
					if( isObject( candidateValue ) ) {
						const hardEquals = findEqualProperties( candidateValue, updateValue, true );
						console.log( '- - - - - - - - - hardEquals', hardEquals );

						if( ! isEmpty( hardEquals ) ) {
							removeStyleFromViewportSet( blockChanges, vp, mw, attribute, basePath, deepPath );

							setStyleInViewportSet( blockRemoves, vp, mw, attribute, basePath, deepPath, hardEquals, true ); // Hier müsste eigentlich noch geprüft werden ob n save existiert.
							setStyleInViewportSet( blockChanges, vp, 0, attribute, basePath, deepPath, hardEquals, true );

							updateValue = subtractObject( updateValue, hardEquals );
							console.log( '- - - - - - - - - - updateValue', updateValue );
						}
					} else if ( isObject( updateValue ) ) {
						if( 0 < mw && selectedViewport > mw ) {
							setStyleInViewportSet( blockChanges, mw + 1, 0, attribute, basePath, deepPath, updateValue );
							removeStyleFromViewportSet( blockRemoves, mw + 1, 0, attribute, basePath, deepPath );
						} else {
							setStyleInViewportSet( blockChanges, vp, mw, attribute, basePath, deepPath, updateValue );
							removeStyleFromViewportSet( blockRemoves, vp, mw, attribute, basePath, deepPath );
						}

						updateValue = null;
					} else {
						console.log( '- - - - - - - - - not equal literal', updateValue );

						setStyleInViewportSet( blockChanges, vp, mw, attribute, basePath, deepPath, updateValue );
						removeStyleFromViewportSet( blockRemoves, vp, mw, attribute, basePath, deepPath );

						updateValue = null;
					}
				}
			}
		}
	}

	if( ! isEmpty( updateValue ) ) {
		console.log( 'leftover updateValue', updateValue );

		setStyleInViewportSet(
			blockChanges,
			0,
			0,
			attribute,
			basePath,
			deepPath,
			updateValue,
			true
		);
	}
}


export const updateStyleProperty = (
	selectedViewport: viewport,
	viewports: number[],
	isEditing: boolean,
	isPrint: boolean,
	elementState: string,
	blockValids: ViewportSet,
	blockChanges: ViewportSet,
	blockRemoves: ViewportSet,
	blockSaves: ViewportSet,
	property: string,
	styleValue: any,
	collapsedValidsValue: any = null,
  ) => {
	const diffs = diff( collapsedValidsValue, styleValue );
	const attribute = elementState !== 'default' ? 'unknown' : 'style';
	const basePath = [ property ];
	const mergedState = getMergedObject( blockSaves, blockChanges );

	// console.log( '- mergedState' );
	// console.dir( mergedState, { depth: null } );
	console.log( '- collapsedValidsValue', collapsedValidsValue );
	// console.log( '- styleValue', styleValue );
	console.log( '- diffs', diffs );
	// console.log( '- blockChanges', blockChanges );

	// Iterate differences and apply changes/removes.
	for( const d of diffs ) {

		// Bestimme bestmöglichen Viewport + maxWidth für den Pfad in aktuellen changes.
		let foundValids : FoundPath | null = null;
		if( 'number' === typeof selectedViewport  ) {
			foundValids = findBasePath(
				mergedState,
				viewports,
				selectedViewport,
				attribute,
				basePath,
				d.p
			);
		}

		// Delete task.
		if( d.t === 0 || isNull( d.v ) ) {
			console.log( '- - - delete', d.p );
			console.log( '- - - foundValids', foundValids );

			// Remove from changes.
			if( isEditing ) {
				if( 'number' === typeof selectedViewport  ) {
					removeStyleFromViewportSet(
						blockChanges,
						foundValids ? foundValids.viewport : 0,
						foundValids ? foundValids.maxWidth : 0,
						attribute,
						basePath,
						d.p
					);
				} else {
					console.error( 'missing handle - string viewport' );
				}
			} else {
				removeStyleFromViewportSet(
					blockChanges,
					foundValids ? foundValids.viewport : 0,
					foundValids ? foundValids.maxWidth : 0,
					attribute,
					basePath,
					d.p
				);
			}

			// Set the value from saves.
			const savesValue = traverseGet(
				[ foundValids.viewport, foundValids.maxWidth, attribute, ... basePath, ... d.p ],
				blockSaves,
				null
			);
			// console.log( '- - - savesValue', savesValue );

			if( ! isNull( savesValue ) ) {
				setStyleInViewportSet(
					blockRemoves,
					foundValids ? foundValids.viewport : 0,
					foundValids ? foundValids.maxWidth : 0, // Needs to be dynamic.
					attribute,
					basePath,
					d.p,
					savesValue,
				);
			}

			// Remove cascade on the states.
			if( 'number' === typeof foundValids.viewport ) {
				cascadeRemove(
					blockChanges,
					blockRemoves,
					blockSaves,
					foundValids ? foundValids.viewport : 0,
					attribute,
					basePath,
					d.p,
				);

			} else {
				console.error( 'missing handle - string viewport' );
			}

		// Update task.
		} else if( d.t === 1 || d.t === 2 ) {
			console.log( '- - - update', d.p, d.v );

			if(
				'number' === typeof selectedViewport &&
				(
					foundValids && 'number' === typeof foundValids.viewport ||
					! foundValids
				)
			) {

				// Muss ich das hier schon ermitteln ob ich eine Cascade ausführen muss?
				// Eigentlich schon, da ich hier die 780 als Ziel schon haben muss mit der erwartung das dort der Datensatz abgelegt wird,
				// oder das er zumindest untersucht wird.
				const foundAppends = findAppendPath(
					mergedState,
					viewports,
					selectedViewport,
					attribute,
					basePath,
					d.p
				);

				const fallbackFoundValids = {
					viewport: 0,
					maxWidth: 0,
				}

				console.log( '- - - - foundAppends', foundAppends );
				console.log( '- - - - foundValids', foundValids );

				if( foundValids && foundAppends ) {
					if(
						foundValids.maxWidth === foundAppends.viewport - 1 ||
						foundValids.maxWidth !== 0 &&
						! isEqual( foundValids.value, d.v )
					) {
						console.log( '- - - - - appending update' );
						setStyleInViewportSet(
							blockChanges,
							foundAppends.viewport,
							foundAppends.maxWidth,
							attribute,
							basePath,
							d.p,
							d.v
						);
					} else {
						console.log( '- - - - - cascading update' );
						cascadeUpdate(
							blockChanges,
							blockRemoves,
							blockSaves,
							selectedViewport,
							foundValids,
							attribute,
							basePath,
							d.p,
							cloneDeep( d.v )
						);
					}

				} else if( foundValids ) {
					cascadeUpdate(
						blockChanges,
						blockRemoves,
						blockSaves,
						selectedViewport,
						foundValids,
						attribute,
						basePath,
						d.p,
						cloneDeep( d.v )
					);
				} else if( foundAppends ) {
					cascadeUpdate(
						blockChanges,
						blockRemoves,
						blockSaves,
						selectedViewport,
						fallbackFoundValids,
						attribute,
						basePath,
						d.p,
						cloneDeep( d.v )
					);
				} else {
					cascadeUpdate(
						blockChanges,
						blockRemoves,
						blockSaves,
						selectedViewport,
						fallbackFoundValids,
						attribute,
						basePath,
						d.p,
						cloneDeep( d.v )
					);
				}

				/*
				if( foundAppends && foundValids.maxWidth !== foundAppends.viewport - 1 ) {

				} else {

				}
				*/

			} else {
				setStyleInViewportSet(
					blockChanges,
					isEditing || isPrint ? selectedViewport : foundValids.viewport,
					foundValids.maxWidth,
					attribute,
					basePath,
					d.p,
					d.v
				);

				removeStyleFromViewportSet(
					blockRemoves,
					foundValids.viewport,
					foundValids.maxWidth,
					attribute,
					basePath,
					d.p
				);
			}
		}
	}

	console.log( '- blockChanges' );
	console.dir( blockChanges, { depth: null } );
	// console.log( '- blockRemoves' );
	// console.dir( blockRemoves, { depth: null } );
};