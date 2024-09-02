import type { SpectrumSet } from '../../store';
import { isInMobileRange, isInTabletRange, isInDesktopRange, STORE_NAME } from '../../store';
import { svgs } from '../svgs';

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
	},
	element: {
		useEffect,
		useRef,
		useState,
	},
	i18n: {
		__,
	}
} = window[ 'wp' ];


/**
 * Set component const to export inspector ui.
 *
 * @since 0.2.7
 */
const Indicator = ( { target, property, spectrumSet } : { target: Element, property: string, spectrumSet : SpectrumSet } ) => {

	// Set panel element.
	const panel = target.closest( '.components-tools-panel' );

	// Set popover states and ref.
	const [ isOpen, setIsOpen ] = useState( false );
	const [ step, setStep ] = useState( 'main' );
	const buttonRef = useRef<HTMLButtonElement>(null);


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


	/**
	 * Set function to handle toggle.
	 *
	 * @since 0.2.8
	 */
	const handleToggle = () => setIsOpen( 'main' !== step ? ! isOpen : true );


	/**
	 * Set function to handle close.
	 *
	 * @since 0.2.8
	 */
	const handleClose = () => {
		setStep( 'main' );
		setIsOpen( false );
	};


	/**
	 * Set function to handle back.
	 *
	 * @since 0.2.8
	 */
	const handleBack = () => {
		setStep( 'main' );
		setIsOpen( true );
	};


	/**
	 * Set function to handle main action.
	 *
	 * @since 0.2.8
	 */
	const handleMainAction = (action: string) => {
		switch ( action ) {
			case 'manage':
				setIsOpen( true );
				setStep( 'manage' );

			case 'remove':
				setIsOpen( true );
				// dispatch( STORE_NAME ).removeBlockProperty();
				break;

			case 'restore':
				setIsOpen( true );
				// dispatch( STORE_NAME ).restoreBlockProperty();
				break;

			case 'inspect':
				dispatch( STORE_NAME ).toggleInspecting();
				break;

			case 'edit':
				dispatch( STORE_NAME ).setActive();
				dispatch( STORE_NAME ).toggleEditing();
				break;

			default:
				break;
		}
	};


	/**
	 * Set function to handle viewport action.
	 *
	 * @since 0.2.8
	 */
	const handleViewportAction = ( viewport : number ) => {
		const {
			clientId,
		} = select( 'core/block-editor' ).getSelectedBlock();

		dispatch( STORE_NAME ).addBlockPropertyChanges( clientId, viewport, property );
		handleClose(); // Hier das Popover schließen
	}


	/**
	 * Set function to render main menu items.
	 *
	 * @since 0.2.8
	 */
	const renderMainMenuItems = () => (
		<>
			<MenuItem className="close" onClick={ handleClose }>
				<Icon icon="no-alt"/>
			</MenuItem>
			<MenuGroup label={ __( 'Style actions', 'quantum-viewports' ) }>
				<MenuItem className="indicator-action manage" onClick={ () => handleMainAction( 'manage' ) }>
					<Icon icon="admin-settings"/>
					{ __( 'Manage styles', 'quantum-viewports' ) }
				</MenuItem>
				<MenuItem className="indicator-action remove" onClick={ () => handleMainAction( 'remove' ) }>
					<Icon icon="trash"/>
					{ __( 'Remove all styles', 'quantum-viewports' ) }
				</MenuItem>
				<MenuItem className="indicator-action restore" onClick={ () => handleMainAction( 'restore' ) }>
					<Icon icon="update"/>
					{ __( 'Restore all styles', 'quantum-viewports' ) }
				</MenuItem>
			</MenuGroup>
			<MenuGroup label={ __( 'Editor actions', 'quantum-viewports' ) }>
				<MenuItem className="indicator-action inspect" onClick={ () => handleMainAction( 'inspect' ) }>
					<Icon icon={ svgs.inspect }/>
					{ __( 'Inspect', 'quantum-viewports' ) }
				</MenuItem>
				<MenuItem className="indicator-action edit" onClick={ () => handleMainAction( 'edit' ) }>
					<Icon icon={ svgs.edit }/>
					{ __( 'Permanently', 'quantum-viewports' ) }
				</MenuItem>
			</MenuGroup>
		</>
	);


	/**
	 * Set function to render viewport menu items.
	 *
	 * @since 0.2.8
	 */
	const renderViewportMenuItems = () => {
		const viewports = select( STORE_NAME ).getViewports();
		const iframeViewport = select( STORE_NAME ).getIframeViewport();
		const blocked = spectrumSet.map( spectrum => spectrum.hasChanges ? spectrum.from : 0 );

		return (
			<>
				<MenuItem className="close" onClick={ handleBack }>
					<Icon icon="no-alt"/>
				</MenuItem>

				<MenuGroup label={ __( 'Manage styles', 'quantum-viewports' ) }>
					{ Object.keys( viewports ).map( viewportDirty => {
						const viewport = parseInt( viewportDirty );

						// Check if viewport is 0 to continue.
						if( 0 === viewport ) {
							return null;
						}

						// Check if viewport is already blocked to set icon.
						let isBlocked = false;
						if( -1 < blocked.indexOf( viewport ) ) {
							isBlocked = true;
						}

						// Set label
						let label = '';
						if( isInMobileRange( viewport ) ) {
							label = __( 'Mobile', 'quantum-viewports' );
						}
						if( isInTabletRange( viewport ) ) {
							label = __( 'Tablet', 'quantum-viewports' );
						}
						if( isInDesktopRange( viewport ) ) {
							label = __( 'Desktop', 'quantum-viewports' );
						}

						return(
							<MenuItem className="indicator-action viewport" onClick={ () => handleViewportAction( viewport ) }>
								{ isBlocked && <Icon icon="yes-alt" /> }
								{ ! isBlocked && <Icon icon="marker" /> }
								{ viewport + 'px - ' + label }
							</MenuItem>
						);
					} ) }
				</MenuGroup>
			</>
		);
	}


	/**
	 * Set function to return className by size.
	 *
	 * @param {string} size
	 *
	 * @since 0.2.7
	 *
	 * @return {string}
	 */
	const getClassName = ( size ) : string => {
		const className = [ size ];

		switch ( size ) {
			case 'global':
				for( let index = 0; index < spectrumSet.length; index++ ) {
					const spectrum = spectrumSet[ index ];

					if( 0 === spectrum.from ) {
						if( spectrum.hasSaves ) {
							className.push( 'has-saves' );
						}

						if( spectrum.hasRemoves ) {
							className.push( 'has-removes' );
						}

						if( spectrum.hasChanges ) {
							className.push( 'has-changes' );
						}

						break;
					}
				}

				break;

			case 'mobile':
				for( let index = 0; index < spectrumSet.length; index++ ) {
					const spectrum = spectrumSet[ index ];

					if( 0 !== spectrum.from && isInMobileRange( spectrum.from ) ) {
						if( spectrum.hasSaves ) {
							className.push( 'has-saves' );
						}

						if( spectrum.hasRemoves ) {
							className.push( 'has-removes' );
						}

						if( spectrum.hasChanges ) {
							className.push( 'has-changes' );
						}

						break;
					}
				}

				break;

			case 'tablet':
				for( let index = 0; index < spectrumSet.length; index++ ) {
					const spectrum = spectrumSet[ index ];

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

						break;
					}
				}

				break;

			case 'desktop':
				for( let index = 0; index < spectrumSet.length; index++ ) {
					const spectrum = spectrumSet[ index ];

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

						break;
					}
				}

				break;
		}

		return className.join( ' ' );
	}

	// Set classNames for each viewport wrap size.
	const classNamesGlobal = getClassName( 'global' );
	const classNamesMobile = getClassName( 'mobile' );
	const classNamesTablet = getClassName( 'tablet' );
	const classNamesDesktop = getClassName( 'desktop' );

	// Render component.
	return (
		<div className="qp-viewports-indicator">
			<Button
				ref={ buttonRef }
				className="qp-viewports-indicator-button"
				onClick={ handleToggle }
				aria-expanded={ isOpen }
				aria-haspopup="true"
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
				{ isOpen && (
					<Popover
						className="qp-viewports-indicator-popover"
						onClose={ handleClose }
						anchorRef={ buttonRef.current }
						position="bottom right"
						focusOnMount={ false }
					>
						{ step === 'main' && renderMainMenuItems() }
						{ step === 'manage' && renderViewportMenuItems() }
					</Popover>
				) }

			</Button>
		</div>
	);
}

export default Indicator;
