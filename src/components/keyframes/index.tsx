import type { Attributes } from '../../utils';
import { isObject, getMergedAttributes } from '../../utils';
import { STORE_NAME } from '../../store/constants';
import { useResizeObserver, useHighlight, useHighlightSidebar } from '../../hooks';

const {
	data: {
		useSelect,
		dispatch,
	},
	element: {
		useEffect,
		useState,
	}
} = window[ 'wp' ];

interface Frame {
	size: number;
	position: string;
	viewport: number;
}

/**
 * Set component to render keyframes ui.
 *
 * @since 0.1.0
 */
const Keyframes = () => {

	// Set states.
	const props = useSelect( ( select : Function ) => {
		const blockEditor = select( 'core/block-editor' );
		const store = select( STORE_NAME );

		return {
			saves: store.getSaves(),
			changes: store.getChanges(),
			removes: store.getRemoves(),
			viewport: store.getViewport(),
			viewports: store.getViewports(),
			isActive: store.isActive(),
			isInspecting: store.isInspecting(),
			selected: blockEditor.getSelectedBlock(),
		};
	}, [] );

	// Set resize state.
	const selector = '.interface-interface-skeleton__content';
	const size = useResizeObserver( {
		selector,
		box: 'border-box',
	} );

	// Set highlight hook.
	const [ highlight, setHighlight ] = useHighlight();

	// Set highlightSidebar hook.
	const [ highlightSidebar, setHighlightSidebar ] = useHighlightSidebar();

	// Set useState to handle inspect viewport.
	const [ highlightViewport, setHighlightViewport ] = useState( false );

	// Set useState to handle hover pairing.
	const [ hover, setHover ] = useState( false );

	// Set useEffect to rerender on size changes.
	useEffect(() => {
		// Silencio.
	}, [ size, props.isInspecting ] );

	// Set useEffect to set Highligh on size changes.
	useEffect( () => {
		if( ! highlightViewport ) {
			return;
		}

		setHighlight( '.qp-viewports-inspector-style[data-viewport="' + highlightViewport + '"]' );
		setHighlightSidebar( highlightViewport );
		setHighlightViewport( false );

	}, [ highlightViewport ] );

	// Return instant if is not active.
	if( false === props.isActive ) {
		return null;
	}

	// Set ui and its outerwidth for calculation
	const $ui = document.querySelector( '.interface-interface-skeleton__content .components-resizable-box__container, .edit-post-visual-editor .edit-post-visual-editor__content-area, .edit-post-visual-editor > div:first-child:last-child' );
	const uiWidth = $ui ? $ui.getBoundingClientRect().width - 80 : 0;

	// Set defaults.
	let saves : Attributes = {};
	let changes : Attributes = {}
	let removes : Attributes = {}

	// Check whether we selected a single block to show its valids.
	if( null !== props.selected ) {
		const tempId = props.selected.attributes.tempId;

		if( props.saves.hasOwnProperty( tempId ) && isObject( props.saves[ tempId ] ) && 0 < Object.entries( props.saves[ tempId ] ).length ) {
			saves[ tempId ] = props.saves[ tempId ];
		}

		if( props.changes.hasOwnProperty( tempId ) && isObject( props.changes[ tempId ] ) && 0 < Object.entries( props.changes[ tempId ] ).length ) {
			changes[ tempId ] = props.changes[ tempId ];
		}

		if( props.removes.hasOwnProperty( tempId ) && isObject( props.removes[ tempId ] ) && 0 < Object.entries( props.removes[ tempId ] ).length ) {
			removes[ tempId ] = props.removes[ tempId ];
		}
	}

	// Set merged result of saves and changes.
	var merged : Attributes = getMergedAttributes( saves, changes, removes );

	// console.log( 'KEYFRAMES', saves, changes, removes );

	// Set keyframes to render.
	const keyframes : Attributes = {};
	for( const [ clientId, viewports ] of Object.entries( merged ) ) {
		keyframes[ clientId ] = [ { viewport: 0, size: 80, position: 'center' } ];

		for( const [ dirty ] of Object.entries( viewports ) ) {
			let viewport = parseInt( dirty );
			let first = keyframes[ clientId ].shift();
			let keyframe = { viewport: viewport, size: 0 }

			if( 0 === keyframes[ clientId ].length ) {
				first.size = viewport - 3;

				keyframes[ clientId ] = [ { position: 'first', ...keyframe }, first, { position: 'last', ...keyframe } ];
			} else {
				first.size = (( viewport - first.viewport ) / 2 );
				first.position = 'first';

				let last = keyframes[ clientId ].pop();
				last.size = (( viewport - first.viewport ) / 2 );
				last.position = 'last';

				keyframes[ clientId ] = [ { position: 'first', ...keyframe }, first, ...keyframes[ clientId ], last, { position: 'last', ...keyframe } ];
			}
		}
	}


	/**
	 * Set function to calculate width of given frame.
	 *
	 * @since 0.1.0
	 */
	const calculateWidth = ( frame : Frame ) => {
		const { size, position, viewport } = frame;
		const zoom = uiWidth / props.viewport;

		// console.log( frame );

		if( props.viewport >= ( uiWidth ) ) {
			if( 0 === size ) {
				let tempSize = ( props.viewport - viewport ) / 2;

				return zoom * tempSize + 40;
			}

			if( 'center' === position ) {
				return Math.round( ( zoom * size ) * 10 ) / 10;
			}

			return Math.round( ( zoom * size ) * 10 ) / 10;
		}

		if( 0 === size ) {
			return (( uiWidth - viewport ) / 2 ) + 40;
		}

		return Math.round( size * 10 ) / 10;
	}


	/**
	 * Set function to fire on click open.
	 *
	 * @since 0.1.0
	 */
	const onClickKeyframe = ( { target } : any ) => {
		if( ! target.classList.contains( 'qp-keyframe' ) ) {
			target = target.closest( '.qp-keyframe' );
		}

		var {
			dataset: {
				viewport,
			}
		} = target;

		viewport = parseInt( viewport );

		if( viewport > 0 ) {
			dispatch( STORE_NAME ).setInspecting();

			setHighlightViewport( viewport );
		}
	}


	/**
	 * Set function to fire on mouse over.
	 *
	 * @since 0.1.0
	 */
	const onMouseOver = ( { target } : any ) => {
		if( ! target.classList.contains( 'qp-keyframe' ) ) {
			target = target.closest( '.qp-keyframe' );
		}

		const {
			dataset: {
				clientid,
				viewport,
			}
		} = target;

		setHover({ clientId: clientid, viewport: parseInt( viewport ) });
	}


	/**
	 * Set function to fire on mouse over.
	 *
	 * @since 0.1.0
	 */
	const onMouseOut = () => {
		setHover( false );
	}


	/**
	 * Set function to indicate whether given viewport is in range.
	 *
	 * @since 0.1.0
	 */
	const getInfoText = () => {
		let keyframeViewport = 0;

		for( const [ clientId, viewports ] of Object.entries( merged ) ) {
			for( const [ viewport ] of Object.entries( viewports ) ) {
				if( viewport <= props.viewport ) {
					keyframeViewport = parseInt( viewport );
				}
			}
		}

		return keyframeViewport > 0 ? `min-width: ${ keyframeViewport }px` : 'default';
	}


	/**
	 * Return rendered component.
	 *
	 * @since 0.1.0
	 */
	return (
		<div
			key={ `qp-keyframes` }
			className="qp-keyframes"
		>
			{ Object.entries( keyframes ).map( ( keyframe : Array<any>) => {
				const clientId = keyframe[0];
				const frames = keyframe[1];

				return (
					<div
						key={ `qp-keyframes-client-${ clientId }` }
						className="qp-keyframes-client"
					>
						<div
							key={ `qp-keyframes-wrap-${ clientId }` }
							className="qp-keyframes-wrap"
						>
							{ Object.entries( frames ).map( ( frame : Array<any>, index ) => {
								const { viewport, position } = frame[1];

								// Set active / non-active.
								var classNames = `qp-keyframe-${ viewport } qp-keyframe ${ position }`;
								if( props.viewport === viewport ) {
									classNames = classNames + ' active';
								}

								// Set saves indicator.
								var hasSaves = saves.hasOwnProperty( clientId ) && saves[ clientId ].hasOwnProperty( viewport ) && 0 < Object.keys( saves[ clientId ][ viewport ] ).length;

								// Set changes indicator.
								var hasChanges = changes.hasOwnProperty( clientId ) && changes[ clientId ].hasOwnProperty( viewport ) && 0 < Object.keys( changes[ clientId ][ viewport ] ).length;

								// Set removes indicator.
								var hasRemoves = removes.hasOwnProperty( clientId ) && removes[ clientId ].hasOwnProperty( viewport ) && 0 < Object.keys( removes[ clientId ][ viewport ] ).length;

								// Set removed indicator.
								if( ! hasSaves && hasRemoves && ! hasChanges ) {
									classNames = classNames + ' removed';
								}

								// Set changes indicator.
								if( hasSaves && ( hasChanges || hasRemoves ) ) {
									classNames = classNames + ' changes';
								}

								// Set new indicator.
								if( ! hasSaves && hasChanges ) {
									classNames = classNames + ' new';
								}

								// Set hover pairing indicator.
								if( hover && hover.clientId === clientId && hover.viewport === viewport ) {
									classNames = classNames + ' hover';
								}

								// Set calculated width.
								const width = calculateWidth( frame[1] );

								// Render keyframe.
								return (
									<div
										key={ `qp-keyframe-${clientId}-${viewport}-${index}` }
										className={ classNames }
										style={{
											width: `${ width }px`,
										}}
										data-viewport={ viewport }
										data-clientid={ clientId }
										onMouseOver={ onMouseOver }
										onMouseOut={ onMouseOut }
										onClick={ onClickKeyframe }
									>
										{ 'last' === position && ( hasChanges || hasRemoves ) &&
											<div key={ `qp-keyframe-marker-${clientId}-${viewport}-${index}` } className="marker"></div>
										}
									</div>
								);
							}) }
						</div>
					</div>
				);
			}) }
		</div>
	)
}

export default Keyframes
