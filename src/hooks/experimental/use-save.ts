import { STORE_NAME } from '../../store';
import { useSavePost } from './use-save-post';
import { useSaveSite } from './use-save-site';

const {
	data: {
		select,
		dispatch,
	},
	element: {
		useEffect,
		useState,
	}
} = window[ 'wp' ];



/**
 * Set function to restore blocks after saves.
 *
 * @since 0.2.7
 */
const restoreBlocks = () => {
	const store = select( STORE_NAME );

	// Set block valids to iterate over clientIds.
	const valids = store.getViewportValids();
	const update = {};

	// Iterate over clientIds to get its viewport block valids.
	for( const [ clientId ] of Object.entries( valids ) ) {
		update[ clientId ] = store.getViewportBlockValids( clientId );
	}

	console.log( 'restore', update );

	setTimeout( () => { dispatch( 'core/block-editor' ).updateBlockAttributes( Object.keys( update ), update, true ) }, 1 );
}


/**
 * Set function to export use save hook.
 *
 * @since 0.2.7
 */
export const useSave = () => {

	// Set wrap states.
	const [ isSaving, setSaving ] = useState( false );
	const [ isAutoSaving, setAutoSaving ] = useState( false );

	// Set single states.
	const [ isSavingPost, isAutosavingPost, isAutoSavingPostDelay ] = useSavePost();
	const [ isSavingSite, isAutosavingSite ] = useSaveSite();


	// Set is mounted indicator to skip first init.
	const [ isMounted, setMounted ] = useState( false );
	useEffect( () => {
		if( isMounted ) {
			return;
		}

		setMounted( true );
	}, [] );


	// Set useEffect to handle isSaving from both sources.
	useEffect( () => {
		if( ! isMounted ) {
			return;
		}

		if( isAutosavingSite ) {
			setAutoSaving( true );
		} else {
			setAutoSaving( false );
		}
	}, [ isAutosavingSite ] );


	// Set useEffect to handle isSaving from both sources.
	useEffect( () => {
		if( ! isMounted ) {
			return;
		}

		if( isAutosavingPost ) {
			setAutoSaving( true );
		}
		if( ! isAutosavingPost ) {
			setAutoSaving( false );
		}

	}, [ isAutosavingPost, isAutoSavingPostDelay ] );


	// Set useEffect to handle isSaving from both sources.
	useEffect( () => {
		if( ! isMounted ) {
			return;
		}

		if( isAutoSaving ) {
			console.log( '%cQP-Viewports -> AutosaveStart', 'padding:4px 8px;background:darkgreen;color:white' );
			dispatch( STORE_NAME ).setAutoSaving();
		} else {
			console.log( '%cQP-Viewports -> AutosaveEnd', 'padding:4px 8px;background:darkgreen;color:white' );
			dispatch( STORE_NAME ).unsetAutoSaving();
			restoreBlocks();
		}
	}, [ isAutoSaving ] );


	// Set useEffect to handle isAutoSaving from both sources.
	useEffect( () => {
		if( ! isMounted ) {
			return;
		}

		if( isAutosavingSite || isAutosavingPost || isAutoSavingPostDelay ) {
			return;
		}

		if( isSavingSite || isSavingPost ) {
			setSaving( true );
		}

		if( ! isSavingSite && ! isSavingPost ) {
			setSaving( false );
		}

	}, [ isSavingSite, isSavingPost ] );


	// Set useEffect to handle isSaving from both sources.
	useEffect( () => {
		if( ! isMounted ) {
			return;
		}

		if( isSaving ) {
			console.log( '%cQP-Viewports -> SaveStart', 'padding:4px 8px;background:darkgreen;color:white' );
			dispatch( STORE_NAME ).setSaving();
		} else {
			console.log( '%cQP-Viewports -> SaveEnd', 'padding:4px 8px;background:darkgreen;color:white' );
			dispatch( STORE_NAME ).unsetSaving();
			restoreBlocks();
		}
	}, [ isSaving ] );


	// Return nothing.
	return null;
}