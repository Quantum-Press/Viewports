import { STORE_NAME } from '../../store';
import { SpectrumSet } from '../../types';
import { StyleList } from '../inspector/stylelist';
import ToggleEditing from '../editing/toggle';

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
 * @param {deviceType} deviceType - The current device type.
 *
 * @returns {JSX.Element | null} - The rendered component or null if conditions aren't met.
 */
export const IndicatorControls = ( {
	isVisible,
	setIsVisible,
	storeId,
	spectrumSet
} : {
	isVisible : boolean,
	setIsVisible : Function,
	storeId : string,
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

	if( ! isVisible ) {
		return null;
	}

	let className = 'qp-viewports-indicator-controls';
	if( isActive ) {
		className += ' dark';
	}

	return (
		<Popover
			placement="left-start"
			offset={ 194 }
			className={ className }
			onFocusOutside={ ( event ) => {
				if( event.relatedTarget.classList.contains( 'indicator' ) ) {
					return;
				}

				setIsVisible( false );
			} }
		>
			<div className="qp-viewports-indicator-controls-head">
				<ToggleEditing />
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
			{ 0 === spectrumSet.length && <div className="controls-style-placeholder">{ __( 'Empty styles', 'viewports' ) }</div> }
		</Popover>
	)
}
