import { useMount } from '@quantum-viewports/hooks';
import { STORE_NAME } from '@quantum-viewports/store';
import {
    Block,
    BlockEditProps,
} from '@quantum-viewports/types';
import {
    debounce,
    debug
} from '@quantum-viewports/utils';
import { Indicators } from './indicators';

const {
    blockEditor: {
        useStyleOverride,
    },
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
export default function BlockEdit( { block, props }: { block: Block, props: BlockEditProps } ) {
    const {
        name: blockName,
        setAttributes,
        clientId,
        isSelected,
    }: {
        name: string,
        setAttributes: ( attrs: Record<string, any> ) => void,
        clientId: string,
        isSelected: boolean,
    } = props;
    const attributes = props.attributes;

    // Set store dispatcher.
    const useDispatcher = useDispatch( STORE_NAME );
    const selector = select( STORE_NAME );

    // Set datastore state dependencies.
    const {
        isSaving,
        iframeViewport,
        lastEdit,
    } = useSelect( ( select: Function ) => {
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
    const isSelectedRef = useRef( isSelected );
    attributesRef.current = attributes;
    isSelectedRef.current = isSelected;

    // Set useMemo to handle updates on block attributes.
    const debouncedUpdateBlockChanges = useCallback( () => {
        if ( ! isSelectedRef.current ) {
            return;
        }

        useDispatcher.updateBlockChanges( clientId, blockName, attributesRef.current );

        setAttributes( {
            viewports: selector.getGeneratedBlockSaves( clientId ),
        } );

    }, [ clientId, blockName, useDispatcher, selector, setAttributes ] );

    // Set reference to handle debounced updates.
    const debouncedUpdateRef = useRef( debounce( debouncedUpdateBlockChanges, 150 ) );

    // Set useEffect on mount to skip first render cycle via state delay.
    useMount( () => {

        // Register block in datastore.
        useDispatcher.registerBlockInit( clientId, blockName, attributes );

        // Debug statement when running attribute change detection.
        if ( attributes.hasOwnProperty( 'viewports' ) && attributes.viewports && Object.keys( attributes.viewports ).length ) {
            debug(
                'log',
                'init',
                'init with viewports',
                attributes,
            );
        }
    } );

    // Set useEffect on isSaving to handle viewports datastore and block attributes cleanup.
    useEffect( () => {
        if ( isSaving ) {
            useDispatcher.saveBlock( clientId, blockName );
        }

    }, [ isSaving ] );


    // Set useEffect on selected block to update its attributes by user interactions with viewports.
    useLayoutEffect( () => {
        if ( ! isSelected ) {
            isSelectedRef.current = false;
            return;
        }
        isSelectedRef.current = true;

        // Check for viewport settings before we replace settings for viewport.
        const hasBlockViewports = selector.hasBlockViewports( clientId );
        if ( ! hasBlockViewports ) {
            return;
        }

        // Update states.
        setUpdateSelectedViewport( true );

    }, [ iframeViewport, isSelected, lastEdit ] );


    // Set useEffect on updating selected block to update its attributes silently.
    useEffect( () => {
        if ( ! updateSelectedViewport ) {
            return;
        }

        // Set valids running on actual viewport.
        const saves = selector.getGeneratedBlockSaves( clientId );
        const valids = selector.getViewportBlockValids( clientId );

        // Set attributes without change listening.
        setAttributes( {
            ... cloneDeep( valids ),
            viewports: saves,
        } );
        setUpdateSelected( true );

    }, [ updateSelectedViewport ] );


    // Use useEffect to handle resets on selected block via viewport change.
    useEffect( () => {
        if ( ! updateSelected ) {
            return;
        }

        // Reset states to listen again.
        setUpdateSelectedViewport( false );
        setUpdateSelected( false );

    }, [ updateSelected ] );


    // Use useEffect to handle style attribute changes.
    useLayoutEffect( () => {

        // Skip if there is no attribute.
        if ( null === attributes ) {
            return;
        }

        // Skip and reset on updateTempId to ignore just the init rerender.
        if ( ! isRegistered && isRegistering ) {
            setIsRegistered( true );
            setIsRegistering( false );
            return;
        }

        // Skip and reset on changing iframe size to ignore just the update rerender.
        if ( updateSelectedViewport ) {
            setUpdateSelectedViewport( false );
            return;
        }

        // Skip and reset on changing selected block to ignore just the update rereder.
        if ( updateSelected ) {
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

    // Get css and selectors from store.
    const css = selector.getCSS( clientId ) as string;
    useStyleOverride( { css } );

    // Check if block.edit is a function or class component to return its edit function.
    return (
        <>
            { isSelected && <Indicators key={ clientId } clientId={ clientId } /> }
            { typeof block.edit === 'function' && block.edit.prototype instanceof Component
                ? new block.edit( props ).render()
                : block.edit( props ) }
        </>
    );
}
