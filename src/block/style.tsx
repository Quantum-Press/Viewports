import { STORE_NAME } from '../store';
import { BlockEditProps } from '../types';
import { isSiteEditor } from '../utils';

const {
	data: {
		select,
		useSelect,
	},
	element: {
		createPortal,
		useEffect,
		useState,
	}
} = window[ 'wp' ];

/**
 * Export functional BlockStyle component to handle block changes.
 */
export default function BlockStyle( { props } : { props: BlockEditProps } ) {
	const {
		clientId,
	} = props;

	// Set initial states.
	const [ container, setContainer ] = useState( null );

	// Set datastore dependencies.
	useSelect( ( select : Function ) => {
		const store = select( STORE_NAME );

		return {
			valids: store.getBlockValids( clientId ),
			size: store.getIframeSize(),
		};
	}, [] );

	// Set iframe head to append portal to.
	useEffect( () => {
		if( ! isSiteEditor() ) {
			const head = document.head;
			setContainer( head );
		} else {
			const iframe = document.querySelector( 'iframe[name="editor-canvas"]' ) as HTMLIFrameElement;
			if( iframe && iframe.contentDocument ) {
				const head = iframe.contentDocument.head;
				setContainer( head );
			}
		}
	}, [] );

	// Get CSS from datastore.
	const css = select( STORE_NAME ).getCSS( clientId );

	// Return empty if there is no css.
	if ( '' === css ) {
		return null;
	}

	// Render component.
	return container ? createPortal( <style id={ 'qp-viewports-block-style-' + clientId }>{ css }</style>, container ) : null;
}
