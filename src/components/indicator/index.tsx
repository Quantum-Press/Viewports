import type { SpectrumSet, ViewportType } from '../../store';
import { isInMobileRange, isInTabletRange, isInDesktopRange, STORE_NAME, hasSpectrumSetViewportType, getInRange } from '../../store';
import { Pointer } from './pointer';
import { IndicatorControls } from './controls';
import { desktop, mobile, tablet } from '../svgs';

const {
	components: {
		Button,
		Icon,
		MenuGroup,
		MenuItem,
		Popover,
	},
	data: {
		select,
		dispatch,
		useSelect,
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
	const hasTabletSpectrum = spectrumSet.length ? hasSpectrumSetViewportType( 'tablet', spectrumSet ) : false;
	const hasDesktopSpectrum = spectrumSet.length ? hasSpectrumSetViewportType( 'desktop', spectrumSet ) : false;

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
	const handleClick = ( viewportType : ViewportType ) => {
		if( isActive ) {
			if(
				( 'mobile' === viewportType && ! isInMobileRange( iframeViewport ) ) ||
				( 'tablet' === viewportType && ! isInTabletRange( iframeViewport ) ) ||
				( 'desktop' === viewportType && ! isInDesktopRange( iframeViewport ) )
			) {
				dispatch( STORE_NAME ).setViewportType( viewportType );

				if( ! isVisible ) {
					setIsVisible( true );
				}

			} else if( ! isVisible ) {
				setIsVisible( true );
			} else {
				setIsVisible( false );
				dispatch( STORE_NAME ).unsetActive();
			}
		} else {
			dispatch( STORE_NAME ).setActive();
			dispatch( STORE_NAME ).setViewportType( viewportType );
			setIsVisible( true );
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
			case 'mobile' :
				if( isActive && isInMobileRange( iframeViewport ) ) {
					className.push( 'is-active' );
				}

				if( isEditing ) {
					className.push( 'is-editing' );
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

			case 'tablet' :
				if( isActive && isInTabletRange( iframeViewport ) ) {
					className.push( 'is-active' );
				}

				if( isEditing ) {
					className.push( 'is-editing' );
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

			case 'desktop' :
				if( isActive && isInDesktopRange( iframeViewport ) ) {
					className.push( 'is-active' );
				}

				if( isEditing ) {
					className.push( 'is-editing' );
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
	const classNamesMobile = getClassName( 'mobile' );
	const classNamesTablet = getClassName( 'tablet' );
	const classNamesDesktop = getClassName( 'desktop' );

	// Set active viewportType.
	const viewportType = isInDesktopRange( iframeViewport ) ? 'desktop' : isInTabletRange( iframeViewport ) ? 'tablet' : isInMobileRange( iframeViewport ) ? 'mobile' : 'desktop';

	// Render component.
	return (
		<div className="qp-viewports-indicator-wrap">
			<div className={ classNamesMobile }>
				<Pointer
					viewportType="mobile"
					isEditing={ isEditing }
					iframeViewport={ iframeViewport }
					hasTabletSpectrum={ hasTabletSpectrum }
					hasDesktopSpectrum={ hasDesktopSpectrum }
				/>
				<Button
					onClick={ () => {
						handleClick( 'mobile' );
					} }
				>
					<Icon
						icon={ mobile }
					/>
				</Button>
			</div>
			<div className={ classNamesTablet }>
				<Pointer
					viewportType="tablet"
					isEditing={ isEditing }
					iframeViewport={ iframeViewport }
					hasTabletSpectrum={ hasTabletSpectrum }
					hasDesktopSpectrum={ hasDesktopSpectrum }
				/>
				<Button
					onClick={ () => {
						handleClick( 'tablet' );
					} }
				>
					<Icon
						icon={ tablet }
					/>
				</Button>
			</div>
			<div className={ classNamesDesktop }>
				<Pointer
					viewportType="desktop"
					isEditing={ isEditing }
					iframeViewport={ iframeViewport }
					hasTabletSpectrum={ hasTabletSpectrum }
					hasDesktopSpectrum={ hasDesktopSpectrum }
				/>
				<Button
					onClick={ () => {
						handleClick( 'desktop' );
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
				isEditing={ isEditing }
				storeId={ storeId }
				viewportType={ viewportType }
				iframeViewport={ iframeViewport }
				spectrumSet={ spectrumSet }
			/> }
		</div>
	);
}

export default Indicator;
