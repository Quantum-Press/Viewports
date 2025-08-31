import type { SpectrumSet, deviceType } from '../../types';
import { isInMobileRange, isInTabletRange, isInDesktopRange, STORE_NAME, hasSpectrumSetViewportType } from '../../store';
import { Pointer } from './pointer';
import { IndicatorControls } from './controls';
import { desktop, mobile, tablet } from '../svgs';

const {
	components: {
		Button,
		Icon,
	},
	data: {
		dispatch,
		useSelect,
		useDispatch,
	},
	element: {
		useEffect,
		useState,
	},
	i18n: {
		__,
	}
} = window[ 'wp' ];


/**
 * Set component const to export inspector ui.
 */
const Indicator = ( { target, storeId, property, spectrumSet } : { target: Element, storeId: string, property: string, spectrumSet : SpectrumSet } ) => {

	// Set panel element.
	const panel = target.closest( '.components-tools-panel' );

	// Set spectrumSet indicators.
	const hasTabletSpectrum = spectrumSet.length ? hasSpectrumSetViewportType( 'Tablet', spectrumSet ) : false;
	const hasDesktopSpectrum = spectrumSet.length ? hasSpectrumSetViewportType( 'Desktop', spectrumSet ) : false;

	const editorDispatch = useDispatch( 'core/editor' );

	// Set active deviceType.
	const { deviceType } = useSelect( select => {
		const editorStore = select( 'core/editor' );

		return {
			deviceTyoe: editorStore.getDeviceType(),
		}
	}, [] );

	// Extract use select depending properties.
	const {
		isActive,
		isEditing,
		isInspecting,
		iframeViewport,
	} = useSelect( ( select ) => {
		const store = select( STORE_NAME );

		return {
			isActive: store.isActive(),
			isEditing: store.isEditing(),
			isInspecting: store.isInspecting(),
			viewport: store.getViewport(),
			iframeViewport: store.getIframeViewport(),
		}
 	} );

	// Set visibility state of controls.
	const [ isVisible, setIsVisible ] = useState( false );

	// Set useEffect to handle changes in spectrumSet.
	useEffect( () => {
		if( spectrumSet.length ) {
			panel.classList.add( 'has-viewports' );
		} else {
			panel.classList.remove( 'has-viewports' );
		}

	}, [ spectrumSet ] );


	/**
	 * Set function to handle toggle.
	 */
	const handleClick = ( deviceType : deviceType ) => {
		if(
			( 'Mobile' === deviceType && ! isInMobileRange( iframeViewport ) ) ||
			( 'Tablet' === deviceType && ! isInTabletRange( iframeViewport ) ) ||
			( 'Desktop' === deviceType && ! isInDesktopRange( iframeViewport ) )
		) {
			editorDispatch.setDeviceType( deviceType );

			if( ! isVisible ) {
				setIsVisible( true );
			}

		} else if( ! isVisible ) {
			setIsVisible( true );
		} else {
			setIsVisible( false );
		}
	}


	/**
	 * Set function to return className by size.
	 *
	 * @param {string} size
	 *
	 * @return {string}
	 */
	const getClassName = ( size ) : string => {
		const className = [ 'qp-viewports-indicator', size ];

		switch ( size ) {
			case 'Mobile' :
				if( isEditing ) {
					className.push( 'is-editing' );

					if( isInMobileRange( iframeViewport ) ) {
						className.push( 'is-active' );
					}
				}

				for( let index = 0; index < spectrumSet.length; index++ ) {
					const spectrum = spectrumSet[ index ];

					if( 0 === spectrum.from || isInMobileRange( spectrum.from ) ) {
						if( spectrum.hasSaves ) {
							className.push( 'has-saves' );
						}

						if( spectrum.hasRemoves ) {
							className.push( 'has-removes' );
						}

						if( spectrum.hasChanges ) {
							className.push( 'has-changes' );
						}
					}
				}

				break;

			case 'Tablet' :
				if( isEditing ) {
					className.push( 'is-editing' );

					if( isInTabletRange( iframeViewport ) ) {
						className.push( 'is-active' );
					}
				}

				for( let index = 0; index < spectrumSet.length; index++ ) {
					const spectrum = spectrumSet[ index ];

					if( isInMobileRange( spectrum.from ) ) {
						continue;
					}

					if( isInTabletRange( spectrum.from ) ) {
						if( spectrum.hasSaves ) {
							className.push( 'has-saves' );
						}

						if( spectrum.hasRemoves ) {
							className.push( 'has-removes' );
						}

						if( spectrum.hasChanges ) {
							className.push( 'has-changes' );
						}
					}
				}

				break;

			case 'Desktop' :
				if( isEditing ) {
					className.push( 'is-editing' );

					if( isInDesktopRange( iframeViewport ) ) {
						className.push( 'is-active' );
					}
				}

				for( let index = 0; index < spectrumSet.length; index++ ) {
					const spectrum = spectrumSet[ index ];

					if( isInMobileRange( spectrum.from ) || isInTabletRange( spectrum.from ) ) {
						continue;
					}

					if( isInDesktopRange( spectrum.from ) ) {
						if( spectrum.hasSaves ) {
							className.push( 'has-saves' );
						}

						if( spectrum.hasRemoves ) {
							className.push( 'has-removes' );
						}

						if( spectrum.hasChanges ) {
							className.push( 'has-changes' );
						}
					}
				}

				break;
		}

		return className.join( ' ' );
	}

	// Set classNames for each viewport wrap size.
	const classNamesMobile = getClassName( 'Mobile' );
	const classNamesTablet = getClassName( 'Tablet' );
	const classNamesDesktop = getClassName( 'Desktop' );

	// Render component.
	return (
		<div className="qp-viewports-indicator-wrap">
			<div className={ classNamesMobile }>
				<Pointer
					deviceType="Mobile"
					isEditing={ isEditing }
					iframeViewport={ iframeViewport }
					hasTabletSpectrum={ hasTabletSpectrum }
					hasDesktopSpectrum={ hasDesktopSpectrum }
				/>
				<Button
					onClick={ () => {
						handleClick( 'Mobile' );
					} }
				>
					<Icon
						icon={ mobile }
					/>
				</Button>
			</div>
			<div className={ classNamesTablet }>
				<Pointer
					deviceType="Tablet"
					isEditing={ isEditing }
					iframeViewport={ iframeViewport }
					hasTabletSpectrum={ hasTabletSpectrum }
					hasDesktopSpectrum={ hasDesktopSpectrum }
				/>
				<Button
					onClick={ () => {
						handleClick( 'Tablet' );
					} }
				>
					<Icon
						icon={ tablet }
					/>
				</Button>
			</div>
			<div className={ classNamesDesktop }>
				<Pointer
					deviceType="Desktop"
					isEditing={ isEditing }
					iframeViewport={ iframeViewport }
					hasTabletSpectrum={ hasTabletSpectrum }
					hasDesktopSpectrum={ hasDesktopSpectrum }
				/>
				<Button
					onClick={ () => {
						handleClick( 'Desktop' );
					} }
				>
					<Icon
						icon={ desktop }
					/>
				</Button>
			</div>
			{ ! isInspecting && <IndicatorControls
				isVisible={ isVisible }
				setIsVisible={ setIsVisible }
				storeId={ storeId }
				spectrumSet={ spectrumSet }
			/> }
		</div>
	);
}

export default Indicator;
