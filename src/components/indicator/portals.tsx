import Indicator from './';
import { STORE_NAME } from '../../store';
import { svgs } from '../svgs';

const {
	components: {
		Button,
	},
	data: {
		useSelect,
		select,
		dispatch,
	},
	element: {
		useEffect,
		useLayoutEffect,
		useState,
		createPortal,
	},
	i18n: {
		__,
	}
} = window[ 'wp' ];


/**
 * Set component const to export inspector blocklist ui.
 *
 * @param object props
 *
 * @since 0.2.7
 */
export const IndicatorPortals = () => {

	// Set reset state to handle manual updates.
	const [ reset, setReset ] = useState( false );

	// Set states.
	const {
		clientId,
		iframeViewport,
	} = useSelect( ( select : Function ) => {
		const selected = select( 'core/block-editor' ).getSelectedBlock();
		const clientId = selected ? selected.clientId : null;
		const spectrumSet = clientId ? select( STORE_NAME ).getSpectrumSet( clientId ) : []
		const iframeViewport = select( STORE_NAME ).getIframeViewport();

		return {
			clientId,
			iframeViewport,
			spectrumSet,
		}
	}, [] );


	/**
	 * Set function to fire on toggle sidebar.
	 *
	 * @since 0.2.7
	 */
	const onSidebarToggle = () => {
		setReset( true );
	}


	// Set useEffect to handle mount + unmount.
	useEffect( () => {
		if( ! reset ) {
			return;
		}

		setReset( false );

	}, [ reset ] );


	// Set useEffect to handle mount + unmount.
	useEffect( () => {
		setTimeout( () => {
			const sidebarToggle = document.querySelector( '.block-editor-block-inspector__tabs button[aria-controls$="-styles-view"]' );

			if( sidebarToggle ) {
				sidebarToggle.removeEventListener( 'click', onSidebarToggle );
				sidebarToggle.addEventListener( 'click', onSidebarToggle );
			}
		}, 1 );
	}, [ iframeViewport, clientId ] );


	// Check if we have a clientId.
	if( ! clientId ) {
		return null;
	}

	// Setup selectors.
	const selectors = select( STORE_NAME ).getIndicatorSelectorSet( clientId );

	// Render portal components.
	return (
		<>
			{ Object.keys( selectors ).map( ( selector ) => {
				const property = selectors[ selector ].property;
				const spectrumSet = selectors[ selector ].spectrumSet;

				if( '' === selector ) {
					return null;
				}

				// Setup targets.
				const targets = Array.from( document.querySelectorAll( selector ) );

				// Return a fresh portal for each target.
				return targets.map( ( target ) => {
					return createPortal(
						<Indicator
							target={ target }
							property={ property }
							spectrumSet={ spectrumSet }
						/>,
						target
					);
				} );

			} ) }
		</>
	);
}

export default IndicatorPortals;
