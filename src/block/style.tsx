import { STORE_NAME } from '../store';
import { BlockEditProps } from '../types';

const {
	data: {
		select,
		useSelect,
	},
} = window[ 'wp' ];

/**
 * Export functional BlockStyle component to handle block changes.
 */
export default function BlockStyle( { props } : { props: BlockEditProps } ) {
	const {
		clientId,
	} = props;

	// Set datastore dependencies.
	useSelect( ( select : Function ) => {
		const store = select( STORE_NAME );

		return {
			valids: store.getBlockValids( clientId ),
			size: store.getIframeSize(),
		};
	}, [] );

	// Get CSS from datastore.
	const css = select( STORE_NAME ).getCSS( clientId );

	// Return empty if there is no css.
	if ( '' === css ) {
		return null;
	}

	// Render component.
	return <style id={ 'qp-viewports-block-style-' + clientId }>{ css }</style>;
}
