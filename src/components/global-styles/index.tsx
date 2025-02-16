const {
	data: {
		useSelect,
		dispatch,
	},
	element: {
		useState,
		useEffect
	}
} = window[ 'wp' ];

const useGlobalBlockStyles = () => {
	const globalBlockStyles = useSelect( select => {
		const settings = select( 'core/block-editor' ).getSettings();
		if( ! settings ) {
			return null;
		}

		// Find the Symbol key for global styles data
		const symbols = Object.getOwnPropertySymbols( settings );
		const globalStylesDataKey = symbols.find( symbol =>
			symbol.toString().includes( 'globalStylesDataKey' )
		);

		// Retrieve the global styles data
		return globalStylesDataKey ? settings[ globalStylesDataKey ].blocks : null;
	}, [] );


	// Update global block styles
	const setGlobalBlockStyles = ( blockName, styles ) => {
		const currentStyles = globalBlockStyles?.[ blockName ] || {};

		// Merge the new styles with the current styles
		const updatedStyles = {
			...currentStyles,
			...styles,
		};

		// Dispatch the changes to the WordPress data store
		dispatch( 'core/block-editor' ).updateSettings( {
			[ blockName ]: updatedStyles,
		} );
	};

	return [ globalBlockStyles, setGlobalBlockStyles ];
};

export default useGlobalBlockStyles;