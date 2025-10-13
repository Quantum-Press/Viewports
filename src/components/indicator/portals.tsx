import { STORE_NAME } from '@quantum-viewports/store';
import { useEditorSidebar } from '@quantum-viewports/hooks';
import { Indicator } from './';

const {
	data: {
		useSelect,
		select,
	},
	element: {
		createPortal,
		useEffect,
		useState,
	},
	i18n: {
		__,
	}
} = window[ 'wp' ];


/**
 * Set component const to export inspector blocklist ui.
 *
 * @param object props
 */
export const IndicatorPortals = () => {

	// Set dependency to editor sidebar.
	const [ tab ] = useEditorSidebar();
	const [ reset, setReset ] = useState( false );

	// Set dependency to stores.
	const {
		clientId,
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

	// Set useEffect to handle tab changes.
	useEffect( () => {
		if( ! reset ) {
			setReset( true );
		} else {
			setReset( false );
		}
	}, [ tab ] );

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
							storeId={ clientId }
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
