import { StyleList, ToggleEdit } from '@viewports/components';
import { STORE_NAME } from '@viewports/store';
import { SpectrumSet, viewportType } from '@viewports/types';

const {
	components: {
		Button,
		Icon,
		Popover,
	},
	data: {
		useSelect,
	},
	element: {
		useEffect,
	},
	i18n: {
		__,
	}
} = window[ 'wp' ];


/**
 * Renders Popover UI for actual viewportTyoe.
 *
 * @param {viewportType} viewportType - The current viewport type.
 *
 * @returns {JSX.Element | null} - The rendered component or null if conditions aren't met.
 */
export const IndicatorControls = ( {
	isVisible,
	setIsVisible,
	isEditing,
	storeId,
	viewportType,
	iframeViewport,
	spectrumSet
} : {
	isVisible : boolean,
	setIsVisible : Function,
	isEditing : boolean,
	storeId : string,
	viewportType : viewportType,
	iframeViewport : number,
	spectrumSet : SpectrumSet
} ) => {
	const {
		isActive,
	} = useSelect( ( select ) => {
		return {
			isActive: select( STORE_NAME ).isActive(),
		}
	} );

	useEffect( () => {
		if( ! isActive && isVisible ) {
			setIsVisible( false );
		}
	}, [ isActive ] );

	if( ! isVisible || ! isActive ) {
		return null;
	}

	return (
		<Popover
			placement="left-start"
			offset={ 194 }
			className="qp-viewports-indicator-controls"
			onFocusOutside={ ( event ) => {
				if( event.relatedTarget.classList.contains( 'indicator' ) ) {
					return;
				}

				setIsVisible( false );
			} }
		>
			<div className="qp-viewports-indicator-controls-head">
				<ToggleEdit />
				<Button
					className="close"
					onClick={ () => { setIsVisible( false ) } }
				>
					<Icon icon="no-alt"/>
				</Button>
			</div>
			{ 0 !== spectrumSet.length && <StyleList
				storeId={ storeId }
				spectrumSet={ spectrumSet }
			/> }
			{ 0 === spectrumSet.length && <div className="controls-style-placeholder">{ __( 'Empty styles', 'qp-viewports' ) }</div> }
		</Popover>
	)
}
