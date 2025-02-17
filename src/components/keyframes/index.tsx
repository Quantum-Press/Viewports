import {
	STORE_NAME
} from '../../store';
import  {
	SpectrumSet
} from '../../types';

import { useHighlight, useHighlightViewport } from '../../hooks';
import { keyframe as iconKeyframe } from '../svgs';
import { KeyframeControls } from './controls';

const {
	components: {
		Button,
		Icon,
	},
	data: {
		select,
		useSelect,
	},
	element: {
		useEffect,
		useState,
	}
} = window[ 'wp' ];

const {
	isEqual
} = window[ 'lodash' ];

interface Frame {
	size: number;
	position: string;
	viewport: number;
}

const generateKeyframes = ( props ) => {

	// Set keyframes default.
	let keyframes = [
		{
			viewport: 0,
			size: 0,
			position: 'center',
			hasChanges: false,
			hasRemoves: false,
			hasSaves: false,
			spectrumSet: [],
		}
	];

	// Set lastFrom.
	let lastFrom = 0;

	// Check spectrumSet to iterate.
	if( props.spectrumSet.length ) {
		props.spectrumSet.forEach( ( spectrum ) => {

			// Extract first keyframe to check what to do.
			let first = keyframes.shift();

			// Check if we need to update center keyframe.
			if( 0 === first.viewport && 'center' === first.position ) {

				// Set a new keyframe.
				let keyframe = {
					viewport: spectrum.from,
					size: ( ( spectrum.from - first.viewport ) / 2 ),
					hasChanges: spectrum.hasChanges,
					hasRemoves: spectrum.hasRemoves,
					hasSaves: spectrum.hasSaves,
					spectrumSet: [ spectrum ],
				};

				// Check if the spectrum is also running on viewport 0 to update center keyframe.
				if( 0 === spectrum.from ) {
					first.hasChanges = first.hasChanges ? true : spectrum.hasChanges;
					first.hasRemoves = first.hasRemoves ? true : spectrum.hasRemoves;
					first.hasSaves = first.hasSaves ? true : spectrum.hasSaves;
					first.spectrumSet.push( spectrum );
				}

				// Check if the first center keyframe needs an update in size.
				if( 0 < spectrum.from ) {
					first.size = spectrum.from;
				}

				// Add keyframe and update lastFrom.
				keyframes = [ { position: 'first', ... keyframe }, first, { position: 'last', ... keyframe } ];
				lastFrom = spectrum.from;

				return true;
			}

			// Check if we need to update viewport 0 keyframes.
			if( 0 === first.viewport && 0 === spectrum.from && 'center' !== first.position ) {

				// Update all 3 keyframes handling viewport 0.
				first.hasChanges = first.hasChanges ? true : spectrum.hasChanges;
				first.hasRemoves = first.hasRemoves ? true : spectrum.hasRemoves;
				first.hasSaves = first.hasSaves ? true : spectrum.hasSaves;
				first.spectrumSet.push( spectrum );

				// Add keyframe and update lastFrom.
				keyframes = [ { ... first, position: 'first',  }, { ... first, position: 'center' }, { ... first, position: 'last' } ];
				lastFrom = spectrum.from;

				return true;
			}

			// Check if we need to update first and last keyframe.
			if( spectrum.from === lastFrom ) {

				// Extract first and last keyframe to update.
				const last = keyframes.pop();

				// Update first keyframes.
				first.hasChanges = first.hasChanges ? true : spectrum.hasChanges;
				first.hasRemoves = first.hasRemoves ? true : spectrum.hasRemoves;
				first.hasSaves = first.hasSaves ? true : spectrum.hasSaves;
				first.spectrumSet.push( spectrum );

				// Update last keyframe.
				last.hasChanges = last.hasChanges ? true : spectrum.hasChanges;
				last.hasRemoves = last.hasRemoves ? true : spectrum.hasRemoves;
				last.hasSaves = last.hasSaves ? true : spectrum.hasSaves;
				last.spectrumSet.push( spectrum );

				// Update keyframes.
				keyframes = [ first, ... keyframes, last ];
				lastFrom = spectrum.from;

			} else {

				// Set a new keyframe.
				let keyframe = {
					viewport: spectrum.from,
					size: 80,
					hasChanges: spectrum.hasChanges,
					hasRemoves: spectrum.hasRemoves,
					hasSaves: spectrum.hasSaves,
					spectrumSet: [ spectrum ],
				};

				// Extract first and last keyframe to update.
				const last = keyframes.pop();

				if( 0 === first.viewport && 'center' !== first.position ) {
					first.size = ( ( spectrum.from - first.viewport ) / 2 ) - 2;
					last.size = ( ( spectrum.from - first.viewport ) / 2 ) - 2;
				} else {
					first.size = ( ( spectrum.from - first.viewport ) / 2 );
					last.size = ( ( spectrum.from - first.viewport ) / 2 );
				}

				keyframes = [ { position: 'first', ... keyframe }, first, ... keyframes, last, { position: 'last', ... keyframe } ];
				lastFrom = spectrum.from;
			}
		} );
	}

	return keyframes;
}



/**
 * Set component to render keyframes ui.
 */
const Keyframes = () => {

	// Set states.
	const props : {
		storeId: string,
		viewport: number,
		iframeSize: number,
		iframeViewport: number,
		isActive: boolean,
		spectrumSet: SpectrumSet,
	} = useSelect( ( select : Function ) => {
		const store = select( STORE_NAME );
		const selected = select( 'core/block-editor' ).getSelectedBlock();

		if( ! selected ) {
			return {
				spectrumSet: {},
				isInspecting: store.isInspecting(),
			}
		}

		const {
			clientId,
		} = selected;

		return {
			clientId,
			viewport: store.getViewport(),
			iframeSize: store.getIframeSize(),
			iframeViewport: store.getIframeViewport(),
			viewports: store.getViewports(),
			isActive: store.isActive(),
			isInspecting: store.isInspecting(),
			spectrumSet: store.getSpectrumSet( clientId ),
		}
	}, [] );

	// Set highlight hooks.
	const [ highlight, setHighlight ] = useHighlight();
	const [ highlightViewport, sethighlightViewport ] = useHighlightViewport();

	// Set useState to handle highlights on keyframe.
	const [ highlighted, setHighlighted ] = useState( false );

	// Set useState to handle hover pairing.
	const [ hover, setHover ] = useState( false );

	// Set useState to handle hover pairing.
	const [ visibleControls, setVisibleControls ] = useState( [] );

	/**
	 * Set function to fire on click open.
	 */
	const onClickKeyframe = ( { target }, keyframe ) => {
		if( ! target.classList.contains( 'qp-keyframe' ) ) {
			target = target.closest( '.qp-keyframe' );
		}

		if( ! target ) {
			return;
		}

		const newControls = [ ... visibleControls ];

		// Check if keyframe is inside, to remove.
		const removeIndex = visibleControls.findIndex( obj => isEqual( obj, keyframe ) );
		if( -1 !== removeIndex ) {
			newControls.splice( removeIndex, 1 );
		} else {
			newControls.push( keyframe );
		}

		setVisibleControls( newControls );
	}

	// Set useEffect to set Highligh on size changes.
	useEffect( () => {
		if( ! highlighted ) {
			return;
		}

		setHighlight( '.qp-viewports-inspector-style[data-viewport="' + highlighted + '"]' );
		sethighlightViewport( highlighted );
		setHighlighted( false );

	}, [ highlighted ] );

	// Return instant if is not active.
	if( ! select( STORE_NAME ).isActive() ) {
		return null;
	}

	// Set ui and its outerwidth for calculation
	const $ui = document.querySelector( '.interface-interface-skeleton__content .components-resizable-box__container, .edit-post-visual-editor .edit-post-visual-editor__content-area, .edit-post-visual-editor > div:first-child:last-child' );
	const uiWidth = $ui ? $ui.getBoundingClientRect().width - 80 : 0;

	// Set keyframes.
	const keyframes = generateKeyframes( props );


	/**
	 * Set function to calculate width of given frame.
	 */
	const calculateWidth = ( frame : Frame ) => {
		const { size, position, viewport } = frame;
		const zoom = uiWidth / props.viewport;

		if( 'center' === position && size === 0 ) {
			return 0;
		}

		if( props.viewport >= ( uiWidth ) ) {
			if( 0 === size ) {
				let tempSize = ( props.viewport - viewport ) / 2;

				return zoom * tempSize + 40;
			}

			return Math.round( ( zoom * size ) * 10 ) / 10;
		}

		if( 0 === size ) {
			return (( uiWidth - viewport ) / 2 ) + 40;
		}

		return Math.round( size * 10 ) / 10;
	}


	/**
	 * Set function to fire on mouse over.
	 */
	const onMouseOver = ( { target } : any ) => {
		if( ! target.classList.contains( 'qp-keyframe' ) ) {
			target = target.closest( '.qp-keyframe' );
		}

		if( ! target ) {
			return;
		}

		const {
			dataset: {
				viewport,
			}
		} = target;

		setHover({ viewport: parseInt( viewport ) });
	}


	/**
	 * Set function to fire on mouse over.
	 */
	const onMouseOut = () => {
		setHover( false );
	}


	/**
	 * Return rendered component.
	 */
	return (
		<div className="qp-keyframes">
			<div className="qp-keyframes-wrap">
				{ keyframes.map( ( keyframe, index ) => {

					// Set active / non-active.
					var classNames = `qp-keyframe-${ props.viewport } qp-keyframe ${ keyframe.position }`;
					if( props.viewport === keyframe.viewport ) {
						classNames = classNames + ' active';
					}

					// Set removed indicator.
					if( keyframe.hasRemoves ) {
						classNames = classNames + ' removed';
					}

					// Set changes indicator.
					if( keyframe.hasChanges ) {
						classNames = classNames + ' changes';
					}

					// Set hover pairing indicator.
					if( hover.viewport === keyframe.viewport ) {
						classNames = classNames + ' hover';
					}

					const isControlling = visibleControls.some( obj => isEqual( obj, keyframe ) );
					if( isControlling ) {
						classNames = classNames + ' controlling';
					}

					// Set calculated width.
					const width = calculateWidth( keyframe );

					// Render keyframe.
					return (
						<div
							key={ `qp-keyframe-${ props.viewport }-${ index }` }
							className={ classNames }
							style={{
								width: `${ width }px`,
							}}
							data-viewport={ keyframe.viewport }
							onMouseOver={ onMouseOver }
							onMouseOut={ onMouseOut }
						>
							{ ( ( 'center' === keyframe.position && 0 < keyframe.spectrumSet.length ) || ( 'center' !== keyframe.position && 0 < keyframe.spectrumSet.length && 0 < keyframe.viewport ) ) &&
								<>
									<Button
										key={ `qp-keyframe-marker-${ keyframe.viewport }-${ index }` }
										className="marker"
										onClick={ ( event ) => {
											onClickKeyframe( event, keyframe )
										} }
									>
										<Icon icon={ iconKeyframe } />
									</Button>
									<KeyframeControls
										visibleControls={ visibleControls }
										setVisibleControls={ setVisibleControls }
										storeId={ props.storeId }
										iframeViewport={ props.iframeViewport }
										keyframe={ keyframe }
									/>
								</>
							}
						</div>
					);
				} ) }
			</div>
		</div>
	)
}

export default Keyframes;
