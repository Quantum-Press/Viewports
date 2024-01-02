const { isObject, isArray, isEmpty } = window[ 'lodash' ];

interface Style {
	baseKeys : Array<any>;
	origKeys : Array<any>;
	styleKey : string;
	styleValue : any;
	onClickFunction : Function;
}


/**
 * Set function to render a single style entry recursively.
 *
 * @param {object} style
 *
 * @since 0.1.0
 *
 * @return {object} component
 */
const StyleObject = ( {
	baseKeys,
	origKeys,
	styleKey,
	styleValue,
	onClickFunction
} : Style ) => {
	origKeys = [ ... origKeys, styleKey ];

	const keys = [ ... baseKeys, styleKey ];
	const baseKey = keys.join( '-' );
	const isNull = null === styleValue;
	const isObj = isObject( styleValue );
	const isArr = isArray( styleValue );
	const isVal = isNull || ( ! isObj && ! isArr );

	return (
		<div key={ `style-wrap-${ baseKey }` } className="style-wrap">
			{ isVal &&
				<div key={ `style-value-pair-${ baseKey }` } className="style-value-pair">
					<span key={ `style-remove-${ baseKey }` } className="style-key" onClick={ () => { onClickFunction( origKeys ); } }>{ styleKey + ": " }</span>
					<span key={ `style-value-${ baseKey }` }>{ styleValue }</span>
				</div>
			}

			{ ! isVal &&
				<div key={ `style-key-${ baseKey }` } className="style-key">
					{ isObj && ! isEmpty( styleValue ) &&
						<span key={ `style-remove-${ baseKey }` } onClick={ () => { onClickFunction( origKeys ); } }>{ styleKey + ": {" }</span>
					}

					{ isObj && isEmpty( styleValue ) &&
						<span key={ `style-remove-${ baseKey }` } onClick={ () => { onClickFunction( origKeys ); } }>{ styleKey + ": {}" }</span>
					}

					{ isArr && ! isEmpty( styleValue ) &&
						<span key={ `style-remove-${ baseKey }` } onClick={ () => { onClickFunction( origKeys ); } }>{ styleKey + ": [" }</span>
					}

					{ isArr && isEmpty( styleValue ) &&
						<span key={ `style-remove-${ baseKey }` } onClick={ () => { onClickFunction( origKeys ); } }>{ styleKey + ": []" }</span>
					}
				</div>
			}

			{ ( ! isNull && ( isObj || isArr ) ) &&
				<div key={ `style-values-${ baseKey }` } className="style-values">
					{ isArr && styleValue.map( ( style, index ) => {
						const newKeys = [ ... keys, index ];
						const newKey  = newKeys.join( '-' );

						return <StyleObject
							key={ `style-${ newKey }` }
							origKeys={ origKeys }
							baseKeys={ newKeys }
							styleKey={ index }
							styleValue={ style }
							onClickFunction={ onClickFunction }
						/>
					}) }

					{ isObj && Object.entries( styleValue ).map( ( style, index ) => {
						const newKeys = [ ... keys, index ];
						const newKey  = newKeys.join( '-' );

						return <StyleObject
							key={ `style-${ newKey }` }
							origKeys={ origKeys }
							baseKeys={ newKeys }
							styleKey={ style[0] }
							styleValue={ style[1] }
							onClickFunction={ onClickFunction }
						/>
					}) }
				</div>
			}

			{ ! isVal && isObj && ! isEmpty( styleValue ) &&
				<div key={ `style-closure-${ baseKey }` } className="style-closure">{ "}" }</div>
			}

			{ ! isVal && isArr && ! isEmpty( styleValue ) &&
				<div key={ `style-closure-${ baseKey }` } className="style-closure">{ "]" }</div>
			}
		</div>
	);
}

export default StyleObject;