import { STORE_NAME } from '../store';

const {
	data: {
		select,
		useSelect,
	},
} = window[ 'wp' ];

/**
 * Set function to render blockStyle depending on outer state.
 */
export default function BlockStyle( props : any ) {

	// Deconstruct props.
	const {
		block: {
			clientId,
		}
	} = props;

	// Set state dependencies.
	useSelect( ( select : Function ) => {
		const store = select( STORE_NAME );

		return {
			valids: store.getBlockValids( clientId ),
			size: store.getIframeSize(),
		};
	}, [] );

	// Set css from store.
	const css = select( STORE_NAME ).getCSS( clientId );

	// Check if we have css to render.
	if ( '' === css ) {
		return null;
	}

	// Render component.
	return <style id={ 'qp-viewports-block-style-' + clientId }>{ css }</style>;
}
