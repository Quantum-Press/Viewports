import type { Attributes } from "../utils/types";
import type { Renderer, RendererList } from "../store/types";
import { STORE_NAME } from '../store/constants';

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
 * Set function to compile media queries.
 *
 * @param {string} clientId
 * @param {object} viewports
 * @param {boolean} isSaving
 *
 * @since 0.1.0
 *
 * @return {string} css
 */
export const compileMediaQueries = ( clientId : string, viewports : Attributes, isSaving : boolean = false ) : string => {

	// Check if we get some rules.
	const rules = compileMediaQueryRules( clientId, viewports, isSaving );
	if( ! Object.entries( rules ).length ) {
		return '';
	}

	// Build properties container.
	let properties = [];
	for( const [ viewport, styles ] of Object.entries( rules ) ) {
		properties = properties.concat( Object.keys( styles ) );
	}

	// Filter array unique properties.
	properties = properties.filter( ( value, index, array ) => array.indexOf( value ) === index );

	// Build query container.
	const min = {};
	const minMax = {};

	// Iterate over properties to split min from min-max queries.
	for( let i = 0; i < properties.length; i++ ) {
		const key = properties[ i ];

		let prevViewport = 0;
		let prevRuleset = [];
		let prevRule = '';

		for( const [ viewportDirty, styles ] of Object.entries( rules ) ) {
			if( ! styles.hasOwnProperty( key ) ) {
				continue;
			}

			const viewport = parseInt( viewportDirty );
			const ruleset = styles[ key ];
			const rule = ruleset.map( ( { rule } ) => rule ).join( '' );

			// Check the actual rule
			if ( isEqual( prevRule, rule ) ) {
				continue;
			}

			if ( '' !== prevRule && '' === rule ) {
				delete min[ prevViewport ][ key ];

				if ( ! minMax.hasOwnProperty( prevViewport ) ) {
					minMax[ prevViewport ] = {};
				}

				minMax[ prevViewport ][ key ] = {
					from: prevViewport,
					to: viewport - 1,
					ruleset: prevRuleset,
				};
			} else if ( '' !== rule && ! isEqual( prevRule, rule ) ) {
				if ( ! min.hasOwnProperty( viewport ) ) {
					min[ viewport ] = {};
				}
				min[ viewport ][ key ] = ruleset;
			}

			prevViewport = viewport;
			prevRuleset = ruleset;
			prevRule = rule;
		}
	}

	// Setup
	const viewportSet = Object.keys( rules );
	const css = [];

	// Iterate over viewports to use the right order.
	for( let i = 0; i < viewportSet.length; i++ ) {
		const viewport = parseInt( viewportSet[ i ] );

		if( min.hasOwnProperty( viewport ) ) {
			const rulesets = Object.entries( min[ viewport ] ).map( ( entry : Array<any> ) => {
				return [ ... entry[1] ].shift();
			} ) as any;
			rulesets.sort( ( a, b ) => a.priority - b.priority );

			if ( 0 < viewport ) {
				css.push(
					'@media (min-width:' + viewport + 'px){' +
						rulesets.map( ( { rule } ) => rule ).join( '' ) +
					'}'
				);
			} else {
				css.push(
					rulesets.map( ( { rule } ) => rule ).join( '' )
				);
			}
		}

		if( minMax.hasOwnProperty( viewport ) ) {
			for( const [ key, entry ] of Object.entries( minMax[ viewport ] ) ) {
				const from = entry['from'];
				const to = entry['to'];
				const ruleset = entry['ruleset'];

				if ( 0 < from ) {
					css.push(
						'@media (min-width:' + from + 'px) and (max-width:' + to + 'px){' +
							ruleset.map( ( { rule } ) => rule ).join( '' ) +
						'}'
					);
				} else {
					css.push(
						'@media (max-width:' + to + 'px){' +
							ruleset.map( ( { rule } ) => rule ).join( '' ) +
						'}'
					);
				}
			}
		}
	}

	return css.join( '' );
}


/**
 * Set function to compile media query attributes by saves and defaults.
 *
 * @param {object} saves
 * @param {object} defaults
 *
 * @since 0.1.0
 *
 * @return {string} css
 */
export const compileMediaQueryAttributes = ( saves : Attributes, defaults : Attributes ) : Attributes => {

	// Set custom renderer.
	const rendererMap = select( STORE_NAME ).getRenderers() as RendererList;

	// Build CSS compiler options.
	const selector = '%';
	const options = { selector };

	// Build compiled container.
	const compiled = {};

	// Check defaults for styles.
	if ( defaults.hasOwnProperty( 'style' ) ) {

		// Build default css via wp.styleEngine on viewport 0.
		compiled[ 0 ] = {
			default: [
				{
					priority: 5,
					css: compileCSS( defaults.style ),
				}
			],
		}

		// Iterate over default style settings to add results of custom renderer functions.
		for( const [ property ] of Object.entries( defaults.style ) ) {
			if( rendererMap.hasOwnProperty( property ) ) {
				for( const [ priorityDirty, styleRenderer ] of Object.entries( rendererMap[ property ] ) ) {
					const priority = parseInt( priorityDirty );

					// Build structure if not exist.
					if( ! compiled[ 0 ].hasOwnProperty( property ) ) {
						compiled[ 0 ][ property ] = [];
					}

					// Set property based css by priority.
					compiled[ 0 ][ property ].push({
						priority,
						css: styleRenderer( defaults.style, options, true ),
					});

					// After push we resort all callback results by its priority.
					compiled[ 0 ][ property ].sort( ( a, b ) => a.priority - b.priority );
				}
			}
		}
	}

	// Iterate over viewport style settings to add results of custom renderer functions.
	if( 0 < Object.keys( saves ).length ) {
		let prevDefaults = '';

		for( const [ viewportDirty, { style } ] of Object.entries( saves ) ) {
			const viewport = parseInt( viewportDirty );

			// Build default css via wp.styleEngine for every viewport
			// But only if it differs from the previous default.
			// This is because we cannot differentiate the result
			// of rendering specific properties inside wp.styleEngine
			let defaultCSS = compileCSS( style );
			if( prevDefaults !== defaultCSS ) {
				if ( '' !== defaultCSS ) {
					compiled[ viewport ] = {
						default: [
							{
								priority: 5,
								css: defaultCSS,
							}
						],
					}
				}
				prevDefaults = defaultCSS;
			}

			for( const [ property, styles ] of Object.entries( style ) ) {
				if( rendererMap.hasOwnProperty( property ) ) {
					for( const [ priorityDirty, styleRenderer ] of Object.entries( rendererMap[ property ] ) ) {
						const priority = priorityDirty;

						// Build structure if not exist.
						if( ! compiled.hasOwnProperty( viewport ) ) {
							compiled[ viewport ] = {};
						}
						if( ! compiled[ viewport ].hasOwnProperty( property ) ) {
							compiled[ viewport ][ property ] = [];
						}

						// Set property based css by priority.
						compiled[ viewport ][ property ].push({
							priority,
							css: styleRenderer( style, options, true ),
						});
					}
				}
			}
		}
	}

	return compiled;
};


/**
 * Set function to compile media query rules.
 *
 * @param {string} clientId
 * @param {object} viewports
 * @param {boolean} isSaving
 *
 * @since 0.1.0
 *
 * @return {object} rules
 */
export const compileMediaQueryRules = ( clientId : string, viewports : Attributes, isSaving : boolean = false ) : Attributes => {
	const store = select( STORE_NAME );

	// Build CSS compiler options.
	const selector = '#block-' + clientId;
	const options = { selector };

	// Build states.
	const rules = {};
	let prevStyle = {};

	// Iterate over the block's viewports.
	for( const [ viewportDirty, { style } ] of Object.entries( viewports ) ) {
		const viewport = parseInt( viewportDirty )

		if( style ) {

			// Ignore if the style equals the previous style attributes.
			if( isEqual( prevStyle, style ) ) {
				continue;
			}

			// Set rules from wp.styleEngine based style settings.
			rules[ viewport ] = {
				default: [
					{
						priority: 5,
						rule: compileCSS( style, options ),
					}
				],
			};

			// Check whether we need a custom renderer.
			if( store.needsRenderer( style ) ) {
				for( const [ property ] of Object.entries( style ) ) {

					// Get a reference to a custom renderer for the current
					// property or continue.
					const renderer = store.getRenderer( property ) as Renderer;
					if( Object.entries( renderer ).length ) {
						for( const [ priority, styleRenderer ] of Object.entries( renderer ) ) {

							// Set result of custom renderer callback.
							const rule = styleRenderer( style, options, isSaving );

							// Set rules from custom renderer, even if they are empty.
							// We can use empty rules to indicate min-max queries.
							if ( ! rules[ viewport ].hasOwnProperty( property ) ) {
								rules[ viewport ][ property ] = [];
							}

							rules[ viewport ][ property ].push( {
								priority: parseInt( priority ),
								rule,
							});
						}
					}
				}
			}
		}

		prevStyle = style;
	}

	// Return the compiled rules.
	return rules;
};