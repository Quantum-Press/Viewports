import { isInMobileRange, isInTabletRange, isInDesktopRange, STORE_NAME } from '../../store';

const {
	components: {
		Button,
		Icon,
	},
	data: {
		useSelect,
		select,
		dispatch,
	},
	element: {
		useEffect,
	},
	i18n: {
		__,
	}
} = window[ 'wp' ];

const { isEqual } = window[ 'lodash' ];

/**
 * Set component const to export inspector ui.
 *
 * @param object props
 *
 * @since 0.2.7
 */
const Indicator = ( { target, spectrumSet } ) => {

	// Set panel.
	const panel = target.closest( '.components-tools-panel' );

	// Set useEffect to handle mount - unmount.
	useEffect( () => {
		panel.classList.add( 'is-indicating' );

		return () => {
			panel.classList.remove( 'is-indicating' );
		}
	}, [] );


	// Set useEffect to handle changes in spectrumSet.
	useEffect( () => {
		if( spectrumSet.length ) {
			panel.classList.add( 'has-viewports' );
		} else {
			panel.classList.remove( 'has-viewports' );
		}

	}, [ spectrumSet ] );

	// Set viewport to compare with.
	const viewport = select( STORE_NAME ).getIframeViewport();

	const onClickButton = () => {

	}

	const getClassName = ( size ) => {
		const className = [ size ];

		switch ( size ) {
			case 'global':
				for( let index = 0; index < spectrumSet.length; index++ ) {
					const spectrum = spectrumSet[ index ];

					if( 0 === spectrum.from ) {
						className.push( 'has-spectrum' );

						if( isEqual( spectrum.removes, spectrum.saves ) ) {
							className.push( 'has-removes' );
						}

						break;
					}
				}

				break;

			case 'mobile':
				for( let index = 0; index < spectrumSet.length; index++ ) {
					const spectrum = spectrumSet[ index ];

					if( 0 !== spectrum.from && isInMobileRange( spectrum.from ) ) {
						className.push( 'has-spectrum' );

						if( isEqual( spectrum.removes, spectrum.saves ) ) {
							className.push( 'has-removes' );
						}

						break;
					}
				}

				break;

			case 'tablet':
				for( let index = 0; index < spectrumSet.length; index++ ) {
					const spectrum = spectrumSet[ index ];

					if( isInTabletRange( spectrum.from ) ) {
						className.push( 'has-spectrum' );

						if( isEqual( spectrum.removes, spectrum.saves ) ) {
							className.push( 'has-removes' );
						}

						break;
					}
				}

				break;

			case 'desktop':
				for( let index = 0; index < spectrumSet.length; index++ ) {
					const spectrum = spectrumSet[ index ];

					if( isInDesktopRange( spectrum.from ) ) {
						className.push( 'has-spectrum' );

						if( isEqual( spectrum.removes, spectrum.saves ) ) {
							className.push( 'has-removes' );
						}

						break;
					}
				}

				break;
		}

		return className.join( ' ' );
	}


	const classNamesGlobal = getClassName( 'global' );
	const classNamesMobile = getClassName( 'mobile' );
	const classNamesTablet = getClassName( 'tablet' );;
	const classNamesDesktop = getClassName( 'desktop' );;


	// Render component.
	return (
		<div className="qp-viewports-indicator">
			<Button
				className="qp-viewports-indicator-button"
				onClick={ onClickButton }
			>
				<Icon
					className={ classNamesGlobal }
					icon="admin-site-alt3"
				/>
				<Icon
					className={ classNamesMobile }
					icon="smartphone"
				/>
				<Icon
					className={ classNamesTablet }
					icon="tablet"
				/>
				<Icon
					className={ classNamesDesktop }
					icon="desktop"
				/>
			</Button>
		</div>
	);
}

export default Indicator;
