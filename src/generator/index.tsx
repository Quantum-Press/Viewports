import { STORE_NAME } from '../store/constants';
import type { ViewportStyleSet, Renderer, Styles } from '../store';
import type { RuleSet, Rule, SpectrumSet, Spectrum } from './types';

const { isEqual } = window[ 'lodash' ];
const {
	data: {
		select,
	},
	styleEngine: {
		compileCSS,
	}
} = window[ 'wp' ];

/**
 * Set class to handle style generation by block attributes.
 *
 * @since 0.2.3
 */
export class Generator {
	clientId: string;
	selector: string;
	isSaving: boolean;
	ruleSet: RuleSet;
	css: string | null;
	properties: Array<any>;
	viewports: Array<number>;

	/**
	 * Set constructor to build object.
	 *
	 * @param style
	 * @param selector
	 * @param isSaving
	 *
	 * @since 0.2.3
	 */
	constructor( block, selector, isSaving = false ) {

		// Deconstruct object.
		const {
			attributes: {
				tempId,
			}
		} = block;

		// Set properties.
		this.clientId = tempId;
		this.selector = selector;
		this.isSaving = isSaving;

		// Set property defaults.
		this.ruleSet = null;
		this.css = null;
		this.properties = null;
		this.viewports = null;

		// Fill rules initial as base for further operations.
		this.ruleSet = this.getRuleSet();
		this.properties = this.getRuleSetProperties();
		this.viewports = this.getRuleSetViewports();
	}


	/**
	 * Set method to return rules.
	 *
	 * @since 0.2.3
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
	 * @since 0.2.3
	 */
	generateRuleSet() {

		// Set store.
		const store = select( STORE_NAME );

		// Set compiler options.
		const options = {
			selector: this.selector
		};

		// Set block valids from store to build rules from.
		const valids = store.getBlockValids( this.clientId ) as ViewportStyleSet;

		// Set initial states.
		const ruleSet = [] as RuleSet;
		let prevStyle = {} as Styles;

		// Iterate over block valids.
		Object.entries( valids ).forEach( ( [ viewportString, { style } ] ) => {

			// Cleanup viewport.
			const viewport = parseInt( viewportString )

			// Check if there are styles.
			if( style ) {

				// Ignore if the style equals the previous style attributes.
				if( isEqual( prevStyle, style ) ) {
					return true;
				}

				// Iterate over properties to render settings seperately.
				for( const [ property ] of Object.entries( style ) ) {

					// Set rule setting and simulation.
					const settings = style[ property ];

					// Set simulation object.
					const simulate = {
						[ property ]: settings,
					}

					// Set custom renderer.
					const renderer = store.getRenderer( property ) as Renderer;

					// Iterate renderers to check its css outputs for any result to store.
					if( Object.entries( renderer ).length ) {
						for( const [ priorityDirty, styleRenderer ] of Object.entries( renderer ) ) {

							// Cleanup priorityDirty.
							const priority = parseInt( priorityDirty );

							// Set result of custom renderer callback.
							const css = styleRenderer( style, options, this.isSaving );

							// Debug custom simulation.
							// console.log( 'simulate', style, simulate, css );

							// Set split css by selector.
							const cssParts = css.split( this.selector );
							cssParts.shift();

							// Set each css part with its selector.
							cssParts.forEach( cssPart => {

								// Set each part with its own selector.
								const partCSS = this.selector + cssPart;

								// Set selector by combining base selector with nested selectors.
								const selectorParts = partCSS.split( '{', );

								// Iterate over each selector part.
								for( let i = 0; i < selectorParts.length - 1; i++ ) {

									// Set selector and declarations.
									const selector = selectorParts[ i ].trim();
									const declarations = selectorParts[ i + 1 ].split( '}' )[ 0 ].trim();

									// Set rule.
									ruleSet.push( {
										property,
										viewport,
										priority,
										selector: selector,
										css: selector + '{' + declarations + '}',
										style: simulate,
										properties: this.generateProperties( partCSS ),
									} );
								}
							} );
						}

					} else {

						// Set result of wp renderer callback.
						const css = compileCSS( simulate, options ) as string;

						// Debug wp simulation.
						// console.log( 'simulate', simulate, css );

						// Set default rule.
						ruleSet.push( {
							property,
							viewport,
							priority: 5,
							selector: this.selector,
							css: css.replace( /\s/g, '' ),
							style: simulate,
							properties: this.generateProperties( css ),
						} );
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
	 * Set method to generate properties from css string.
	 *
	 * @since 0.2.3
	 */
	generateProperties( css ) {

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
				const property = parts.shift();
				const value = parts.join( ':' );

				properties[ property ] = value;
			});
		}

		return properties;
	}


	/**
	 * Set method to return properties from ruleSet.
	 *
	 * @since 0.2.3
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
	 * @since 0.2.3
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
	 * @since 0.2.3
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
	 * @since 0.2.3
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
	 * @since 0.2.3
	 */
	getCSS() {
		if( null === this.css ) {
			this.css = this.generateCSS();
		}

		return this.css;
	}


	/**
	 * Set method to generate css.
	 *
	 * @since 0.2.3
	 */
	generateCSS() {

		// Check if we get some rules.
		if( ! Object.entries( this.ruleSet ).length ) {
			return '';
		}

		// Set css defaults
		const css : string[] = [];

		// Set unfiltered spectrumSet.
		const unfiltered = this.getSpectrumSet();

		// Set viewport.
		const viewport = select( STORE_NAME ).getViewport();

		// Set count iterations.
		const spectrumSet = [] as SpectrumSet;

		// Reduce for actual viewport.
		for ( let index = 0; index < unfiltered.length; index++ ) {
			const spectrum = unfiltered[ index ];

			if( spectrum.from <= viewport ) {
				spectrumSet.push( spectrum );
			}
		}

		// Iterate over spectrums to collect css.
		for( let i = 0; i < spectrumSet.length; i++ ) {
			const spectrum = spectrumSet[ i ];
			const importantCSS = spectrum.css.split( ';' ).join( '!important;' );

			if( spectrum.media === '' ) {
				css.push( importantCSS );
			} else {
				css.push( '@media (' + spectrum.media + '){' + importantCSS + '}' );
			}
		}

		// Debug css.
		// console.log( 'css', css );

		// Return joined css.
		return css.join( '' );
	}


	/**
	 * Set method to return spectrum set.
	 *
	 * @since 0.2.3
	 */
	getSpectrumSet() {

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

					// Shift spectrum to minmax.
					minMax[ prev.viewport ][ key ].push( {
						... prev,
						from: prev.viewport,
						to: rule.viewport - 1,
						media: 'min-width:' + prev.viewport + 'px) and (max-width:' + ( rule.viewport - 1 ) + 'px',
					} ) as Spectrum;

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
}

export default Generator;