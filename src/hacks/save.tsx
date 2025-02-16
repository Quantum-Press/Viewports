import { STORE_NAME } from '../store';
import { debug } from '../utils';

const {
	data: {
		dispatch,
	},
	element: {
		useEffect,
	}
} = window[ 'wp' ];

/**
 * Global dirty and save states.
 */
let isAutosaving = false;
let isRunning : any = false;
let oldSaveEntityRecord : Function;
let oldSavePost : Function;
let oldAutosave : Function;


/**
 * Fire the given event on body and log it.
 *
 * @param name   The events name
 * @param detail Additional data passed to subscribers
 */
function dispatchEvent( name : string, detail : any ) {
	document.body.dispatchEvent( new CustomEvent( name, { detail } ) );
}


/**
 * Wrapper function for saveEntityRecord().
 *
 * @param kind
 * @param name
 * @param record
 * @param options
 * @returns
 */
function newSaveEntityRecord( kind : string, name : string, record : any[], options : object ) {

	// Bail out if autosaving.
	if( isAutosaving ) {
		return oldSaveEntityRecord( kind, name, record, options );
	}

	// Bail out if savePost.
	if( 'savePost' === isRunning ) {
		return oldSaveEntityRecord( kind, name, record, options );
	}

	// Set active runner flag.
	isRunning = 'saveEntityRecord';

	// Fire event before saveEntityRecord().
	dispatchEvent( 'qp-saveEntityRecord-before', { kind, name, record, options } );

	// Execute saveEnityRecord.
	const resultPromise = oldSaveEntityRecord( kind, name, record, options );

	// Return outer promise and dispatch an event when inner promise is done.
	return new Promise( ( resolve, reject ) => {
		resultPromise
		.then( ( response : any ) => {
			dispatchEvent( 'qp-saveEntityRecord-after', response );
			resolve( response );
		} )
		.catch( ( response : any ) => {
			dispatchEvent( 'qp-saveEntityRecord-after', response );
			reject( response );
		} );
	} );
}


/**
 * Wrapper function for autosave().
 *
 * @param state
 * @returns
 */
function newSavePost( options = {} ) {
	isRunning = 'savePost';

	// Fire event before autosave().
	dispatchEvent( 'qp-savePost-before', options );

	// Execute autosave.
	const resultPromise = oldSavePost( options );

	// Return outer promise and dispatch an event when inner promise is done.
	return new Promise( ( resolve, reject ) => {
		resultPromise
		.then( ( response : any ) => {
			dispatchEvent( 'qp-savePost-after', response );
			resolve( response );
		} )
		.catch( ( response : any ) => {
			dispatchEvent( 'qp-savePost-after', response );
			reject( response );
		} );
	} );
}


/**
 * Wrapper function for autosave().
 *
 * @param state
 * @returns
 */
function newAutosave( state : any ) {

	// Fire event before autosave().
	dispatchEvent( 'qp-autosave-before', state );
	isAutosaving = true;

	// Execute autosave.
	const resultPromise = oldAutosave( state );

	// Return outer promise and dispatch an event when inner promise is done.
	return new Promise( ( resolve, reject ) => {
		resultPromise
		.then( ( response : any ) => {
			dispatchEvent( 'qp-autosave-after', response );
			isAutosaving = false;
			resolve( response );
		} )
		.catch( ( response : any ) => {
			dispatchEvent( 'qp-autosave-after', response );
			isAutosaving = false;
			reject( response );
		} );
	} );
}


/**
 * Set saveMap to check the last save end call.
 */
const saveMap = new Map();


/**
 * Set function to fire on saving start.
 *
 * @param {object} event
 */
function onSaveEntityRecordStart( event ) {
	const { name, record: {
		id,
	} } = event.detail;

	debug(
		'log',
		'save',
		'onSaveEntityRecordStart',
		`${ name } -> ${ id }`
	);

	const saveKey = name + '-' + id;

	saveMap.set( saveKey, true );

	dispatch( STORE_NAME ).setSaving();
}


/**
 * Set function to fire on saving end.
 */
function onSaveEntityRecordEnd( event ) {
	const { type, id } = event.detail;

	debug(
		'log',
		'save',
		'onSaveEntityRecordEnd',
		`${ name } -> ${ id }`
	);

	const saveKey = type + '-' + id;

	saveMap.delete( saveKey );

	if( 0 < saveMap.size ) {
		return;
	}

	debug(
		'log',
		'save',
		'onSaveEntityRecordEnd unsetSaving',
		`${ name } -> ${ id }`
	);

	isRunning = false;

	// Update all blocks to viewports valid attributes and unset saving.
	dispatch( STORE_NAME ).unsetSaving();
}


/**
 * Set function to fire on savePost start.
 */
function onSavePostStart() {
	if( isAutosaving ) {
		return;
	}

	debug(
		'log',
		'save',
		'onSavePostStart',
	);

	dispatch( STORE_NAME ).setSaving();
}


/**
 * Set function to fire on savePost end.
 */
function onSavePostEnd() {
	if( isAutosaving ) {
		return;
	}

	isRunning = false;

	debug(
		'log',
		'save',
		'onSavePostEnd',
	);

	// Update all blocks to viewports valid attributes and unset saving.
	dispatch( STORE_NAME ).unsetSaving();
}


/**
 * Set function to fire on saving start.
 */
function onAutoSavingStart() {
	debug(
		'log',
		'save',
		'onAutoSavingStart',
	);

	dispatch( STORE_NAME ).setAutoSaving();
}


/**
 * Set function to fire on autosaving end.
 */
function onAutoSavingEnd() {
	debug(
		'log',
		'save',
		'onAutoSavingEnd',
	);

	// Update all blocks to viewport valid attributes and unset saving.
	dispatch( STORE_NAME ).unsetAutoSaving();
}


/**
 * Export component that fires events for dirty and saving state changes.
 */
export default function Save() {

	/**
	 * Set useEffect to handle onMount event registration onMount and onUnmount.
	 */
	useEffect( () => {
		document.body.addEventListener( 'qp-saveEntityRecord-before', onSaveEntityRecordStart );
		document.body.addEventListener( 'qp-saveEntityRecord-after', onSaveEntityRecordEnd );

		document.body.addEventListener( 'qp-savePost-before', onSavePostStart );
		document.body.addEventListener( 'qp-savePost-after', onSavePostEnd );

		document.body.addEventListener( 'qp-autosave-before', onAutoSavingStart );
		document.body.addEventListener( 'qp-autosave-after', onAutoSavingEnd );

		return () => {
			document.body.removeEventListener( 'qp-saveEntityRecord-before', onSaveEntityRecordStart );
			document.body.removeEventListener( 'qp-saveEntityRecord-after', onSaveEntityRecordEnd );

			document.body.removeEventListener( 'qp-savePost-before', onSavePostStart );
			document.body.removeEventListener( 'qp-savePost-after', onSavePostEnd );

			document.body.removeEventListener( 'qp-autosave-before', onAutoSavingStart );
			document.body.removeEventListener( 'qp-autosave-after', onAutoSavingEnd );
		}
	}, [] );

	// Hook into saveEntityRecord.
	const coreStore = dispatch( 'core' );
	if( coreStore && ! oldSaveEntityRecord ) {
		oldSaveEntityRecord = coreStore.saveEntityRecord;
		coreStore.saveEntityRecord = newSaveEntityRecord;
	}

	// Hook into autosave.
	const coreEditorStore = dispatch( 'core/editor' );
	if( coreEditorStore && ! oldAutosave ) {
		oldAutosave = coreEditorStore.autosave;
		coreEditorStore.autosave = newAutosave;

		oldSavePost = coreEditorStore.savePost;
		coreEditorStore.savePost = newSavePost;
	}

	// Return nothing.
	return null;
}