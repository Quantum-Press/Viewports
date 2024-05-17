import useIsMounted from "./use-is-mounted";

const {
	data: {
		dispatch,
	},
	element: {
		useEffect,
		useState,
	}
} = window[ 'wp' ];


/**
 * Set function to export use save site hook.
 *
 * @since 0.2.7
 */
export const useSaveSite = () => {

	// Set initial states.
	const [ saveMap, setSaveMap ] = useState( [] );
	const [ isSaving, setSaving ] = useState( false );
	const isAutoSaving = false;


	// Set useEffect to inject autosave and savePost promise handler.
	useEffect( () => {

		// Set core editor store dispatcher.
		const store = dispatch( 'core' );

		// Check its existance.
		if( store ) {

			// Set old saveEntityRecord function to call inside.
			const oldSaveEntityRecord = store.saveEntityRecord;

			// Inject saveEntityRecord promise.
			store.saveEntityRecord = ( kind : string, name : string, record: any, options : object ) => {

				// Deconstruct record.
				const {
					id,
				} = record;

				// Set saveKey and saving.
				const saveKey = name + '-' + id;
				setSaveKey( saveKey );
				setSaving( true );

				// Execute saveEnityRecord.
				const resultPromise = oldSaveEntityRecord( kind, name, record, options );

				// Return outer promise and update states when inner promise is done.
				return new Promise( ( resolve, reject ) => {
					resultPromise
					.then( ( response : any ) => {
						unsetSaveKey( saveKey );
						resolve( response );
					} )
					.catch( ( response : any ) => {
						unsetSaveKey( saveKey );
						reject( response );
					} );
				} );
			}
		}
	}, [] );


	/**
	 * Set function to set saveKey.
	 *
	 * @since 0.2.7
	 */
	const setSaveKey = ( key ) => {
		setSaveMap( saveMap.push( key ) )
	}


	/**
	 * Set function to unset saveKey.
	 *
	 * @since 0.2.7
	 */
	const unsetSaveKey = ( key ) => {

		// Set filtered save map.
		const filtered = saveMap.filter( item => item !== key );
		setSaveMap( filtered );

		// Check if we can reset saving.
		if( ! filtered.length ) {
			setSaving( false );
		}
	}

	return [ isSaving, isAutoSaving ];
}