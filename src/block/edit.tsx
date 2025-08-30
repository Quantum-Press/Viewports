import { StyleFill } from '@viewports/components';
import { useMount } from '@viewports/hooks';
import { STORE_NAME } from '@viewports/store';
import type { Block, BlockEditProps } from '@viewports/types';
import { debounce, debug } from '@viewports/utils';

const {
	data: {
		useDispatch,
		useSelect,
		select,
	},
	element: {
		useCallback,
		useEffect,
		useLayoutEffect,
		useRef,
		useState,
		Component
	}
} = window[ 'wp' ];

const {
	cloneDeep,
} = window[ 'lodash' ];

/**
 * Export functional BlockEdit component to handle block changes.
 */
export default function BlockEdit( { block, props } : { block: Block, props: BlockEditProps } ) {
	const {
		name: blockName,
		setAttributes,
		clientId,
		isSelected,
	} = props;
	const attributes = props.attributes;

	// Set store dispatchers.
	const store = useDispatch( STORE_NAME );

	// Set datastore state dependencies.
	const {
		isSaving,
		iframeViewport,
		lastEdit,
	} = useSelect( ( select : Function ) => {
		const store = select( STORE_NAME );

		return {
			isSaving: store.isSaving(),
			isActive: store.isActive(),
			isEditing: store.isEditing(),
			isLoading: store.isLoading(),
			viewport: store.getViewport(),
			iframeViewport: store.getIframeViewport(),
			lastEdit: store.getLastEdit(),
		};
	}, [] );

	// Set useState indicator flags.
	const [ isRegistered, setIsRegistered ] = useState( false );
	const [ isRegistering, setIsRegistering ] = useState( true );
	const [ updateSelected, setUpdateSelected ] = useState( false );
	const [ updateSelectedViewport, setUpdateSelectedViewport ] = useState( false );

	// Store attributes as reference to handle debounced updates.
	const attributesRef = useRef( attributes );
	attributesRef.current = attributes;

	/*
	// Set useMemo to handle updates on block attributes.
	const debouncedRegisterBlockInit = useCallback( () => {
		store.updateBlockChanges( clientId, blockName, attributesRef.current );

		const saves = select( STORE_NAME ).getGeneratedBlockSaves( clientId );
		const inlineStyle = select( STORE_NAME ).getInlineStyle( clientId );

		setAttributes( {
			viewports: saves,
			inlineStyles: inlineStyle,
		} );
	}, [ clientId, blockName, store, select, setAttributes ] );

	// Set reference to handle debounced updates.
	const debouncedRegisterRef = useRef( debounce( debouncedRegisterBlockInit, 150 ) );
	*/

	// Set useMemo to handle updates on block attributes.
	const debouncedUpdateBlockChanges = useCallback( () => {
		store.updateBlockChanges( clientId, blockName, attributesRef.current );

		const saves = select( STORE_NAME ).getGeneratedBlockSaves( clientId );
		const inlineStyle = select( STORE_NAME ).getInlineStyle( clientId );

		setAttributes( {
			viewports: saves,
			inlineStyles: inlineStyle,
		} );
	}, [ clientId, blockName, store, select, setAttributes ] );

	// Set reference to handle debounced updates.
	const debouncedUpdateRef = useRef( debounce( debouncedUpdateBlockChanges, 150 ) );


	// Set useEffect on mount to skip first render cycle via state delay.
	useMount( () => {

		// Register block in datastore.
		store.registerBlockInit( clientId, blockName, attributes );

		// Debug statement when running attribute change detection.
		if( attributes.hasOwnProperty( 'viewports' ) && attributes.viewports && Object.keys( attributes.viewports ).length ) {
			debug(
				'log',
				'init',
				'init with viewports',
				attributes,
			);
		}

		// Init with fresh data from datastore after register.
		const saves = select( STORE_NAME ).getGeneratedBlockSaves( clientId );
		const inlineStyle = select( STORE_NAME ).getInlineStyle( clientId );

		// Update viewports attributes.
		setAttributes( {
			viewports: saves,
			inlineStyles: inlineStyle,
		} );

	} );


	// Set useEffect on isSaving to handle viewports datastore and block attributes cleanup.
	useEffect( () => {
		if( isSaving ) {
			store.saveBlock( clientId, blockName );
		}

	}, [ isSaving ] );


	// Set useEffect on selected block to update its attributes by user interactions with viewports.
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


	// Set useEffect on updating selected block to update its attributes silently.
	useEffect( () => {
		if( ! updateSelectedViewport ) {
			return;
		}

		// Set valids running on actual viewport.
		const saves = select( STORE_NAME ).getGeneratedBlockSaves( clientId );
		const valids = select( STORE_NAME ).getViewportBlockValids( clientId );
		const inlineStyle = select( STORE_NAME ).getInlineStyle( clientId );

		// Set attributes without change listening.
		setAttributes( {
			... cloneDeep( valids ),
			viewports: saves,
			inlineStyles: inlineStyle,
		} );
		setUpdateSelected( true );

	}, [ updateSelectedViewport ] );


	// Use useEffect to handle resets on selected block via viewport change.
	useEffect( () => {
		if( ! updateSelected ) {
			return;
		}

		// Reset states to listen again.
		setUpdateSelectedViewport( false );
		setUpdateSelected( false );

	}, [ updateSelected ] );


	// Use useEffect to handle style attribute changes.
	useLayoutEffect( () => {

		// Skip if there is no attribute.
		if( null === attributes ) {
			return;
		}

		// Skip and reset on updateTempId to ignore just the init rerender.
		if( ! isRegistered && isRegistering ) {
			setIsRegistered( true );
			setIsRegistering( false );
			return;
		}

		// Skip and reset on changing iframe size to ignore just the update rerender.
		if( updateSelectedViewport ) {
			setUpdateSelectedViewport( false );
			return;
		}

		// Skip and reset on changing selected block to ignore just the update rereder.
		if( updateSelected ) {
			setUpdateSelected( false );
			return;
		}

		// Debug statement when running attribute change detection.
		debug(
			'log',
			'edit',
			'change attributes',
			attributes
		);

		debouncedUpdateRef.current();

	}, [ attributes?.style ] );

	// Get css from store.
	const css = select( STORE_NAME ).getCSS( clientId ) as string;

	// Check if block.edit is a function or class component to return its edit function.
	return (
		<>
			{ typeof block.edit === 'function' && block.edit.prototype instanceof Component
				? new block.edit( props ).render()
				: block.edit( props ) }

			{ '' !== css && <StyleFill>
				{ css }
			</StyleFill> }
		</>
	);
}
