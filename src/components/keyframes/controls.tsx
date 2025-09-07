import {
	STORE_NAME,
} from '../../store';
import { StyleList } from '../inspector/stylelist';

const {
	components: {
		Button,
		Popover,
	},
	data: {
		dispatch,
	},
	i18n: {
		__,
	}
} = window[ 'wp' ];

const {
	isEqual
} = window[ 'lodash' ];


/**
 * Renders Popover UI for actual viewportTyoe.
 *
 * @param {ViewportType} viewportType - The current viewport type.
 *
 * @returns {JSX.Element | null} - The rendered component or null if conditions aren't met.
 */
export const KeyframeControls = ( { visibleControls, setVisibleControls, storeId, iframeViewport, keyframe } : { visibleControls : Array<object>, setVisibleControls : Function, storeId : string, iframeViewport : number, keyframe } ) => {
	if( ! visibleControls.some( obj => isEqual( obj, keyframe ) ) ) {
		return null;
	}

	return (
		<Popover
			placement="bottom-center"
			className="qp-viewports-keyframe-controls"
			offset={ 20 }
			onFocusOutside={ ( event ) => {
				if( event.relatedTarget.classList.contains( 'marker' ) ) {
					return;
				}

				const newControls = [ ... visibleControls ];

				// Check if keyframe is inside, to remove.
				const removeIndex = visibleControls.findIndex( obj => isEqual( obj, keyframe ) );
				if( -1 !== removeIndex ) {
					newControls.splice( removeIndex, 1 );
				}

				setVisibleControls( newControls );
			} }
		>
			{ keyframe.viewport === 0 &&
				<div className="controls-heading">
					<span>{ __( 'Default CSS', 'viewports' ) }</span>
					<span>{ 'min-width: 0px' }</span>
				</div>
			}
			{ keyframe.viewport > 0 && iframeViewport !== keyframe.viewport &&
				<div className="controls-heading">
					<span>{ __( 'Viewport CSS', 'viewports' ) }</span>
					<Button
						className="viewport"
						onClick={ () => {
							dispatch( STORE_NAME ).setViewport( keyframe.viewport )
						} }
					>
						{ `min-width: ${ keyframe.viewport }px` }
					</Button>
				</div>
			}

			{ keyframe.viewport > 0 && iframeViewport === keyframe.viewport &&
				<div className="controls-heading">
					<span>{ __( 'Viewport CSS', 'viewports' ) }</span>
					<span>{ `min-width: ${ keyframe.viewport }px` }</span>
				</div>
			}

			<StyleList
				storeId={ storeId }
				spectrumSet={ keyframe.spectrumSet }
			/>
		</Popover>
	)
}
