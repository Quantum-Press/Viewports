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
} from '../store';
import { getMergedAttributes, traverseGet } from '../utils';
import { findObjectChanges } from './utils';

const { isEqual, cloneDeep } = window[ 'lodash' ];
const {
	styleEngine: {
		compileCSS,
	}
} = window[ 'wp' ];

/**
 * Set class to handle style generation by block attributes.
 *
 * @since 0.2.5
 */
export class Generator {
	clientId: string;
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
	 * @param state
	 *
	 * @since 0.2.5
	 */
	constructor( clientId : string, state : SpectrumState ) {

		// Set properties.
		this.clientId = clientId;
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
	 *
	 * @since 0.2.5
	 */
	getRuleSet() {
		if( null === this.ruleSet ) {
			this.ruleSet = this.generateRuleSet();
		}

		return this.ruleSet;
	}


	/**
	 * Set method to generate ruleSet.
	 *
	 * @since 0.2.5
	 */
	generateRuleSet() {

		// Set compiler options.
		const options = {
			selector: this.selector
		};

		// Set block valids from store to build rules from.
		const valids = cloneDeep( this.state.valids ) as ViewportStyle;

		// Set initial states.
		const ruleSet = [] as RuleSet;
		let prevStyle = {} as Styles;

		// Iterate over block valids.
		Object.entries( valids ).forEach( ( [ viewportDirty, { style } ] ) => {

			// Cleanup viewport.
			const viewport = parseInt( viewportDirty )

			// Check if there are styles.
			if( style ) {

				// Ignore if the style equals the previous style attributes.
				if( isEqual( prevStyle, style ) ) {
					return true;
				}

				// Iterate over properties to render settings seperately.
				for( const [ property ] of Object.entries( style ) ) {

					// Set state attributes
					const saves = cloneDeep( traverseGet( [ viewport, 'style', property ].join( '.' ), this.state.saves ) ) || {};

					// Set state attribute changes.
					const changes = cloneDeep( traverseGet( [ viewport, 'style', property ].join( '.' ), this.state.changes ) ) || {};
					const removes = cloneDeep( traverseGet( [ viewport, 'style', property ].join( '.' ), this.state.removes ) ) || {};

					// Set valids from saves + changes.
					const valids = getMergedAttributes( saves, changes );

					// Set renderers.
					const rendererSet = traverseGet( property, this.state.rendererPropertySet ) as RendererSet;
					const renderers = rendererSet ? Object.entries( rendererSet ) : [];

					// Iterate renderers to check its css outputs for any result to store.
					if( renderers.length ) {

						// Set valids simulation object.
						const validsSimulation = {
							... style,
							[ property ]: valids,
						}

						// Set saves simulation object.
						const savesSimulation = {
							... style,
							[ property ]: saves,
						}

						// Set changes simulation object.
						const changesSimulation = {
							... style,
							[ property ]: getMergedAttributes( saves, changes ),
						}

						// Set removes simulation object.
						const removesSimulation = {
							... style,
							[ property ]: removes, // #TODO weakspot see changesSimulation above.
						}

						// Iterate over renderers to store its rules.
						for( const [ priorityDirty, renderer ] of renderers ) {

							// Cleanup priorityDirty.
							const priority = parseInt( priorityDirty );

							// Set valids results of custom renderer callback and get its parts.
							const validsCSS = Object.keys( valids ).length ? renderer.callback( validsSimulation, options, this.state.isSaving ) : '';
							const validsCSSCollectionSet = '' !== validsCSS ? this.getCSSCollectionSet( validsCSS ) : [];

							// Set saves results of custom renderer callback and get its parts.
							const savesCSS = Object.keys( saves ).length ? renderer.callback( savesSimulation, options, this.state.isSaving ) : '';
							const savesCSSCollectionSet = '' !== savesCSS ? this.getCSSCollectionSet( savesCSS ) : [];

							// Set changes results of custom renderer callback and get its parts.
							const changesCSS = Object.keys( changes ).length ? renderer.callback( changesSimulation, options, this.state.isSaving ) : '';
							const changesCSSCollectionSet = '' !== changesCSS ? this.getCSSCollectionSet( changesCSS ) : [];

							// Set removes results of custom renderer callback and get its parts.
							const removesCSS = Object.keys( removes ).length ? renderer.callback( removesSimulation, options, this.state.isSaving ) : '';
							const removesCSSCollectionSet = '' !== removesCSS ? this.getCSSCollectionSet( removesCSS ) : [];

							// Iterate over collectionSet to generate ruleSets
							for( let index = 0; index < validsCSSCollectionSet.length; index++ ) {
								const {
									selector,
									declarations,
								} = validsCSSCollectionSet[ index ];

								// Set valid css.
								const css = selector + '{' + declarations + '}';
								const properties = this.generateProperties( css );

								// Set saves properties.
								const savesDeclarations = Object.keys( savesCSSCollectionSet ).length ? this.getDeclarations( selector, savesCSSCollectionSet ) : '';
								const savesProperties = '' !== savesDeclarations ? this.generateProperties( selector + '{' + savesDeclarations + ' }' ) : {};

								// Set changes properties.
								const changesDeclarations = Object.keys( changesCSSCollectionSet ).length ? this.getDeclarations( selector, changesCSSCollectionSet ) : '';
								const changesProperties = '' !== changesDeclarations ? this.generateProperties( selector + '{' + changesDeclarations + ' }' ) : {};

								// Set removes properties.
								const removesDeclarations = Object.keys( removesCSSCollectionSet ).length ? this.getDeclarations( selector, removesCSSCollectionSet ) : '';
								const removesProperties = '' !== removesDeclarations ? this.generateProperties( selector + '{' + removesDeclarations + ' }' ) : {};

								// Set rule.
								ruleSet.push( {
									type: 'custom',
									property,
									viewport,
									priority,
									selector: selector,
									selectorPanel: renderer.selectorPanel,
									declarations,
									css,
									style: {
										[ property ]: valids,
									},
									properties,
									saves,
									savesProperties,
									changes,
									changesProperties: findObjectChanges( changesProperties, savesProperties ),
									removes,
									removesProperties,
								} );
							}
						}

					} else {

						// Set valids simulation object.
						const validsSimulation = {
							[ property ]: valids,
						}

						// Set saves simulation object.
						const savesSimulation = {
							[ property ]: saves,
						}

						// Set changes simulation object.
						const changesSimulation = {
							[ property ]: changes,
						}

						// Set removes simulation object.
						const removesSimulation = {
							[ property ]: removes,
						}

						// Set valids results of custom renderer callback and get its parts.
						const validsCSS = compileCSS( validsSimulation, options );
						const validsCSSCollectionSet = '' !== validsCSS ? this.getCSSCollectionSet( validsCSS ) : [];

						// Set saves results of custom renderer callback and get its parts.
						const savesCSS = Object.keys( savesSimulation ).length ? compileCSS( savesSimulation, options ) : '';
						const savesCSSCollectionSet = '' !== savesCSS ? this.getCSSCollectionSet( savesCSS ) : [];

						// Set changes results of custom renderer callback and get its parts.
						const changesCSS = Object.keys( savesSimulation ).length ? compileCSS( changesSimulation, options ) : '';
						const changesCSSCollectionSet = '' !== changesCSS ? this.getCSSCollectionSet( changesCSS ) : [];

						// Set removes results of custom renderer callback and get its parts.
						const removesCSS = Object.keys( savesSimulation ).length ? compileCSS( removesSimulation, options ) : '';
						const removesCSSCollectionSet = '' !== removesCSS ? this.getCSSCollectionSet( removesCSS ) : [];

						// Iterate over collectionSet to generate ruleSets
						for( let index = 0; index < validsCSSCollectionSet.length; index++ ) {
							const {
								selector,
								declarations,
							} = validsCSSCollectionSet[ index ];

							// Set valid css.
							const css = selector + '{' + declarations + '}'.replace( /\s/g, '' );
							const properties = this.generateProperties( css );

							// Set saves properties.
							const savesDeclarations = Object.keys( savesCSSCollectionSet ).length ? this.getDeclarations( selector, savesCSSCollectionSet ) : '';
							const savesProperties = '' !== savesDeclarations ? this.generateProperties( selector + '{' + savesDeclarations + ' }' ) : {};

							// Set changes properties.
							const changesDeclarations = Object.keys( changesCSSCollectionSet ).length ? this.getDeclarations( selector, changesCSSCollectionSet ) : '';
							const changesProperties = '' !== changesDeclarations ? this.generateProperties( selector + '{' + changesDeclarations + ' }' ) : {};

							// Set removes properties.
							const removesDeclarations = Object.keys( removesCSSCollectionSet ).length ? this.getDeclarations( selector, removesCSSCollectionSet ) : '';
							const removesProperties = '' !== removesDeclarations ? this.generateProperties( selector + '{' + removesDeclarations + ' }' ) : {};

							// Set default rule.
							ruleSet.push( {
								type: 'wp',
								property,
								viewport,
								priority: 5,
								selector: this.selector,
								selectorPanel: this.getSelectorPanel( property ),
								declarations: declarations,
								css,
								style: {
									[ property ]: valids,
								},
								properties,
								saves,
								savesProperties,
								changes,
								changesProperties,
								removes,
								removesProperties,
							} );
						}
					}
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
	 *
	 * @since 0.2.5
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
	 *
	 * @since 0.2.5
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
	 * Set method to return wp native selector panel by property.
	 *
	 * @since 0.2.5
	 */
	getSelectorPanel( property ) {
		let selector = '';

		switch ( property ) {
			case 'dimensions':
				selector = '.dimensions-block-support-panel .components-tools-panel-item.last';
				break;

			case 'spacing':
				selector = '.dimensions-block-support-panel .components-tools-panel-item.tools-panel-item-spacing';
				break;

			case 'border':
				selector = '.border-block-support-panel';
				break;
		}

		return selector;
	}


	/**
	 * Set method to generate properties from css string.
	 *
	 * @since 0.2.5
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
	 *
	 * @since 0.2.5
	 */
	getRuleSetProperties() {
		if( null === this.properties ) {
			this.properties = this.createRuleSetProperties();
		}

		return this.properties;
	}


	/**
	 * Set method to return properties from ruleSet.
	 *
	 * @since 0.2.5
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
	 *
	 * @since 0.2.5
	 */
	getRuleSetViewports() {
		if( null === this.viewports ) {
			this.viewports = this.createRuleSetViewports();
		}

		return this.viewports;
	}


	/**
	 * Set method to return viewports from ruleSet.
	 *
	 * @since 0.2.5
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
	 *
	 * @since 0.2.5
	 */
	getCSSViewportSet() {
		if( null === this.css ) {
			this.css = this.generateCSSViewportSet();
		}

		return this.css;
	}


	/**
	 * Set method to generate css.
	 *
	 * @since 0.2.5
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
	 * Set method to return spectrum set.
	 *
	 * @since 0.2.5
	 */
	getSpectrumSet() {
		if( null === this.spectrumSet ) {
			this.spectrumSet = this.generateSpectrumSet();
		}

		return this.spectrumSet;
	}


	/**
	 * Set method to generate spectrum set.
	 *
	 * @since 0.2.5
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
				if ( isEqual( prev.css, rule.css ) ) {
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
				} else if ( '' !== rule.css && ! isEqual( prev.css, rule.css ) ) {

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
	 *
	 * @since 0.2.5
	 */
	getInlineStyle() {
		if( null === this.inlineStyle ) {
			this.inlineStyle = this.generateInlineStyle();
		}

		return this.inlineStyle;
	}


	/**
	 * Set method to generate inlineStyle.
	 *
	 * @since 0.2.5
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