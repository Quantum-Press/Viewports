/**
 * Imports wp ressources.
 */
const {
	element: {
		useState,
		useEffect,
	}
} = window[ 'wp' ];


/**
 * Set function to export a hook to provide control about localStorage.
 *
 * @param storePath
 * @param defaultValue
 *
 * @since 0.2.3
 */
const useLocalStorage = ( storePath, defaultValue = null ) => {

	// Set state to handle storage entry by object traverse.
	const [ value, setValue ] = useState( () => {
		const storedData = localStorage.getItem( 'qp-viewports' );
		if( storedData ) {
			const parsedData = JSON.parse( storedData );
			const targetPath = storePath ? storePath.split( '.' ) : [];

			let obj = parsedData;
			for( const part of targetPath ) {
				if( obj && obj.hasOwnProperty( part ) ) {
					obj = obj[ part ];
				} else {
					obj = defaultValue;
					break;
				}
			}

			return obj;
		} else {
			return defaultValue;
		}
	});


	// Set useEffect to handle changes on value from outside.
	useEffect( () => {
		const storedData = localStorage.getItem( 'qp-viewports' );
		const parsedData = storedData ? JSON.parse( storedData ) : {};
		const targetPath = storePath.split( '.' );

		let obj = parsedData;
		for( let i = 0; i < targetPath.length - 1; i++ ) {
			const part = targetPath[ i ];
			if( ! obj[ part ] ) {
				obj[ part ] = {};
			}
			obj = obj[ part ];
		}

		obj[ targetPath[ targetPath.length - 1 ] ] = value;

		localStorage.setItem( 'qp-viewports', JSON.stringify( parsedData ) );
	}, [ value ] );


	// Set useEffect to handle changes on value from outside.
	useEffect( () => {
		const onChangeStorage = ( event ) => {
			if ( event.key === 'qp-viewports' ) {
				const storedData = event.newValue;

				if( storedData ) {
					const parsedData = JSON.parse( storedData );
					const targetPath = storePath ? storePath.split( '.' ) : [];
					let obj = parsedData;

					for( const part of targetPath ) {
						if( obj && obj.hasOwnProperty( part ) ) {
							obj = obj[ part ];
						} else {
							obj = defaultValue;
							break;
						}
					}

					setValue( obj );
				} else {
					setValue( defaultValue );
				}
			}
		};

		window.addEventListener( 'storage', onChangeStorage );

		return () => {
			window.removeEventListener( 'storage', onChangeStorage );
		};
	}, [] );

	// Return state and setter.
	return [ value, setValue ];
}

export default useLocalStorage;
