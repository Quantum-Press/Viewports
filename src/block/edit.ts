import { sanitizeAttributes } from '../utils/attributes';
import { STORE_NAME } from '../store/constants';

const { isEqual } = window[ 'lodash' ];
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
	}, 2000 );
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
		isActive,
		isEditing,
		isLoading,
		isSaving,
		viewport,
		lastEdit,
	} = useSelect( ( select : Function ) => {
		const store = select( STORE_NAME );

		return {
			isActive: store.isActive(),
			isEditing: store.isEditing(),
			isLoading: store.isLoading(),
			isSaving: store.isSaving(),
			viewport: store.getViewport(),
			lastEdit: store.getLastEdit(),
		};
	}, [] );

	// Set useState handler.
	const [ isResolving,                       setIsResolving ] = useState( false );
	const [ updateTempId,                     setUpdateTempId ] = useState( false );
	const [ updateSelected,                 setUpdateSelected ] = useState( false );
	const [ updateValidsViewport,     setUpdateValidsViewport ] = useState( false );
	const [ updateSelectedViewport, setUpdateSelectedViewport ] = useState( false );
	const [ updateDefaultsViewport, setUpdateDefaultsViewport ] = useState( false );
	const [ ignoreSelectedViewport, setIgnoreSelectedViewport ] = useState( false );

	/*
	console.log(
		'rerender edit',
		tempId,
		updateTempId,
		updateSelected,
		updateValidsViewport,
		updateSelectedViewport,
		updateDefaultsViewport,
		ignoreSelectedViewport,
	);
	*/

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


	// Use useEffect to handle inspector updates.
	useLayoutEffect( () => {
		if( ! isSelected ) {
			return;
		}

		// console.log( 'updateBlockValids lastEdit', tempId );

		store.updateBlockValids( tempId );

		if( isEditing ) {
			setUpdateValidsViewport( true );
			setUpdateSelectedViewport( true );
		} else {
			setUpdateDefaultsViewport( true );
		}
	}, [ lastEdit ] );


	// Use useEffect to handle loading updates to transition into active.
	useLayoutEffect( () => {
		if( ! isLoading ) {
			return;
		}

		registerActivate();

	}, [ isLoading ] );

	// Use useEffect to handle changes in viewport simulation.
	useLayoutEffect( () => {
		// console.log( 'fire useEffect viewport, isActive', clientId, viewport, isActive );

		if( isActive && isEditing ) {
			const storeId = tempId || clientId;
			const hasBlockViewports = select( STORE_NAME ).hasBlockViewports( storeId );

			if( ! hasBlockViewports ) {
				return;
			}

			if( isSelected ) {
				setUpdateSelectedViewport( true );
			} else {
				setUpdateValidsViewport( true );
			}

		} else {
			setUpdateDefaultsViewport( true );
		}

	}, [ viewport, isActive ] );


	// Use useEffect to handle editing flag updates.
	useLayoutEffect( () => {
		if( isEditing ) {
			setUpdateValidsViewport( true );
		} else {
			setUpdateDefaultsViewport( true );
		}

	}, [ isEditing ] );


	// Use useEffect to handle updates on block valids via viewport change.
	useLayoutEffect( () => {
		if( ! updateValidsViewport ) {
			return;
		}

		const valids = select( STORE_NAME ).getViewportBlockValids( tempId );

		// console.log( 'useEffect updateValidsViewport', tempId, valids );

		setAttributes( valids );

		setUpdateValidsViewport( false );
		setIgnoreSelectedViewport( true );

	}, [ updateValidsViewport ] );


	// Use useEffect to handle updates on selected block via viewport change.
	useLayoutEffect( () => {
		// console.log( 'try useEffect updateSelectedViewport', tempId );

		if( ! updateSelectedViewport ) {
			return;
		}

		const valids = select( STORE_NAME ).getViewportBlockValids( tempId );

		// console.log( 'useEffect updateSelectedViewport', tempId, valids );

		setAttributes( valids );

		setUpdateSelected( true );

	}, [ updateSelectedViewport ] );


	// Use useEffect to handle updates on selected block via viewport change.
	useEffect( () => {
		if( ! updateSelected ) {
			return;
		}

		// console.log( 'flush updateSelectedViewport' );

		setUpdateSelectedViewport( false );
		setUpdateSelected( false );

	}, [ updateSelected ] );


	// Use useEffect to handle updates on block defaults via viewport change.
	useLayoutEffect( () => {
		if( ! updateDefaultsViewport ) {
			return;
		}

		const defaults = select( STORE_NAME ).getBlockDefaults( tempId );

		if( ! isEqual( defaults, sanitizeAttributes( attributes ) ) ) {
			// console.log( 'useEffect updateDefaultsViewport', tempId, defaults );

			setAttributes( defaults );

			if( isSelected ) {
				setUpdateSelected( true );
			}
		}

		setUpdateDefaultsViewport( false );

	}, [ updateDefaultsViewport ] );


	// Use useEffect to handle ignore attribute change watcher on viewport change.
	useEffect( () => {
		if( ! ignoreSelectedViewport ) {
			return;
		}

		setUpdateSelectedViewport( false );
		setIgnoreSelectedViewport( false );

	}, [ ignoreSelectedViewport ] );


	// Use useEffect to handle attribute changes.
	useLayoutEffect( () => {
		// console.log( 'try update block attributes', tempId, attributes );

		if( null === attributes ) {
			return;
		}

		if( isSaving ) {
			// console.log( 'block isSaving', tempId );
			return;
		}

		if( updateValidsViewport || updateDefaultsViewport || ignoreSelectedViewport ) {
			// console.log( 'block updateValidsViewport || updateDefaultsViewport || ignoreSelectedViewport', tempId );
			return;
		}

		if( updateTempId ) {
			// console.log( 'block updateTempId', tempId );
			setUpdateTempId( false );
			return;
		}

		// Wenn ich selected bin und den viewport wechsel, ohne eine Änderung zu haben, wird das nie gefeuert.
		if( updateSelectedViewport ) {
			// console.log( 'block updateSelectedViewport', tempId );
			setUpdateSelectedViewport( false );
			return;
		}

		if( updateSelected ) {
			// console.log( 'block updateSelected', tempId );
			setUpdateSelected( false );
			return;
		}

		if( isSelected ) {
			if( isActive && isEditing ) {
				store.updateBlockChanges( tempId, attributes );
				// console.log( 'update block changes', tempId, clientId );
			} else {
				store.updateBlockDefaults( tempId, attributes );
				// console.log( 'update block defaults', tempId );
			}
		}

	}, [ attributes ] );

	// Use useEffect to handle block remove.
	useLayoutEffect( () => {
		return () => {
			if( ! isSaving ) {
				const storeId = clientId === tempId ? clientId : tempId;

				store.removeBlock( storeId );

				// console.log( '[remove]', storeId, attributes.hasOwnProperty( 'url' ) ? attributes.url : '' );
			}
		}
	}, [] );

	// Check if block.edit is a funktion or class component to return edit.
	const isClassComponent = typeof block.edit === 'function' && block.edit.prototype instanceof Component;
	return isClassComponent
		? ( new block.edit( props ) ).render()
		: block.edit( props )
	;
}
