import { sanitizeAttributes } from '../utils/attributes';
import { STORE_NAME } from '../store/constants';

const { isEqual, cloneDeep } = window[ 'lodash' ];
const {
	data: {
		useDispatch,
		useSelect,
		dispatch,
		select,
	},
	element: {
		useLayoutEffect,
		useEffect,
		useState,
		Component
	}
} = window[ 'wp' ];


/**
 * Set function and var to register init process 1000ms after the last block has rendered its edit.
 *
 * @since 0.1.0
 */
const initMap = new Map();
let initTimeout: any;
const registerInit = ( clientId, setTempId ) => {
	clearTimeout( initTimeout );

	initMap.set( clientId, setTempId );

	initTimeout = setTimeout( () => {
		for( let [ clientId, setTempId ] of initMap ) {
			setTempId( false );
		}

		dispatch( STORE_NAME ).setReady();
		dispatch( STORE_NAME ).unsetRegistering();

		console.log( '%cQP-Viewports -> successfully registered', 'padding:4px 8px;background:green;color:white', [ ... initMap.keys() ] );

		initMap.clear();
	}, 1000 );
}


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
 * Set function to indicate a block that uses resolving.
 *
 * @since 0.1.0
 */
const isResolvingBlock = ( block ) => {
	if( 'core/navigation-link' === block.name ) {
		return true;
	}

	if( 'core/navigation-submenu' === block.name ) {
		return true;
	}

	return false;
}


/**
 * Set function to render blockEdit wrapped in a higher order component, depending on viewports changes.
 *
 * @since 0.1.0
 */
export default function BlockEdit( blockArgs : any ) {
	const { block, props } = blockArgs;
	const {
		attributes: {
			tempId,
		},
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
	const [ isResolving,                       setIsResolving ] = useState( false );
	const [ updateTempId,                     setUpdateTempId ] = useState( false );
	const [ updateSelected,                 setUpdateSelected ] = useState( false );
	const [ updateSelectedViewport, setUpdateSelectedViewport ] = useState( false );


	// Use useEffect to handle clientId updates when we first setup block.
	useLayoutEffect( () => {
		if( ( updateTempId || tempId === clientId ) && ! ( ! updateTempId && tempId === clientId ) ) {
			return;
		}

		// Some block may use 2 initial renders to init cause of resolving processes.
		if( ! isResolving && isResolvingBlock( block ) ) {
			setIsResolving( true );
			return;
		}

		console.log( 'setRegistering', clientId );

		store.setRegistering();
		store.registerBlockInit( clientId, attributes );

		setUpdateTempId( true );
		setAttributes( { tempId: clientId } );

		registerInit( clientId, setUpdateTempId );
	}, [ clientId ] );


	// Use useEffect to handle tempId updates to remove update flag.
	useLayoutEffect( () => {
		if( updateTempId && tempId === clientId ) {
			setUpdateTempId( false );
		}
	}, [ tempId ] );


	// Use useEffect to handle loading updates to transition into active.
	useLayoutEffect( () => {
		if( ! isLoading ) {
			return;
		}

		console.log( 'registerActivate', clientId );

		registerActivate();
	}, [ isLoading ] );


	// Use useEffect to handle changes in viewport simulation.
	useLayoutEffect( () => {
		if( ! isSelected ) {
			return;
		}

		// Set storeId from tempId or clientId.
		const storeId = tempId || clientId;

		// Check for viewport settings before we replace settings for viewport.
		const hasBlockViewports = select( STORE_NAME ).hasBlockViewports( storeId );
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

		// Set storeId from tempId or clientId.
		const storeId = tempId || clientId;

		// Set valids to inject.
		const valids = select( STORE_NAME ).getViewportBlockValids( storeId );

		// Update states.
		setAttributes( cloneDeep( valids ) );
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
			// console.log( 'Häääää' );
			store.updateBlockChanges( tempId, attributes );
		}

	}, [ attributes ] );


	// Check if block.edit is a function or class component to return its edit function.
	const isClassComponent = typeof block.edit === 'function' && block.edit.prototype instanceof Component;
	return isClassComponent
		? ( new block.edit( props ) ).render()
		: block.edit( props )
	;
}
