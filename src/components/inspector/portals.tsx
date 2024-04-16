import { svgs } from '../svgs';

const {
	components: {
		Button,
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
	const onClickInspect = () => {
		console.log( 'onClick' );
	}

	// Render component.
	return (
		<>
			{ $elements.map( ( $element, index ) => {

				// Set expander button to observe for reset.
				const $expander = $element.querySelector( '.block-editor-list-view__expander' );

				// Set event listener.
				if( $expander ) {
					$expander.addEventListener( 'click', onClickExpander );
				}

				// Set button classNames
				const classNames = [ 'qp-viewports-inspector-blocklist' ];

				// Set target if exist, append it to menu-cell.
				let $target = $element.querySelector( '.block-editor-block-inspector' );
				if( ! $target ) {
					const $inspectorCell = document.createElement( 'div' );
					$inspectorCell.classList.add( 'block-editor-block-inspector' );

					const $menuCell = $element.querySelector( '.block-editor-list-view-block__menu-cell' );

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
