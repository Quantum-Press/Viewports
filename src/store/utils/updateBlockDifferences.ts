import {
	viewport,
	ViewportSet
} from "@viewports/types";
import {
	findChanges,
	findEqualProperties,
	findObjectChanges,
	findObjectPropertiesOccuring,
	findUniqueProperties,
	getMerged,
	getMergedObject,
	isLiteral,
	isObject,
	omitObjectMatching,
	subtractObject,
	traverseDelete,
	traverseGet,
	traverseSet
} from "@viewports/utils";
import {
	findViewportStylePath,
	findViewportSetIterators,
	findViewportSetOccurence,
	collapseViewportSetProperty,
} from "@viewports/store/utils";
import { subtract } from "lodash";

const {
	isNull,
	isEqual,
	isEmpty,
	cloneDeep,
} = window[ 'lodash' ];


/**
 * Set function to update differences to blockChanges and blockRemoves.
 *
 * @param {viewport} selectedViewport
 * @param {boolean} isEditing
 * @param {ViewportSet} blockChanges
 * @param {ViewportSet} blockRemoves
 * @param {ViewportSet} blockSaves
 * @param {string} property
 * @param {any} stylesValue
 * @param {any} changesValue
 * @param {any} removesValue
 * @param {any} savesValue
 */
export const updateBlockDifferences = (
	selectedViewport : viewport,
	isEditing : boolean,
	blockChanges : ViewportSet,
	blockRemoves : ViewportSet,
	blockSaves : ViewportSet,
	property : string,
	styleValue : any,
	collapsedChangesValue : any = null,
	collapsedRemovesValue : any = null,
	collapsedSavesValue : any = null
) => {

	// Set indicators.
	const hasStyleValue = ! isNull( styleValue );
	const hasCollapsedChanges = ! isNull( collapsedChangesValue );
	const hasCollapsedRemoves = ! isNull( collapsedRemovesValue );
	const hasCollapsedSaves = ! isNull( collapsedSavesValue );

	console.log( 'styleValue ------------------------------------------------------------------------', property, styleValue );
	// console.log( 'collapsedChangesValue', collapsedChangesValue );
	// console.log( 'collapsedRemovesValue', collapsedRemovesValue );
	// console.log( 'collapsedSavesValue', collapsedSavesValue );

	// Check if the styleValue is set to update.
	if( hasStyleValue ) {

		// Check if the value can be set directly.
		if( ! hasCollapsedSaves && ! hasCollapsedChanges ) {
			const updateViewport = isEditing ? selectedViewport : 0;

			traverseSet( [ updateViewport, 0, 'style', property ], blockChanges, styleValue );
		}

		// Check if the value needs more control in setting.
		if( hasCollapsedSaves || hasCollapsedChanges || hasCollapsedRemoves ) {

			// Set occurence of property settings.
			let changesViewportOccurence = hasCollapsedChanges ? findViewportSetOccurence( selectedViewport, blockChanges, property, collapsedChangesValue ) : {};
			let removesViewportOccurence = hasCollapsedRemoves ? findViewportSetOccurence( selectedViewport, blockRemoves, property, collapsedRemovesValue ) : {};
			let savesViewportOccurence = hasCollapsedSaves ? findViewportSetOccurence( selectedViewport, blockSaves, property, collapsedSavesValue ) : {};
			// console.log( 'changesViewportOccurence' );
			// console.dir( changesViewportOccurence, { depth: 10 } );
			// console.log( 'removesViewportOccurence' );
			// console.dir( removesViewportOccurence, { depth: 10 } );
			// console.log( 'savesViewportOccurence' );
			// console.dir( savesViewportOccurence, { depth: 10 } );

			// Check if the value has to cascade through settings.
			if( ! isEditing ) {

				// Merge them to get all possible paths.
				const mergedOccurence = getMergedObject( cloneDeep( savesViewportOccurence ), cloneDeep( removesViewportOccurence ), cloneDeep( changesViewportOccurence ) );

				// Deconstruct iterators.
				const {
					viewports,
					maxWidths
				} = findViewportSetIterators( mergedOccurence );

				// Set container to store occurings in.
				let occuredChanges = {};
				let updatedChanges = {};
				let occuredRemoves = {};
				let styleLeftovers = cloneDeep( styleValue );

				// Iterate over all possible combinations.
				for( const viewport of viewports ) {
					for( const maxWidth of maxWidths ) {
						const changesOccurence = hasCollapsedChanges ? traverseGet( [ viewport, maxWidth ], changesViewportOccurence ) : null;
						const removesOccurence = hasCollapsedRemoves ? traverseGet( [ viewport, maxWidth ], removesViewportOccurence ) : null;
						const savesOccurence = hasCollapsedSaves ? traverseGet( [ viewport, maxWidth ], savesViewportOccurence ) : null;

						const hasChangesOccurence = ! isNull( changesOccurence );
						const hasRemovesOccurence = ! isNull( removesOccurence );
						const hasSavesOccurence = ! isNull( savesOccurence );

						console.log( '- changesOccurence', hasChangesOccurence, changesOccurence );
						console.log( '- removesOccurence', hasRemovesOccurence, removesOccurence );
						console.log( '- savesOccurence', hasSavesOccurence, savesOccurence );
						console.log( '- viewport', viewport );
						console.log( '- maxWidth', maxWidth );

						// Continue if there is no occurence.
						if( ! hasChangesOccurence && ! hasRemovesOccurence && ! hasSavesOccurence ) {
							continue;
						}

						// const mergedChanges = hasChangesOccurence ? traverseGet( [ 'merged' ], changesOccurence ) : null;
						// const mergedRemoves = hasRemovesOccurence ? traverseGet( [ 'merged' ], removesOccurence ) : null;
						const mergedSaves = hasSavesOccurence ? traverseGet( [ 'merged' ], savesOccurence ) : null;

						// Set occurings of each state.
						const occuringSavesValue = hasSavesOccurence ? findObjectPropertiesOccuring( savesOccurence.value, styleValue ) : {};
						const occuringChangesValue = hasChangesOccurence ? findObjectPropertiesOccuring( changesOccurence.value, styleValue ) : {};
						const occuringRemovesValue = hasRemovesOccurence ? findObjectPropertiesOccuring( removesOccurence.value, styleValue ) : {};
						console.log( '- - occuringSavesValue', occuringSavesValue );
						console.log( '- - occuringChangesValue', occuringChangesValue );
						console.log( '- - occuringRemovesValue', occuringRemovesValue );

						// Update occuring states.
						occuredChanges = hasChangesOccurence ? getMerged( occuredChanges, occuringChangesValue ) : occuredChanges;
						occuredRemoves = hasRemovesOccurence ? getMerged( occuredChanges, occuringRemovesValue ) : occuredRemoves;
						console.log( '- - occuredChanges', occuredChanges );
						console.log( '- - occuredRemoves', occuredRemoves );

						// Set valid value to compare with.
						let validOccuring = {};
						let validPath = [];
						let validValue = {};
						if( hasSavesOccurence ) {
							if( hasChangesOccurence ) {
								validOccuring = getMerged( occuringSavesValue, occuringChangesValue );
								validPath = changesOccurence.path;
								validValue = getMerged( savesOccurence.value, changesOccurence.value );
							} else {
								validOccuring = occuringSavesValue;
								validPath = savesOccurence.path;
								validValue = savesOccurence.value;
							}

							/*
							if( hasRemovesOccurence ) {
								validOccuring = subtractObject( validOccuring, occuringRemovesValue );
							}
							*/

						} else if( hasChangesOccurence ) {
							validOccuring = occuringChangesValue;
							validPath = changesOccurence.path;
							validValue = changesOccurence.value;
						}

						console.log( '- - validOccuring', validOccuring );
						console.log( '- - validPath', validPath );
						console.log( '- - validValue', validValue );

						// Check if there is something to compare.
						if( ! isEmpty( validOccuring ) ) {

							// On viewport === 0 compare with whole styleValue.
							if( viewport === 0 ) {
								const changes = findChanges( styleLeftovers, validOccuring );

								console.log( '- - syleValue', styleValue );
								console.log( '- - styleLeftovers', styleLeftovers );
								console.log( '- - changes', changes );

								if( ! isEmpty( changes ) ) {
									traverseSet( validPath, blockChanges, changes );
								}

								if( hasRemovesOccurence ) {
									const validRemoves = subtractObject( validValue, styleValue, false );
									const cleanedRemoves = subtractObject( occuringRemovesValue, styleValue, false );
									console.log( '- - - validRemoves', validRemoves );
									console.log( '- - - cleanedRemoves', cleanedRemoves );
									console.log( '- - - removes', validRemoves );

									if( isNull( validRemoves ) ) {
										traverseDelete( validPath, blockRemoves );
									} else {
										traverseSet( validPath, blockRemoves, validRemoves );
									}
								}


							// On viewport > 0 compare with reduced styleValue.
							} else {
								const reducedStyleValue = Array.isArray( styleValue ) ? styleValue : findEqualProperties( styleValue, validOccuring );
								styleLeftovers = subtractObject( styleLeftovers, reducedStyleValue );
								// console.log( '- - styleValue', styleValue );
								// console.log( '- - reducedStyleValue', reducedStyleValue );
								// console.log( '- - styleLeftovers', styleLeftovers );

								const changes = findChanges( reducedStyleValue, validOccuring );
								// console.log( '- - changes', changes );

								if( ! isEmpty( changes ) ) {
									traverseSet( validPath, blockChanges, changes );
								}

								if( hasRemovesOccurence ) {
									const validRemoves = subtractObject( validValue, styleValue, false );
									const cleanedRemoves = subtractObject( occuringRemovesValue, styleValue, false );
									console.log( '- - - validRemoves', validRemoves );
									console.log( '- - - cleanedRemoves', cleanedRemoves );
									console.log( '- - - removes', validRemoves );

									if( isNull( validRemoves ) ) {
										traverseDelete( validPath, blockRemoves );
									} else {
										traverseSet( validPath, blockRemoves, validRemoves );
									}
								}
							}

						} else {
							traverseDelete( validPath, blockChanges );

							const uniqueRemoves = findChanges( validPath, occuringSavesValue );
							console.log( '- - uniqueRemoves', uniqueRemoves );
							if( 0 < Object.keys( uniqueRemoves ).length ) {
								traverseSet( validPath, blockRemoves, uniqueRemoves ); // blockRemoves
							}
						}





						// if( ! isEmpty( validOccuring ) ) {
						// 	if( isObject( validOccuring ) ) {

						// 		// Check if we need to find all leftover changes we need to set on 0.
						// 		if( viewport === 0 ) {
						// 			let changes = findObjectChanges( styleValue, validOccuring );

						// 			if( ! isEmpty( changes ) ) {
						// 				traverseSet( savesOccurence.path, blockChanges, changes );
						// 			}

						// 		// Otherwise we need to find the occurings to change.
						// 		} else {
						// 			let changes = findObjectChanges( styleValue, validOccuring );

						// 			if( ! isEmpty( changes ) ) {
						// 				traverseSet( savesOccurence.path, blockChanges, changes );
						// 			}
						// 		}

						// 	} else {
						// 		if( ! isEqual( savesOccurence.value, validOccuring ) ) {
						// 			console.log( '- - - ! isEqual( savesOccurence.value, validOccuring )' );
						// 			traverseSet( savesOccurence.path, blockChanges, validOccuring );
						// 		}
						// 	}

						// } else {
						// 	traverseDelete( savesOccurence.path, blockChanges );

						// 	const uniqueSavesRemoves = findChanges( savesOccurence.value, occuringSavesValue );
						// 	console.log( '- - - uniqueSavesRemoves', uniqueSavesRemoves );
						// 	if( 0 < Object.keys( uniqueSavesRemoves ).length ) {
						// 		traverseSet( savesOccurence.path, blockRemoves, uniqueSavesRemoves ); // blockRemoves
						// 	}
						// }
						// console.log( '- - - hasRemovesOccurence', hasRemovesOccurence );




						// Check if we need to remove.
						// if( hasRemovesOccurence ) {
						// 	const removesSubtracted = isObject( styleValue ) ? subtractObject( mergedSaves, styleValue, false ) : {};
						// 	console.log( '- - - - removesSubtracted', removesSubtracted );
						// 	console.log( '- - - - styleValue', styleValue );
						// 	console.log( '- - - - mergedSaves', mergedSaves );

						// 	if( ! isEmpty( removesSubtracted ) ) {
						// 		traverseSet( removesOccurence.path, blockRemoves, removesSubtracted ); // blockRemoves
						// 	} else {
						// 		traverseDelete( removesOccurence.path, blockRemoves ); // blockRemoves
						// 	}
						// } else {
						// 	const uniqueRemoves = isObject( styleValue ) ? subtractObject( styleValue, mergedSaves, false ) : {};

						// 	if( ! isEmpty( uniqueRemoves ) ) {
						// 		traverseSet( savesOccurence.path, blockRemoves, uniqueRemoves ); // blockRemoves
						// 	}
						// }

						// if( hasChangesOccurence ) {
						// 	const occuringChangesValue = findObjectPropertiesOccuring( styleValue, changesOccurence.value );
						// 	console.log( '- - occuringChangesValue', occuringChangesValue );

						// 	if( ! isEmpty( occuringChangesValue ) ) {
						// 		traverseSet( changesOccurence.path, blockChanges, occuringChangesValue );

						// 	} else {
						// 		traverseDelete( changesOccurence.path, blockChanges );
						// 	}
						// }
					}
				}

			// Set the value compare to actual viewport.
			} else {
				const updateViewport = selectedViewport;

				// Set the value by states.
				let value = null;
				let update = true;

				// Property has ! removes && saves && ! changes
				if( ! hasCollapsedRemoves && hasCollapsedSaves && ! hasCollapsedChanges ) {
					console.log( '- Property has ! removes && saves && ! changes' );
					value = findChanges( styleValue, collapsedSavesValue );
				}

				// Property has removes && saves && ! changes
				if( hasCollapsedRemoves && hasCollapsedSaves && ! hasCollapsedChanges ) {
					const validValue = subtractObject( collapsedSavesValue, collapsedRemovesValue );
					console.log( '- Property has removes && saves && ! changes' );
					console.log( '- validValue', validValue );

					value = findChanges( styleValue, validValue );
				}

				// Property has removes && saves && changes
				if( hasCollapsedRemoves && hasCollapsedSaves && hasCollapsedChanges ) {
					let validValue = subtractObject( collapsedSavesValue, collapsedRemovesValue );
						validValue = getMergedObject( validValue, collapsedChangesValue );

					console.log( '- Property has removes && saves && ! changes' );
					console.log( '- validValue', validValue );

					value = findChanges( styleValue, validValue );
				}

				// Property has ! removes && saves && changes
				if( ! hasCollapsedRemoves && hasCollapsedSaves && hasCollapsedChanges ) {
					const validValue = getMergedObject( collapsedSavesValue, collapsedChangesValue );
					console.log( '- Property has ! removes && saves && changes' );
					console.log( '- validValue', validValue );

					value = findChanges( styleValue, validValue );
				}

				// Property has ! removes && ! saves && changes
				if( ! hasCollapsedRemoves && ! hasCollapsedSaves && hasCollapsedChanges ) {
					console.log( '- Property has ! removes && ! saves && changes' );

					const isEqualChanges = isEqual( styleValue, collapsedChangesValue );
					console.log( '- isEqualChanges', isEqualChanges );

					value = ! isEqualChanges ? findChanges( styleValue, collapsedSavesValue ) : collapsedChangesValue;
					update = ! isEqualChanges;
				}

				console.log( '- value', value );
				console.log( '- update', update );

				// Check if there is something to handle update.
				if( update ) {

					// Find the path to actual value in blockChange or blockSaves to updateViewport.
					let savesPath = hasCollapsedSaves ? findViewportStylePath( updateViewport, property, blockSaves ) : null;
					let changesPath = hasCollapsedChanges ? findViewportStylePath( updateViewport, property, blockChanges ) : null;
					let updatePath = null;

					if( ! isNull( changesPath ) && changesPath[ 0 ] === updateViewport ) {
						updatePath = changesPath;
						console.log( '- updatePath changesPath', changesPath );
					} else if( ! isNull( savesPath ) && savesPath[ 0 ] === updateViewport ) {
						updatePath = savesPath;
						console.log( '- updatePath changesPath', changesPath );
					}

					if( isNull( updatePath ) ) {
						updatePath = [ updateViewport, 0, 'style', property ];
						console.log( '- updatePath fallback', updatePath );
					}

					if( ! isNull( value ) ) {
						if( ! isObject( value ) ) {
							if( Array.isArray( value ) ) {
								console.log( '- isArray', value );
							};

							traverseSet( updatePath, blockChanges, value );
						} else {
							if( 0 < Object.keys( value ).length ) {
								traverseSet( updatePath, blockChanges, value );
							}
						}
					} else {
						traverseDelete( updatePath, blockChanges );
					}
				}


				// Check if there are any properties to remove.
				let removes = omitObjectMatching( collapsedSavesValue, styleValue );
				console.log( '- removes --------------------------------------------------------------------', removes );

				// Check if there is something to handle in removes.
				if( isObject( removes ) ) {

					// Empty objects results in deleting property from blockRemoves.
					if( ! Object.keys( removes ).length ) {
						let removesPath = findViewportStylePath( updateViewport, property, blockRemoves );

						if( ! isNull( removesPath ) ) {
							traverseDelete( removesPath, blockRemoves );
						}

					} else {
						const recollapsedChangesValue = collapseViewportSetProperty( blockChanges, updateViewport, property );
						const recollapsedSavesValue = collapseViewportSetProperty( blockSaves, updateViewport, property );

						let changesViewportOccurence = findViewportSetOccurence( updateViewport, blockChanges, property, recollapsedChangesValue );
						let savesViewportOccurence = findViewportSetOccurence( updateViewport, blockSaves, property, recollapsedSavesValue );

						console.log( '- changesViewportOccurence', changesViewportOccurence );
						console.log( '- savesViewportOccurence', savesViewportOccurence );
						console.log( '- collapsed to viewport', updateViewport );

						const mergedOccurence = getMergedObject( savesViewportOccurence, changesViewportOccurence );

						console.log( '- mergedOccurence', mergedOccurence )

						// Deconstruct iterators.
						const {
							viewports,
							maxWidths
						} = findViewportSetIterators( mergedOccurence );

						let firstViewport = null;
						let foundStyles = 0;

						for( const viewport of viewports ) {
							for( const maxWidth of maxWidths ) {

								/**/
								const changesOccurence = hasCollapsedChanges ? traverseGet( [ viewport, maxWidth ], changesViewportOccurence ) : null;
								const savesOccurence = hasCollapsedSaves ? traverseGet( [ viewport, maxWidth ], savesViewportOccurence ) : null;

								const hasChangesOccurence = ! isNull( changesOccurence );
								const hasSavesOccurence = ! isNull( savesOccurence );

								console.log( '- viewport', viewport );
								console.log( '- maxWidth', maxWidth );
								console.log( '- changesOccurence', hasChangesOccurence, changesOccurence );
								console.log( '- savesOccurence', hasSavesOccurence, savesOccurence );

								// Continue if there is no occurence.
								if( ! hasChangesOccurence && ! hasSavesOccurence ) {
									continue;
								}

								// Increment foundStyles counter.
								foundStyles++;

								// Set the first viewport.
								if( ! firstViewport ) {
									firstViewport = viewport;
								}

								// Check the first viewport that is on viewport 0.
								if( 1 === foundStyles ) {

									// Remove entire change or partial
									if( hasChangesOccurence ) {
										const equalChanges = findEqualProperties( changesOccurence.value, removes );
										console.log( '- - changesOccurence.value', changesOccurence.value );
										console.log( '- - equalChanges', equalChanges );

										if( 0 < Object.keys( equalChanges ).length ) {
											const cleanedChanges = subtractObject( changesOccurence.value, removes, false );
											console.log( '- - - cleanedChanges', cleanedChanges );

											if( isNull( cleanedChanges ) ) {
												traverseDelete( changesOccurence.path, blockChanges );
											} else {
												traverseSet( changesOccurence.path, blockChanges, cleanedChanges );
											}
										}
									}

									// Remove the property from saves.
									if( hasSavesOccurence ) {
										const equalSaves = findEqualProperties( savesOccurence.value, removes );
										console.log( '- - savesOccurence.value', savesOccurence.value );
										console.log( '- - equalSaves', equalSaves );

										if( 0 < Object.keys( equalSaves ).length ) {
											traverseSet( savesOccurence.path, blockRemoves, equalSaves );
										}
									}

									continue;
								}


								// Check if we find a viewport to restrict.
								if( 2 === foundStyles ) {

									// Change the 2nd save
									if( hasChangesOccurence ) {
										traverseDelete( changesOccurence.path, blockChanges );
										traverseSet( [ viewport, firstViewport - 1, 'style', property ], blockChanges, changesOccurence.value );
									}

									if( ! hasChangesOccurence && hasSavesOccurence ) {
										traverseSet( [ viewport, firstViewport - 1, 'style', property ], blockChanges, savesOccurence.value );
									}
								}
							}
						}
					}
				}
			}
		}

	// If we need to remove a property entirely
	} else {
		let changesViewportOccurence = findViewportSetOccurence( selectedViewport, blockChanges, property, collapsedChangesValue );
		let savesViewportOccurence = findViewportSetOccurence( selectedViewport, blockSaves, property, collapsedSavesValue );

		const mergedOccurence = getMergedObject( savesViewportOccurence, changesViewportOccurence );

		// Deconstruct iterators.
		const {
			viewports,
			maxWidths
		} = findViewportSetIterators( mergedOccurence );

		let mergedRemoves = {};
		let firstViewport = null;
		let hasRemovedSaves = false;
		let hasRemovedChanges = false;

		for( const viewport of viewports ) {
			for( const maxWidth of maxWidths ) {
				const changesOccurence = hasCollapsedChanges ? traverseGet( [ viewport, maxWidth ], changesViewportOccurence ) : null;
				const savesOccurence = hasCollapsedSaves ? traverseGet( [ viewport, maxWidth ], savesViewportOccurence ) : null;

				const hasChangesOccurence = ! isNull( changesOccurence );
				const hasSavesOccurence = ! isNull( savesOccurence );

				console.log( '- viewport', viewport );
				console.log( '- maxWidth', maxWidth );
				console.log( '- changesOccurence', hasChangesOccurence, changesOccurence );
				console.log( '- savesOccurence', hasSavesOccurence, savesOccurence );

				// Continue if there is no occurence.
				if( ! hasChangesOccurence && ! hasSavesOccurence ) {
					continue;
				}

				if( hasChangesOccurence ) {
					traverseDelete( changesOccurence.path, blockChanges );
				}

				if( hasSavesOccurence ) {
					traverseSet( savesOccurence.path, blockRemoves, savesOccurence.value );
				}
			}
		}
	}
}