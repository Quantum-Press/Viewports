import { STORE_NAME } from '../../store/constants';
import { svgs } from '../svgs';

const {
	components: {
		Button,
	},
	data: {
		useSelect,
		select,
		dispatch,
	},
	element: {
		useEffect,
		useState,
		createPortal,
	},
	i18n: {
		__,
	}
} = window[ 'wp' ];


/**
 * Set function to return blocklist rows.
 *
 * @since 0.2.1
 */
const getBlocklistRows = () => {
	return document.querySelectorAll( 'table.block-editor-list-view-tree tr.block-editor-list-view-leaf td.block-editor-list-view-block__menu-cell' );
}


/**
 * Set component const to export inspector blocklist ui.
 *
 * @param object props
 *
 * @since 0.2.1
 */
export const InspectorPortals = () => {
	const [ reset, setReset ] = useState( false );

	// Set states.
	const {
		isInspecting,
	} = useSelect( ( select : Function ) => {
		const store = select( STORE_NAME );

		return {
			isInspecting: store.isInspecting(),
		}
	}, [] );

	// Set useEffect to handle reset.
	useEffect( () => {
		if( ! reset ) {
			return;
		}

		setReset( false );
	}, [ reset ] );

	// Set elements to iterate through.
	const $elements = Array.from( getBlocklistRows() );

	/**
	 * Set function to find parent of given node by selector.
	 *
	 * @since 0.2.2
	 */
	const findParentBySelector = ( node: Element, selector: string ) : Element | null => {
		let currentElement: Element | null = node.parentElement;

		while( currentElement !== null ) {
			if( currentElement instanceof Element && currentElement.matches( selector ) ) {
				return currentElement;
			}
			currentElement = currentElement.parentElement;
		}

		return null;
	}

	/**
	 * Set function to fire on click expander to reset component.
	 *
	 * @since 0.2.1
	 */
	const onClickExpander = () => {
		setReset( true );
	}

	/**
	 * Set function to fire on click inspect to trigger ui.
	 *
	 * @since 0.2.1
	 */
	const onClickInspect = ( event ) => {
		const parent = findParentBySelector( event.target, '.block-editor-list-view-leaf' );
		if( ! parent ) {
			return;
		}

		// Set indicators.
		const clientId = parent.getAttribute( 'data-block' );
		const selected = select( 'core/block-editor' ).getSelectedBlock();
		const selectedClientId = selected ? selected.clientId : null;
		const isInspecting = select( STORE_NAME ).isInspecting();

		// Check if we need to unset inspecting.
		if( isInspecting && selectedClientId === clientId ) {
			dispatch( STORE_NAME ).unsetInspecting(); return;
		}

		// Check if we need to update selected block.
		if( selectedClientId !== clientId ) {
			dispatch( 'core/block-editor' ).selectBlock( clientId );
		}

		dispatch( STORE_NAME ).setInspecting();
	}

	// Render portal components.
	return (
		<>
			{ $elements.map( ( $element, index ) => {

				// Set expander button to observe for reset.
				const $expander = $element.querySelector( '.block-editor-list-view__expander' );

				// Set event listener.
				if( $expander ) {
					$expander.addEventListener( 'click', onClickExpander );
				}

				// Set parent.
				const $parent = findParentBySelector( $element, '.block-editor-list-view-leaf' );
				if( ! $parent ) {
					return;
				}

				// Set clientId and store to check indicators.
				const clientId = $parent.getAttribute( 'data-block' );
				const store = select( STORE_NAME );

				// Set indicators.
				const hasDefaults = store.hasBlockDefaults( clientId );
				const hasSaves = store.hasBlockSaves( clientId );
				const hasChanges = store.hasBlockChanges( clientId );
				const hasRemoves = store.hasBlockRemoves( clientId );

				// Check if we have any entries to skip rendering.
				if( ! hasDefaults && ! hasSaves && ! hasChanges && ! hasRemoves ) {
					return null;
				}

				// Set button classNames
				let classNames = 'qp-viewports-inspector-blocklist-toggle';
				if( isInspecting ) {
					classNames = classNames + ' is-inspecting';
				}

				// Set target if exist, append it to menu-cell.
				let $target = $element.querySelector( '.block-editor-block-inspector' );
				if( ! $target ) {
					const $inspectorCell = document.createElement( 'div' );
					$inspectorCell.classList.add( 'block-editor-block-inspector' );

					$element.insertAdjacentElement( 'afterbegin', $inspectorCell );

					$target = $element.querySelector( '.block-editor-block-inspector' );
				}

				// Check if we have a valid call.
				if( ! $target ) {
					return null;
				}

				// Return a fresh portal to create.
				return createPortal(
					<Button
						key={ index }
						className={ classNames }
						icon={ svgs.inspect }
						label={ __( 'Inspect styles', 'quantum-viewports' ) }
						onClick={ onClickInspect }
					/>,
					$target
				);
			})}
		</>
	);
}

export default InspectorPortals;
