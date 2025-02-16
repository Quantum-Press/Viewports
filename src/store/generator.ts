import type {
	RendererSet,
	ViewportStyle,
	Styles,
	CSSProperties,
	CSSCollectionSet,
	CSSViewportSet,
	RuleSet,
	Rule,
	SpectrumSet,
	Spectrum,
	SpectrumState,
	InlineStyleSet,
	ViewportStyleSet,
} from '../store';
import { getMergedAttributes, traverseGet } from '../utils';
import { findObjectChanges, findObjectDifferences } from './utils';

const { isEqual, isEmpty, isObject, cloneDeep } = window[ 'lodash' ];

/**
 * Set class to handle style generation by block attributes.
 */
export class Generator {
	clientId: string;
	blockName: string;
	selector: string;
	state: SpectrumState;
	ruleSet: RuleSet;
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

		// Set property defaults.
		this.ruleSet = null;
		this.spectrumSet = null;
		this.css = null;
		this.inlineStyle = null;
		this.properties = null;
		this.viewports = null;

		// Fill rules initial as base for further operations.
		this.ruleSet = this.getRuleSet();
		this.properties = this.getRuleSetProperties();
		this.viewports = this.getRuleSetViewports();

		// Fill spectrumSet.
		this.spectrumSet = this.getSpectrumSet();
	}


	/**
	 * Set method to return rules.
	 */
	getRuleSet() {
		if( null === this.ruleSet ) {
			this.ruleSet = this.generateRuleSet();
		}

		return this.ruleSet;
	}


	/**
	 * Set method to generate ruleSet.
	 */
	generateRuleSet() {

		// Set compiler options.
		const options = {
			selector: this.selector
		};

		// Set combined valids + removes from store to build rules from.
		let combined = {} as ViewportStyle;
		if( isObject( this.state.valids ) && isObject( this.state.removes ) ) {
			combined = getMergedAttributes( cloneDeep( this.state.removes ), cloneDeep( this.state.valids ) ) as ViewportStyle;
		} else {
			combined = cloneDeep( this.state.valids );
		}

		// Set initial states.
		const ruleSet = [] as RuleSet;
		let prevStyle = {} as Styles;
		let prevValids = {} as Styles;
		let prevRemoves = {} as Styles;

		// Iterate over block valids.
		Object.entries( combined ).forEach( ( [ viewportDirty, { style } ] ) => {

			// Cleanup viewport.
			const viewport = parseInt( viewportDirty );

			// Check if there are styles.
			if( style ) {

				// Ignore if the style equals the previous style attributes.
				if( isEqual( prevStyle, style ) ) {
					return true;
				}

				// Set collapsed viewportStyleSet of saves till actual viewport.
				const collapsedSavesSet = this.collapseViewportStyleSet( this.state.saves, viewport );

				// Iterate over properties to handle each seperately.
				for( const [ property ] of Object.entries( style ) ) {

					// Set renderers for actual property and check if we got one.
					const rendererSet = traverseGet( [ property ], this.state.rendererPropertySet ) as RendererSet;
					const renderers = rendererSet ? Object.entries( rendererSet ) : [];
					if( ! renderers.length ) {
						continue;
					}

					// Set state attributes.
					const valids = cloneDeep( traverseGet( [ viewport, 'style', property ], this.state.valids, {} ) );
					const removes = cloneDeep( traverseGet( [ viewport, 'style', property ], this.state.removes, {} ) );

					// Check if state changes that we need to go further.
					if(
						prevValids.hasOwnProperty( property ) &&
						prevRemoves.hasOwnProperty( property )
					) {
						if(
							isEqual( prevValids[ property ], valids ) &&
							isEqual( prevRemoves[ property ], removes )
						) {
							continue;
						}
					}

					// Set saves and changes to compare later.
					const saves = cloneDeep( traverseGet( [ viewport, 'style', property ], this.state.saves, {} ) );
					const changes = cloneDeep( traverseGet( [ viewport, 'style', property ], this.state.changes, {} ) );
					const collapsedSaves = cloneDeep( traverseGet( [ property ], collapsedSavesSet, {} ) );

					let combined = {};

					if( isEmpty( valids ) && ! isEmpty( removes ) ) {
						combined = removes;
					} else if( ( ! isEmpty( valids ) && isEmpty( removes ) ) || isEqual( valids, removes ) ) {
						combined = valids;
					} else if( ! isEqual( valids, removes ) ) {
						combined = getMergedAttributes( valids, removes );
					} else {
						combined = valids;
					}

					// Set combined simulation object.
					const combinedSimulation = {
						[ property ]: combined,
					}

					// Set valids simulation object.
					const validsSimulation = {
						[ property ]: valids,
					}

					// Set saves simulation object.
					const savesSimulation = {
						[ property ]: saves,
					}

					// Set saves simulation object.
					const collapsedSavesSimulation = {
						[ property ]: collapsedSaves,
					}

					// Set removes simulation object.
					const removesSimulation = {
						[ property ]: removes,
					}

					// Iterate over renderers to store its rules.
					for( const [ priorityDirty, renderer ] of renderers ) {

						// Cleanup priorityDirty.
						const priority = parseInt( priorityDirty );

						// Set combined results of custom renderer callback and get its parts.
						const combinedCSS = Object.keys( combined ).length ? renderer.callback( combinedSimulation, options, this.state.isSaving ) : '';
						const combinedCSSCollectionSet = '' !== combinedCSS ? this.getCSSCollectionSet( combinedCSS ) : [];

						// Set valids results of custom renderer callback and get its parts.
						const validsCSS = Object.keys( valids ).length ? renderer.callback( validsSimulation, options, this.state.isSaving ) : '';
						const validsCSSCollectionSet = '' !== validsCSS ? this.getCSSCollectionSet( validsCSS ) : [];

						// Set saves results of custom renderer callback and get its parts.
						const savesCSS = Object.keys( saves ).length ? renderer.callback( savesSimulation, options, this.state.isSaving ) : '';
						const savesCSSCollectionSet = '' !== savesCSS ? this.getCSSCollectionSet( savesCSS ) : [];

						// Set saves results of custom renderer callback and get its parts.
						const collapsedSavesCSS = Object.keys( saves ).length ? renderer.callback( collapsedSavesSimulation, options, this.state.isSaving ) : '';
						const collapsedSavesCSSCollectionSet = '' !== collapsedSavesCSS ? this.getCSSCollectionSet( collapsedSavesCSS ) : [];

						// Set removes results of custom renderer callback and get its parts.
						const removesCSS = Object.keys( removes ).length ? renderer.callback( removesSimulation, options, this.state.isSaving ) : '';
						const removesCSSCollectionSet = '' !== removesCSS ? this.getCSSCollectionSet( removesCSS ) : [];

						// Iterate over collectionSet to generate ruleSets
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

							// Set valid css.
							const css = selector + '{' + declarations + '}';
							const properties = this.generateProperties( selector + '{' + combinedDeclarations + '}' );

							// Set saves properties.
							const validsDeclarations = Object.keys( validsCSSCollectionSet ).length ? this.getDeclarations( selector, validsCSSCollectionSet ) : '';
							const validsProperties = '' !== validsDeclarations ? this.generateProperties( selector + '{' + validsDeclarations + ' }' ) : {};

							// Set saves properties.
							const savesDeclarations = Object.keys( savesCSSCollectionSet ).length ? this.getDeclarations( selector, savesCSSCollectionSet ) : '';
							const savesProperties = '' !== savesDeclarations ? this.generateProperties( selector + '{' + savesDeclarations + ' }' ) : {};
							const hasSaves = 0 < Object.keys( savesProperties ).length ? true : false;

							// Set saves properties.
							const collapsedSavesDeclarations = Object.keys( collapsedSavesCSSCollectionSet ).length ? this.getDeclarations( selector, collapsedSavesCSSCollectionSet ) : '';
							const collapsedSavesProperties = '' !== collapsedSavesDeclarations ? this.generateProperties( selector + '{' + collapsedSavesDeclarations + ' }' ) : {};

							// Set removes properties.
							const removesDeclarations = Object.keys( removesCSSCollectionSet ).length ? this.getDeclarations( selector, removesCSSCollectionSet ) : '';
							const removesProperties = '' !== removesDeclarations ? this.generateProperties( selector + '{' + removesDeclarations + ' }' ) : {};
							const hasRemoves = 0 < Object.keys( removesProperties ).length ? true : false;

							// Set changes properties by detecting changes between saves and valids.
							const changesProperties = findObjectDifferences( findObjectChanges( validsProperties, collapsedSavesProperties ), removesProperties );
							const hasChanges = 0 < Object.keys( changesProperties ).length ? true : false;

							// Set rule.
							ruleSet.push( {
								type: renderer.type,
								blockName: this.blockName,
								property,
								viewport,
								priority,
								selector,
								selectors: {
									panel: renderer.selectors.hasOwnProperty( 'panel' ) ? renderer.selectors.panel : 'missing',
									label: renderer.selectors.hasOwnProperty( 'label' ) ? renderer.selectors.label : 'missing',
								},
								declarations,
								css,
								style: {
									[ property ]: valids,
								},
								properties,
								saves,
								savesProperties,
								hasSaves,
								changes,
								changesProperties: changesProperties,
								hasChanges,
								removes,
								removesProperties,
								hasRemoves,
							} );
						}
					}

					// Prepare prev states for later iterations.
					prevValids[ property ] = valids;
					prevRemoves[ property ] = removes;
				}

				// Prepare prev state for next iteration.
				prevStyle = style;
			}
		} );

		// Debug ruleSet.
		// console.log( 'ruleSet', ruleSet );

		return ruleSet;
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
	 * Set method to return properties from ruleSet.
	 */
	getRuleSetProperties() {
		if( null === this.properties ) {
			this.properties = this.createRuleSetProperties();
		}

		return this.properties;
	}


	/**
	 * Set method to return properties from ruleSet.
	 */
	createRuleSetProperties() {

		// Set properties default.
		const properties = new Set<string>();

		// Map all properties.
		this.ruleSet.forEach( rule => {
			properties.add( rule.property );
		} );

		// Return unique properties.
		return Array.from( properties );
	}


	/**
	 * Set method to return viewports from ruleSet.
	 */
	getRuleSetViewports() {
		if( null === this.viewports ) {
			this.viewports = this.createRuleSetViewports();
		}

		return this.viewports;
	}


	/**
	 * Set method to return viewports from ruleSet.
	 */
	createRuleSetViewports() {

		// Set viewports default.
		const viewports = new Set<number>();

		// Map all viewports.
		this.ruleSet.forEach( rule => {
			viewports.add( rule.viewport );
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
		if( ! Object.entries( this.ruleSet ).length ) {
			return [];
		}

		// Set css defaults
		const cssViewportSet : CSSViewportSet = [];

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
	 * Set method to collapse a viewportStyleSet.
	 */
	collapseViewportStyleSet( viewportStyleSet : ViewportStyleSet, tillViewport : number ) {
		const stylesToMerge: Styles[] = [];

		for( const [ dirtyViewport, viewportStyle ] of Object.entries( viewportStyleSet ) ) {
			const viewport = parseInt( dirtyViewport );

			if( tillViewport >= viewport ) {
				stylesToMerge.push( viewportStyle.style );
			}
		}

		return getMergedAttributes( ... stylesToMerge );
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
	 * Set method to generate spectrum set.
	 */
	generateSpectrumSet() {

		// Set min and minMax defaults.
		const min = {};
		const minMax = {};
		const prevSet = {};

		// Set prev default.
		const prevDefault = {
			property: '',
			viewport: 0,
			priority: 0,
			selector: '',
			css: '',
			style: {},
			properties: {},
		} as Rule;

		// Iterate over properties to split min from min-max queries.
		for( let i = 0; i < this.properties.length; i++ ) {
			const key = this.properties[ i ];

			// Iterate over ruleSet to compare viewport settings.
			this.ruleSet.forEach( ( rule : Rule ) => {
				if( key !== rule.property ) {
					return true;
				}

				// Set actual prev if already set.
				let prev = {} as Rule;
				if( prevSet.hasOwnProperty( rule.selector ) ) {
					prev = prevSet[ rule.selector ];
				} else {
					prev = prevDefault;
				}

				// Debug prev.
				// console.log( 'prev', prev, rule );

				// Check if there is a difference between last and actual css.
				if ( isEqual( prev.properties, rule.properties ) ) {
					return true;
				}

				// Check if we need to shift the spectrum from min to minMax.
				if ( '' !== prev.css && '' === rule.css ) {
					delete min[ prev.viewport ][ key ];

					// Set viewport if not already did.
					if ( ! minMax.hasOwnProperty( prev.viewport ) ) {
						minMax[ prev.viewport ] = {};
					}

					// Set key if not already did.
					if ( ! minMax[ prev.viewport ].hasOwnProperty( key ) ) {
						minMax[ prev.viewport ][ key ] = [];
					}

					// Set min and max if prev viewport was > 0.
					if( prev.viewport > 0 ) {

						// Shift spectrum to minmax.
						minMax[ prev.viewport ][ key ].push( {
							... prev,
							from: prev.viewport,
							to: rule.viewport - 1,
							media: 'min-width:' + prev.viewport + 'px) and (max-width:' + ( rule.viewport - 1 ) + 'px',
						} ) as Spectrum;
					} else {

						// Shift spectrum to minmax.
						minMax[ prev.viewport ][ key ].push( {
							... prev,
							from: prev.viewport,
							to: rule.viewport - 1,
							media: 'max-width:' + ( rule.viewport - 1 ) + 'px',
						} ) as Spectrum;
					}

				// Check if we need to add the spectrum to min.
				} else if ( '' !== rule.css && ! isEqual( prev.properties, rule.properties ) ) {

					// Set viewport if not already did.
					if ( ! min.hasOwnProperty( rule.viewport ) ) {
						min[ rule.viewport ] = {};
					}

					// Set key if not already did.
					if ( ! min[ rule.viewport ].hasOwnProperty( key ) ) {
						min[ rule.viewport ][ key ] = [];
					}

					min[ rule.viewport ][ key ].push( {
						... rule,
						from: rule.viewport,
						to: -1,
						media: rule.viewport > 0 ? 'min-width:' + rule.viewport + 'px' : '',
					} ) as Spectrum;
				}

				// Prepare prev state for next iteration.
				prevSet[ rule.selector ] = rule;
			} );
		}

		// Debug min and minMax.
		// console.log( 'min', min, 'minMax', minMax );

		// Set spectrumSet default.
		const spectrumSet = [] as SpectrumSet;

		// Iterate over viewports to sort the right order.
		for( let i = 0; i < this.viewports.length; i++ ) {
			const viewport = this.viewports[ i ];

			// Build sorted min spectrumSet parts.
			if( min.hasOwnProperty( viewport ) ) {
				const unsorted = [] as SpectrumSet;

				// Collect unsorted spectrums.
				for( const [ key ] of Object.entries( min[ viewport ] ) ) {
					min[ viewport ][ key ].forEach( ( spectrum ) => {
						unsorted.push( spectrum );
					} );
				}

				// Sort the unsorted.
				unsorted.sort( ( a, b ) => a.priority - b.priority );
				unsorted.forEach( ( spectrum ) => {
					spectrumSet.push( spectrum );
				} );
			}

			// Build sorted minMax spectrumSet parts.
			if( minMax.hasOwnProperty( viewport ) ) {
				const unsorted = [] as SpectrumSet;

				// Collect unsorted spectrums.
				for( const [ key ] of Object.entries( minMax[ viewport ] ) ) {
					minMax[ viewport ][ key ].forEach( ( spectrum ) => {
						unsorted.push( spectrum );
					} );
				}

				// Sort the unsorted.
				unsorted.sort( ( a, b ) => a.priority - b.priority );
				unsorted.forEach( ( spectrum ) => {
					spectrumSet.push( spectrum );
				} );
			}
		}

		// Debug spectrumSet.
		// console.log( 'spectrumSet', spectrumSet );

		return spectrumSet;
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

export type { RuleSet, Rule, SpectrumSet, Spectrum };