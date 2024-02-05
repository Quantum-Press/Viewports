import { STORE_NAME } from '../store/constants';

const {
	data: {
		select,
		dispatch,
		useSelect,
	}
} = window[ 'wp' ];

/**
 * Set component const to export viewport ui.
 *
 * @param object props
 *
 * @since 0.1.0
 */
const Viewports = () => {

	// Set states.
	const props = useSelect( ( select: Function ) => {
		const store = select( STORE_NAME );

		return {
			viewport: store.getViewport(),
			isActive: store.isActive(),
			isExpanded: store.isExpanded(),
		}
	}, [] );

	// Return instant if is not active.
	if ( ! props.isActive ) {
		return null;
	}

	/**
	 * Set viewports from store.
	 *
	 * @since 0.1.0
	 */
	const viewports = select( STORE_NAME ).getViewports();

	/**
	 * Set countViewports.
	 *
	 * @since 0.1.0
	 */
	const countViewports = Object.keys( viewports ).length;

	// Get the highest viewport.
	let highestViewport = 0;
	for( const [ viewport ] of Object.entries( viewports ) ) {
		if( +viewport > highestViewport ) {
			highestViewport = +viewport;
		}
	}

	/**
	 * Set ui and its outerwidth for calculation
	 *
	 * @since 0.1.0
	 */
	const $ui = document.querySelector( '.interface-interface-skeleton__content .components-resizable-box__container, .edit-post-visual-editor .edit-post-visual-editor__content-area' );
	const uiWidth = $ui ? $ui.getBoundingClientRect().width - 80 : 0;

	/**
	 * Set function to calculate width by viewportWidth.
	 *
	 * @since 0.1.0
	 */
	const calculateWidth = ( viewportWidth: number ) => {
		if ( props.viewport > uiWidth ) {
			return Math.ceil( uiWidth / props.viewport * viewportWidth );
		}

		return Math.ceil( viewportWidth );
	}

	/**
	 * Set function to fire on click.
	 *
	 * @since 0.1.0
	 */
	const onClickViewport = ( event: any ) => {
		const selected = event.target.closest( '.qp-viewport' );
		const inspect = select( STORE_NAME ).getInspect();

		dispatch( STORE_NAME ).setViewport( parseInt( selected.getAttribute( 'data-viewport' ) ) );

		if ( inspect ) {
			dispatch( STORE_NAME ).inspectBlock( false );
		}
	}

	/**
	 * Return rendered component.
	 *
	 * @since 0.1.0
	 */
	return (
		<div
			className="qp-viewports"
		>
			{ Object.entries( viewports ).map( ( viewport, index ) => {

				// Set viewport values.
				const viewportWidth = parseInt( viewport[0] );
				if ( 0 === viewportWidth ) {
					return null;
				}

				const viewportTitle = viewport[1];

				// Set calculated values.
				const calculatedWidth = calculateWidth( viewportWidth );
				const styles = {
					width : `${calculatedWidth}px`,
					zIndex : countViewports - index,
				}

				// Set active / non-active.
				var classNames = `qp-viewport-${viewportWidth} qp-viewport`;
				if ( props.viewport === viewportWidth ) {
					classNames = classNames + ' active';
				}

				// Render interface.
				return (
					<div
						key={ `qp-viewport-${viewportWidth}` }
						className={ classNames }
						style={ styles }
						onClick={ onClickViewport }
						data-viewport={ viewportWidth }
						aria-label={ `${ viewportTitle } - ${ viewportWidth }px` }
					>
						<div className="width">{ `${ viewportWidth }px` }</div>
					</div>
				);
			}) }
		</div>
	);
};

export default Viewports;
