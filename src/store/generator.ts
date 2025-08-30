import type {
	RendererSet,
	ViewportSet,
	ViewportStyleSets,
	BlockStyles,
	CSSProperties,
	CSSCollectionSet,
	CSSViewportSet,
	SpectrumSet,
	SpectrumState,
	InlineStyleSet,
	ViewportStyleSet,
} from '../types';
import {
	getMergedObject,
	findObjectChanges,
	findObjectDifferences,
	traverseGet,
	cleanupObject,
	traverseSet,
	findUniqueProperties,
	findChanges,
} from '../utils';
import {
	findViewportStylePath,
	collapseViewportSet,
} from './utils';

const {
	isEqual,
	isEmpty,
	isObject,
	cloneDeep
} = window[ 'lodash' ];

/**
 * Set class to handle style generation by block attributes.
 */
export class Generator {
	clientId: string;
	blockName: string;
	selector: string;
	state: SpectrumState;
	spectrumSet: SpectrumSet;
	css: CSSViewportSet;
	inlineStyle: InlineStyleSet;
	properties: Array<any>;
	viewports: Array<number>;

	/**
	 * Set constructor to build object.
	 *
	 * @param clientId
	 * @param blockName
	 * @param state
	 */
	constructor(
		clientId : string,
		blockName : string,
		state : SpectrumState
	) {

		// Set properties.
		this.clientId = clientId;
		this.blockName = blockName;
		this.selector = '#block-' + clientId;
		this.state = state;

		'core/group' === this.blockName && console.log( 'construct', this );

		// Set property defaults.
		this.spectrumSet = null;
		this.css = null;
		this.inlineStyle = null;
		this.properties = null;
		this.viewports = null;

		// Fill spectrumSet.
		this.spectrumSet = this.getSpectrumSet();

		// Fill rules initial as base for further operations.
		this.properties = this.getSpectrumSetProperties();
		this.viewports = this.getSpectrumSetViewports();

		'core/group' === this.blockName && console.log( 'constructed', this );
	}


	/**
	 * Set method to return spectrum set.
	 */
	getSpectrumSet() {
		if( null === this.spectrumSet ) {
			this.spectrumSet = this.generateSpectrumSet();
		}

		return this.spectrumSet;
	}


	/**
	 * Set method to generate spectrumSet.
	 */
	generateSpectrumSet() {

		// Set compiler options.
		const options = {
			selector: this.selector
		};

		// Set combined valids + removes from store to build rules from.
		let combinedViewportSet : ViewportSet = {};
		if( isObject( this.state.valids ) && ( isObject( this.state.removes ) && ! isEmpty( this.state.removes ) ) ) {
			combinedViewportSet = getMergedObject( cloneDeep( this.state.removes ), cloneDeep( this.state.valids ) );
		} else {
			combinedViewportSet = cloneDeep( this.state.valids );
		}

 		// Set initial states.
		const spectrumSet = [] as SpectrumSet;
		let prevStyleSets = {} as ViewportStyleSets;

		// Set function to indicate equal prev viewportStyleSet.
		const isEqualPrevStyleSet = ( maxWidth : number, viewportStyleSet : ViewportStyleSet ) => {
			if(
				prevStyleSets.hasOwnProperty( maxWidth ) &&
				isEqual( prevStyleSets[ maxWidth ], viewportStyleSet )
			) {
				return true;
			}

			return false;
		}

		'core/group' === this.blockName && console.log( 'combinedViewportSet', combinedViewportSet );

		// Iterate over block valids and removes combined.
		for( const viewportDirty in combinedViewportSet ) {
			if ( combinedViewportSet.hasOwnProperty( viewportDirty ) ) {
				const viewportStyleSets = combinedViewportSet[ viewportDirty ];
				const viewport = parseInt( viewportDirty );

				// Iterate over viewportStyleSet maxWidths.
				for( const maxWidthDirty in viewportStyleSets ) {
					if( viewportStyleSets.hasOwnProperty( maxWidthDirty ) ) {
						const viewportStyleSet = viewportStyleSets[ maxWidthDirty ];
						const maxWidth = parseInt( maxWidthDirty );

						// Check if there are styles.
						if( viewportStyleSet.style ) {

							// Ignore if the style equals the previous style attributes.
							if( isEqualPrevStyleSet( maxWidth, viewportStyleSet ) ) {
								continue;
							}

							// Set collapsed viewportStyleSet of saves till actual viewport.
							const collapsedSavesAttributes = collapseViewportSet( this.state.saves, viewport );
							const collapsedChangesAttributes = this.state.changes ? collapseViewportSet( this.state.changes, viewport ) : {};
							const collapsedRemovesAttributes = this.state.removes ? collapseViewportSet( this.state.removes, viewport ) : {};

							// Iterate over properties to handle each seperately.
							for( const [ property ] of Object.entries( viewportStyleSet.style ) ) {
								if( 'spacing' === property ) {
									console.log( '- property', property );
									console.log( '- viewport', viewport );
									console.log( '- maxWidth', maxWidth );
								}

								// Set renderers for actual property and check if we got one.
								const rendererSet = traverseGet( [ property ], this.state.rendererPropertySet ) as RendererSet;
								const renderers = rendererSet ? Object.entries( rendererSet ) : [];
								if( ! renderers.length ) {
									continue;
								}

								// Set paths to each state of actual property.
								const savesPath = findViewportStylePath( viewport, property, this.state.saves );
								const changesPath = isObject( this.state.changes ) ? findViewportStylePath( viewport, property, this.state.changes ) : false;
								const removesPath = isObject( this.state.removes ) ? findViewportStylePath( viewport, property, this.state.removes ) : false;

								// Continue on no states.
								if( ! removesPath && ! savesPath && ! changesPath ) {
									console.log( '- skip empt paths' );
									continue;
								}

								// Set valids path to each of actual property.
								const validsPath = findViewportStylePath( viewport, property, this.state.valids );

								// Set each state value of actual property
								let validsAttribute = {};
								if( validsPath ) {
									validsAttribute = cloneDeep( traverseGet( validsPath, this.state.valids, {} ) );
								}
								let savesAttribute : BlockStyles = {};
								let hasSavesAttribute = false;
								if( savesPath ) {
									hasSavesAttribute = true;
									savesAttribute = cloneDeep( traverseGet( savesPath, this.state.saves, {} ) );
								}
								let changesAttribute : BlockStyles = {};
								let hasChangesAttribute = false;
								if( changesPath ) {
									hasChangesAttribute = true;
									changesAttribute = cloneDeep( traverseGet( changesPath, this.state.changes, {} ) );
								}
								let removesAttribute : BlockStyles = {};
								let hasRemovesAttribute = false;
								if( removesPath ) {
									hasRemovesAttribute = true;
									removesAttribute = cloneDeep( traverseGet( removesPath, this.state.removes, {} ) );
								}

								// Set combined attributes.
								let combined = {};
								if( isEmpty( validsAttribute ) && ! isEmpty( removesAttribute ) ) {
									combined = removesAttribute;
								} else if( ( ! isEmpty( validsAttribute ) && isEmpty( removesAttribute ) ) || isEqual( validsAttribute, removesAttribute ) ) {
									combined = validsAttribute;
								} else if( ! isEqual( validsAttribute, removesAttribute ) ) {
									combined = getMergedObject( validsAttribute, removesAttribute );
								} else {
									combined = validsAttribute;
								}

								// Set combined simulation object.
								const combinedSimulation = {
									[ property ]: combined,
								}

								// Set valids simulation object.
								const validsSimulation = {
									[ property ]: validsAttribute,
								}

								// Set collapsed attribute.
								const collapsedSavesAttribute = cloneDeep( traverseGet( [ property ], collapsedSavesAttributes, {} ) );
								const collapsedChangesAttribute = cloneDeep( traverseGet( [ property ], collapsedChangesAttributes, {} ) );
								const collapsedRemovesAttribute = cloneDeep( traverseGet( [ property ], collapsedRemovesAttributes, {} ) );

								if( 'spacing' === property ) {
									console.log( '- - collapsedSavesAttribute', collapsedSavesAttribute );
									console.log( '- - collapsedChangesAttribute', collapsedChangesAttribute );
									console.log( '- - collapsedRemovesAttribute', collapsedRemovesAttribute );
								}

								// Set saves simulation object.
								const savesSimulation = {
									[ property ]: collapsedSavesAttribute,
								}

								// Set changes simulation object.
								const changesMergedSimulation = {
									[ property ]: getMergedObject( cloneDeep( collapsedSavesAttribute ), cloneDeep( collapsedChangesAttribute ) ),
								}
								const changesFallbackSimulation = {
									[ property ]: changesAttribute,
								}

								// Set removes simulation objects.
								const removesUniqueSimulation = {
									[ property ]: findUniqueProperties( cloneDeep( collapsedSavesAttribute ), cloneDeep( collapsedRemovesAttribute ) )
								}
								const removesCollapsedSimulation = {
									[ property ]: cloneDeep( collapsedRemovesAttribute ),
								}
								const removesFallbackSimulation = {
									[ property ]: cloneDeep( removesAttribute ),
								}

								if( 'spacing' === property ) {
									console.log( '- - savesSimulation', savesSimulation );
									console.log( '- - changesMergedSimulation', changesMergedSimulation );
									console.log( '- - changesFallbackSimulation', changesFallbackSimulation );
									console.log( '- - removesUniqueSimulation', removesUniqueSimulation );
									console.log( '- - removesFallbackSimulation', removesFallbackSimulation );
								}

								// Iterate over renderers to store its rules.
								for( const [ priorityDirty, renderer ] of renderers ) {

									// Cleanup priorityDirty.
									const priority = parseInt( priorityDirty );

									// Set combined results of custom renderer callback and get its parts.
									const combinedCSS = Object.keys( combined ).length ? renderer.callback( combinedSimulation, options, this.state.isSaving ) : '';
									const combinedCSSCollectionSet = '' !== combinedCSS ? this.getCSSCollectionSet( combinedCSS ) : [];

									const validsCSS = Object.keys( validsAttribute ).length ? renderer.callback( validsSimulation, options, this.state.isSaving ) : '';
									const validsCSSCollectionSet = '' !== validsCSS ? this.getCSSCollectionSet( validsCSS ) : [];

									// Set saves results of custom renderer callback and get its parts.
									const savesCSS = hasSavesAttribute ? renderer.callback( savesSimulation, options, this.state.isSaving ) : '';
									const savesCSSCollectionSet = '' !== savesCSS ? this.getCSSCollectionSet( savesCSS ) : [];

									// Set changes results of custom renderer callback and get its parts.
									const changesFallbackCSS = hasChangesAttribute ? renderer.callback( changesFallbackSimulation, options, this.state.isSaving ) : '';
									const changesFallbackCSSCollectionSet = '' !== changesFallbackCSS ? this.getCSSCollectionSet( changesFallbackCSS ) : [];

									// Set unique changes results of custom renderer callback and get its parts, in case we need another type of interpretation.
									let changesMergedCSS = '';
									let changesMergedCSSCollectionSet = [];

									// Check if we need to compare another way.
									if( hasChangesAttribute && '' === changesFallbackCSS ) {
										changesMergedCSS = renderer.callback( changesMergedSimulation, options, this.state.isSaving );
										changesMergedCSSCollectionSet = '' !== changesMergedCSS ? this.getCSSCollectionSet( changesMergedCSS ) : [];
									}

									// Set fallback removes results of custom renderer callback and get its parts.
									const removesFallbackCSS = hasRemovesAttribute ? renderer.callback( removesFallbackSimulation, options, this.state.isSaving ) : '';
									const removesFallbackCSSCollectionSet = '' !== removesFallbackCSS ? this.getCSSCollectionSet( removesFallbackCSS ) : [];

									// Set unique removes results of custom renderer callback and get its parts, in case we need another type of interpretation.
									let removesUniqueCSS = '';
									let removesUniqueCSSCollectionSet = [];

									// Check if we need to compare another way.
									if( hasRemovesAttribute && '' === removesFallbackCSS ) {
										removesUniqueCSS = renderer.callback( removesUniqueSimulation, options, this.state.isSaving );
										removesUniqueCSSCollectionSet = '' !== removesUniqueCSS ? this.getCSSCollectionSet( removesUniqueCSS ) : [];
									}

									// Iterate over collectionSet to generate spectrumSet
									for( let index = 0; index < combinedCSSCollectionSet.length; index++ ) {

										// Set default selector.
										let {
											selector,
											declarations: combinedDeclarations,
										} = combinedCSSCollectionSet[ index ];

										// Set declarations from valids when selectors are the same.
										let declarations = '';
										for( let index = 0; index < validsCSSCollectionSet.length; index++ ) {
											const {
												selector: checkSelector,
												declarations: checkDeclarations,
											} = validsCSSCollectionSet[ index ];

											if( selector === checkSelector ) {
												declarations = checkDeclarations;
												break;
											}
										}

										if( renderer.mapping.hasOwnProperty( this.blockName ) ) {
											selector = selector + ' ' + renderer.mapping[ this.blockName ];
										}

										// Set media queries.
										const media =
											viewport > 0 && maxWidth > 0 ?
												'min-width:' + viewport + 'px) and (max-width:' + maxWidth + 'px' :
											viewport > 0 ?
												'min-width:' + viewport + 'px' :
												'';

										// Set media change
										const hasMediaChange = false;

										// Set valid css.
										const css = selector + '{' + declarations + '}';
										const properties = this.generateProperties( selector + '{' + combinedDeclarations + '}' );

										// Set saves properties.
										const savesDeclarations = Object.keys( savesCSSCollectionSet ).length ? this.getDeclarations( selector, savesCSSCollectionSet ) : '';
										const savesProperties = '' !== savesDeclarations ? this.generateProperties( selector + '{' + savesDeclarations + ' }' ) : {};
										const hasSaves = 0 < Object.keys( savesProperties ).length ? true : false;

										// Set changes properties.
										let changesProperties = {};
										if( hasChangesAttribute ) {
											if( '' === changesFallbackCSS ) {
												if ( '' !== changesMergedCSS ) {
													const changesDeclarations = Object.keys( changesMergedCSSCollectionSet ).length ? this.getDeclarations( selector, changesMergedCSSCollectionSet ) : '';
													const changesDirtyProperties = '' !== changesDeclarations ? this.generateProperties( selector + '{' + changesDeclarations + ' }' ) : {};

													changesProperties = 0 < Object.keys( changesDirtyProperties ).length ? findObjectDifferences( savesProperties, changesDirtyProperties ) : {};
												}
											} else {
												const changesDeclarations = Object.keys( changesFallbackCSSCollectionSet ).length ? this.getDeclarations( selector, changesFallbackCSSCollectionSet ) : '';

												changesProperties = '' !== changesDeclarations ? this.generateProperties( selector + '{' + changesDeclarations + ' }' ) : {};
											}
										}
										const hasChanges = 0 < Object.keys( changesProperties ).length ? true : false;

										// Set removes properties.
										let removesProperties = {};
										if( hasRemovesAttribute ) {
											if( '' === removesFallbackCSS ) {
												if ( '' !== removesUniqueCSS ) {
													const removesDeclarations = Object.keys( removesUniqueCSSCollectionSet ).length ? this.getDeclarations( selector, removesUniqueCSSCollectionSet ) : '';
													const removesDirtyProperties = '' !== removesDeclarations ? this.generateProperties( selector + '{' + removesDeclarations + ' }' ) : {};

													removesProperties = 0 < Object.keys( removesDirtyProperties ).length ? findChanges( savesProperties, removesDirtyProperties ) : {};
												}
											} else {
												const removesDeclarations = Object.keys( removesFallbackCSSCollectionSet ).length ? this.getDeclarations( selector, removesFallbackCSSCollectionSet ) : '';
												removesProperties = '' !== removesDeclarations ? this.generateProperties( selector + '{' + removesDeclarations + ' }' ) : {};
											}
										}
										const hasRemoves = 0 < Object.keys( removesProperties ).length ? true : false;

										if( 'spacing' === property ) {
											console.log( '- - - savesDeclarations', savesDeclarations );
											console.log( '- - - savesProperties', savesProperties );
											console.log( '- - - hasSaves', hasSaves );

											console.log( '- - - changesProperties', changesProperties );
											console.log( '- - - hasChanges', hasChanges );

											console.log( '- - - removesProperties', removesProperties );
											console.log( '- - - hasRemoves', hasRemoves );
										}

										// Set changes properties by detecting changes between saves and valids.
										// const changesProperties = findObjectDifferences( findObjectChanges( validsProperties, collapsedSavesProperties ), removesProperties );
										// const hasChanges = 0 < Object.keys( changesProperties ).length ? true : false;

										// Set rule.
										spectrumSet.push( {
											type: renderer.type,
											blockName: this.blockName,
											property,
											priority,
											viewport,
											from: viewport,
											to: maxWidth > 0 ? maxWidth : -1,
											media,
											hasMediaChange,
											selector,
											selectors: {
												panel: renderer.selectors.hasOwnProperty( 'panel' ) ? renderer.selectors.panel : 'missing',
												label: renderer.selectors.hasOwnProperty( 'label' ) ? renderer.selectors.label : 'missing',
											},
											declarations,
											css,
											style: {
												[ property ]: validsAttribute,
											},
											properties,
											saves: savesAttribute,
											savesProperties,
											hasSaves,
											changes: changesAttribute,
											changesProperties: changesProperties,
											hasChanges,
											removes: removesAttribute,
											removesProperties,
											hasRemoves,
										} );
									}
								}
							}

							// Prepare prev state for next iteration.
							prevStyleSets[ maxWidth ] = viewportStyleSet;
						}
					}
				}
			}
		};

		// Debug spectrumSet.
		// 'core/group' === this.blockName && console.log( 'spectrumSet', spectrumSet );

		return spectrumSet;
	}


	/**
	 * Set method to return SelectorSet from CSS string.
	 */
	getCSSCollectionSet( baseCSS : string ) : CSSCollectionSet {
		const CSSCollectionSet = [] as CSSCollectionSet;

		// Set baseParts by splitting baseCSS with selector.
		const baseParts = baseCSS.split( this.selector );
		baseParts.shift();

		// Iterate over baseParts to create CSSParts
		baseParts.forEach( basePart => {

			// Set each part with its own selector.
			const part = this.selector + basePart;

			// Set selector by combining base selector with nested selectors.
			const selectors = part.split( '{', );

			// Iterate over each selector part.
			for( let i = 0; i < selectors.length - 1; i++ ) {

				// Set selector and declarations.
				const selector = selectors[ i ].trim();
				const declarations = selectors[ i + 1 ].split( '}' )[ 0 ].trim();

				// Push Set.
				CSSCollectionSet.push( {
					selector,
					declarations,
				} );
			}
		} );

		return CSSCollectionSet;
	}


	/**
	 * Set method to return wp native selector panel by property.
	 */
	getDeclarations( selector : string, collectionSet : CSSCollectionSet ) : string {
		for( let index = 0; index < collectionSet.length; index++ ) {
			const collection = collectionSet[ index ];

			if( selector === collection.selector ) {
				return collection.declarations;
			}
		}

		return '';
	}


	/**
	 * Set method to generate properties from css string.
	 */
	generateProperties( css ) : CSSProperties {

		// Search for property key -> value pairs.
		const regex = /([^{}]+)\{([^{}]+)\}/g;
		let match;

		// Set properties default.
		const properties = {};

		// Iterate over key -> value pairs from matches.
		while( ( match = regex.exec( css ) ) !== null ) {
			const declarations = match[2].trim();

			// Split declarations by semicolon to get individual property declarations
			const declarationParts = declarations.split( ';' );

			// Iterate over property declarations
			declarationParts.forEach( part => {

				// First we split part into parts.
				const parts = part.split( ':' );

				// Then we extract first encounter as property and merge the rest as value.
				// This makes background-image possible.
				const property = parts.shift().trim();
				const value = parts.join( ':' ).trim();

				// Cleanup empty entries.
				if( '' !== property && '' !== value ) {
					properties[ property ] = value;
				}
			});
		}

		return properties;
	}


	/**
	 * Set method to return properties from spectrumSet.
	 */
	getSpectrumSetProperties() {
		if( null === this.properties ) {
			this.properties = this.createSpectrumSetProperties();
		}

		return this.properties;
	}


	/**
	 * Set method to return properties from spectrumSet.
	 */
	createSpectrumSetProperties() {

		// Set properties default.
		const properties = new Set<string>();

		// Map all properties.
		this.spectrumSet.forEach( spectrum => {
			properties.add( spectrum.property );
		} );

		// Return unique properties.
		return Array.from( properties );
	}


	/**
	 * Set method to return viewports from SpectrumSet.
	 */
	getSpectrumSetViewports() {
		if( null === this.viewports ) {
			this.viewports = this.createSpectrumSetViewports();
		}

		return this.viewports;
	}


	/**
	 * Set method to return viewports from spectrumSet.
	 */
	createSpectrumSetViewports() {

		// Set viewports default.
		const viewports = new Set<number>();

		// Map all viewports.
		this.spectrumSet.forEach( spectrum => {
			viewports.add( spectrum.viewport );
		} );

		// Return unique viewports.
		return Array.from( viewports );
	}


	/**
	 * Set method to getCSS.
	 */
	getCSSViewportSet() {
		if( null === this.css ) {
			this.css = this.generateCSSViewportSet();
		}

		return this.css;
	}


	/**
	 * Set method to generate css.
	 */
	generateCSSViewportSet() {

		// Check if we get some rules.
		if( ! Object.entries( this.spectrumSet ).length ) {
			return [];
		}

		// Set css defaults
		const cssViewportSet : CSSViewportSet = {};

		// Set unfiltered spectrumSet.
		const spectrumSet = this.getSpectrumSet();

		// Iterate over spectrums to collect css.
		for( let i = 0; i < spectrumSet.length; i++ ) {
			const spectrum = spectrumSet[ i ];
			const importantCSS = spectrum.css.split( ';' ).join( '!important;' );

			// Set indicators.
			const hasSaves = Object.keys( spectrum.saves ).length ? true : false;
			const hasRemoves = Object.keys( spectrum.removes ).length ? true : false;

			// Check if we have removed all saves.
			if( hasSaves && hasRemoves && isEqual( spectrum.removes, spectrum.saves ) ) {
				continue;
			}

			if( ! cssViewportSet.hasOwnProperty( spectrum.viewport ) ) {
				cssViewportSet[ spectrum.viewport ] = [];
			}

			if( spectrum.media === '' ) {
				cssViewportSet[ spectrum.viewport ].push( importantCSS );
			} else {
				cssViewportSet[ spectrum.viewport ].push( '@media (' + spectrum.media + '){' + importantCSS + '}' );
			}
		}

		// Return joined css.
		return cssViewportSet;
	}


	/**
	 * Set method to get inlineStyle.
	 */
	getInlineStyle() {
		if( null === this.inlineStyle ) {
			this.inlineStyle = this.generateInlineStyle();
		}

		return this.inlineStyle;
	}


	/**
	 * Set method to generate inlineStyle.
	 */
	generateInlineStyle() {
		const spectrumSet = this.getSpectrumSet();
		const inlineStyle = {} as InlineStyleSet;

		// Iterate over spectrumSet to generate inlineStyle.
		spectrumSet.forEach( ( spectrum ) => {

			// Set indicators.
			const hasSaves = Object.keys( spectrum.saves ).length ? true : false;
			const hasRemoves = Object.keys( spectrum.removes ).length ? true : false;

			// Check if we have removed all saves.
			if( hasSaves && hasRemoves && isEqual( spectrum.removes, spectrum.saves ) ) {
				return true;
			}

			if( ! inlineStyle.hasOwnProperty( spectrum.viewport ) ) {
				inlineStyle[ spectrum.viewport ] = {};
			}

			if( ! inlineStyle[ spectrum.viewport ].hasOwnProperty( spectrum.property ) ) {
				inlineStyle[ spectrum.viewport ][ spectrum.property ] = [];
			}

			const selector = spectrum.selector.replace( this.selector, '%' );

			inlineStyle[ spectrum.viewport ][ spectrum.property ].push( {
				priority: spectrum.priority,
				css: selector + '{' + spectrum.declarations + '}',
				from: spectrum.from,
				to: spectrum.to,
			} );
		} );

		// Debug inlineStyle.
		// console.log( 'inlineStyle', inlineStyle );

		return inlineStyle;
	}
}

export default Generator;