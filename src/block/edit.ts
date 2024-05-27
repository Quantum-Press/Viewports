import { STORE_NAME } from '../store';

const { isEqual, cloneDeep } = window[ 'lodash' ];
const {
	blockEditor: {
		useBlockProps,
	},
	data: {
		useDispatch,
		useSelect,
		dispatch,
		select,
	},
	element: {
		useRef,
		useLayoutEffect,
		useEffect,
		useState,
		Component
	}
} = window[ 'wp' ];


/**
 * Set function and var to register activation process 1000ms after the last block loaded.
 *
 * @since 0.1.0
 */
let activeTimeout: any;
const registerActivate = () => {
	clearTimeout( activeTimeout );

	activeTimeout = setTimeout( () => {
		dispatch( STORE_NAME ).setActive();
	}, 50 );
}


/**
 * Set function and var to register init process 1000ms after the last block has rendered its edit.
 *
 * @since 0.1.0
 */
type InitMap = {
	[ key : string ]: Function;
};

let initTimeout: any;
let initMap = {} as InitMap;
const registerInit = ( clientId, setAttributes ) => {
	clearTimeout( initTimeout );

	initMap[ clientId ] = setAttributes;

	initTimeout = setTimeout( () => {
		dispatch( STORE_NAME ).setReady();
		dispatch( STORE_NAME ).unsetRegistering();

		Object.entries( initMap ).forEach( ( [ clientId, setAttributes ] ) => {
			setAttributes( { tempId: clientId } );
		} );

		console.log( '%cQP-Viewports -> successfully registered', 'padding:4px 8px;background:green;color:white', { ... initMap } );

		initMap = {};
	}, 1000 );
}


/**
 * Set function to render blockEdit wrapped in a higher order component, depending on viewports changes.
 *
 * @since 0.1.0
 */
export default function BlockEdit( blockArgs : any ) {
	const { block, props } = blockArgs;
	const {
		setAttributes,
		clientId,
		isSelected,
	} = props;
	const attributes = props.attributes;

	// Set store dispatchers.
	const store = useDispatch( STORE_NAME );

	// Set states.
	const {
		isLoading,
		isSaving,
		isAutoSaving,
		iframeViewport,
		lastEdit,
	} = useSelect( ( select : Function ) => {
		const store = select( STORE_NAME );

		return {
			isActive: store.isActive(),
			isEditing: store.isEditing(),
			isLoading: store.isLoading(),
			isSaving: store.isSaving(),
			isAutoSaving: store.isAutoSaving(),
			viewport: store.getViewport(),
			iframeViewport: store.getIframeViewport(),
			lastEdit: store.getLastEdit(),
		};
	}, [] );

	// Set useState handler.
	const [ updateTempId,                     setUpdateTempId ] = useState( true );
	const [ updateSelected,                 setUpdateSelected ] = useState( false );
	const [ updateSelectedViewport, setUpdateSelectedViewport ] = useState( false );


	// Set useEffect to handle first init after render.
	useEffect( () => {
		attributes.tempId = clientId;

		store.setRegistering();
		store.registerBlockInit( clientId, attributes );

		registerInit( clientId, setAttributes );
	}, [] );


	// Set useEffect to handle first init after render.
	useEffect( () => {
		if( '' === attributes.tempId ) {
			return;
		}

		if( attributes.tempId !== clientId ) {
			console.log( 'TEEEEEEEST DER DARF NICHT MEHR LAUFEN RICHTIG????' );

			store.setRegistering();
			store.removeBlock( attributes.tempId );
			store.registerBlockInit( clientId, attributes );

			registerInit( clientId, setAttributes );
		}

	}, [ attributes.tempId ] );


	// Use useEffect to handle loading updates to transition into active.
	useLayoutEffect( () => {
		if( ! isLoading ) {
			return;
		}

		registerActivate();
	}, [ isLoading ] );


	// Use useEffect to handle changes in viewport simulation.
	useLayoutEffect( () => {
		if( ! isSelected ) {
			return;
		}

		// Check for viewport settings before we replace settings for viewport.
		const hasBlockViewports = select( STORE_NAME ).hasBlockViewports( clientId );
		if( ! hasBlockViewports ) {
			return;
		}

		// Update states.
		setUpdateSelectedViewport( true );

	}, [ iframeViewport, isSelected, lastEdit ] );


	// Use useEffect to handle updates on selected block via viewport change.
	useLayoutEffect( () => {
		if( ! updateSelectedViewport ) {
			return;
		}

		// Set valids to inject.
		const valids = select( STORE_NAME ).getViewportBlockValids( clientId );
		const newAttributes = {
			... cloneDeep( valids ),
			tempId: clientId,
		}

		// Update states.
		setAttributes( newAttributes );
		setUpdateSelected( true );

	}, [ updateSelectedViewport ] );


	// Use useEffect to handle resets on selected block via viewport change.
	useEffect( () => {
		if( ! updateSelected ) {
			return;
		}

		setUpdateSelectedViewport( false );
		setUpdateSelected( false );

	}, [ updateSelected ] );


	// Use useEffect to handle attribute changes.
	useLayoutEffect( () => {

		// Skip if there is no attribute.
		if( null === attributes ) {
			return;
		}

		// Skip on save.
		if( isSaving || isAutoSaving ) {
			// console.log( 'isSaving' );
			return;
		}

		// Skip and reset on updateTempId to ignore just the init rerender.
		if( updateTempId ) {
			// console.log( 'updateTempId' );
			setUpdateTempId( false );
			return;
		}

		// Skip and reset on changing iframe size to ignore just the update rerender.
		if( updateSelectedViewport ) {
			// console.log( 'setUpdateSelectedViewport' );
			setUpdateSelectedViewport( false );
			return;
		}

		// Skip and reset on changing selected block to ignore just the update rereder.
		if( updateSelected ) {
			// console.log( 'updateSelected' );
			setUpdateSelected( false );
			return;
		}

		// Here we finally indicate that we need to organize a change in datastore.
		if( isSelected ) {
			const storeId = attributes.tempId && '' !== attributes.tempId ? attributes.tempId : clientId;
			console.log( 'change attributes', attributes );

			store.updateBlockChanges( storeId, attributes );
		}

	}, [ attributes ] );

	// Check if block.edit is a function or class component to return its edit function.
	const isClassComponent = typeof block.edit === 'function' && block.edit.prototype instanceof Component;
	return isClassComponent
		? ( new block.edit( props ) ).render()
		: block.edit( props )
	;
}
