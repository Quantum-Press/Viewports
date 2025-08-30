import { STORE_NAME } from '@viewports/store';

const {
	data: {
		select,
		dispatch,
		useSelect,
	},
} = window[ 'wp' ];

/**
 * Set component const to export viewport ui.
 *
 * @param object props
 */
export const Viewports = () => {

	// Set states.
	const props = useSelect( ( select: Function ) => {
		const store = select( STORE_NAME );

		return {
			viewport: store.getViewport(),
			isActive: store.isActive(),
			isInspecting: store.isInspecting(),
			iframeSize: store.getIframeSize(),
			currentPost: select( 'core/editor' ).getCurrentPost(),
		}
	}, [] );

	// Return instant if is not active.
	if ( ! props.isActive ) {
		return null;
	}

	/**
	 * Set viewports from store.
	 */
	const viewports = select( STORE_NAME ).getViewports();

	/**
	 * Set countViewports.
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
	 */
	const $ui = document.querySelector( '.interface-interface-skeleton__content .components-resizable-box__container, .edit-post-visual-editor .edit-post-visual-editor__content-area, .edit-post-visual-editor > div:first-child:last-child' );
	const uiWidth = $ui ? $ui.getBoundingClientRect().width - 80 : 0;

	/**
	 * Set function to calculate width by viewportWidth.
	 */
	const calculateWidth = ( viewportWidth: number ) => {
		if ( props.viewport > uiWidth ) {
			return Math.ceil( uiWidth / props.viewport * viewportWidth );
		}

		return Math.ceil( viewportWidth );
	}

	/**
	 * Set function to fire on click.
	 */
	const onClickViewport = ( event: any ) => {
		const selected = event.target.closest( '.qp-viewport' );

		dispatch( STORE_NAME ).setViewport( parseInt( selected.getAttribute( 'data-viewport' ) ) );
	}

	/**
	 * Return rendered component.
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
