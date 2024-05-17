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
 * Set function to export use save post hook.
 *
 * @since 0.2.7
 */
export const useSavePost = () => {

	// Set initial states.
	const [ isSaving, setSaving ] = useState( false );
	const [ isAutoSaving, setAutoSaving ] = useState( false );
	const [ isAutoSavingDelay, setAutoSavingDelay ] = useState( false );

	let oldAutosave = null as Function | null;
	let oldSavePost = null as Function | null;


	// Set useEffect to inject autosave and savePost promise handler.
	useEffect( () => {

		// Set core editor store dispatcher.
		const store = dispatch( 'core/editor' );

		// Check its existance.
		if( store && ! oldAutosave ) {

			// Set old autosave function to call inside.
			oldAutosave = store.autosave;

			// Inject autosave promise.
			store.autosave = ( state : any ) => {
				setAutoSaving( true );

				// Execute autosave.
				const resultPromise = oldAutosave( state );

				// Return outer promise and update states when inner promise is done.
				return new Promise( ( resolve, reject ) => {
					resultPromise
					.then( ( response : any ) => {
						setAutoSavingDelay( true );
						resolve( response );
					} )
					.catch( ( response : any ) => {
						setAutoSavingDelay( true );
						reject( response );
					} );
				} );
			};
		}

		// Check its existance.
		if( store && ! oldSavePost ) {

			// Set old savePost function to call inside.
			oldSavePost = store.savePost;

			// Inject savePost promise.
			store.savePost = ( state : any ) => {
				setSaving( true );

				// Execute autosave.
				const resultPromise = oldSavePost( state );

				// Return outer promise and update states when inner promise is done.
				return new Promise( ( resolve, reject ) => {
					resultPromise
					.then( ( response : any ) => {
						setSaving( false );
						resolve( response );
					} )
					.catch( ( response : any ) => {
						setSaving( false );
						reject( response );
					} );
				} );
			};;
		}
	}, [] );


	// Set useEffect to handle autosave delay.
	useEffect( () => {
		if( ! isAutoSavingDelay ) {
			return;
		}

		setAutoSaving( false );
		setAutoSavingDelay( false );
	}, [ isAutoSavingDelay ] );


	// Return nothing.
	return [ isSaving, isAutoSaving, isAutoSavingDelay ];
}
