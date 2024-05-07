import { STORE_NAME } from '../store';

const {
	data: {
		select,
		useSelect,
	},
} = window[ 'wp' ];

/**
 * Set function to render blockStyle depending on outer state.
 *
 * @since 0.1.0
 */
export default function BlockStyle( props : any ) {

	// Deconstruct props.
	const { block } = props;

	// Deconstruct block properties.
	const {
		clientId,
		attributes
	} = block;
	const { tempId } = attributes;

	// Set store id to jump over first init.
	const storeId = tempId !== clientId ? clientId : tempId;

	// Set state dependencies.
	useSelect( ( select : Function ) => {
		const store = select( STORE_NAME );

		return {
			valids: store.getBlockValids( storeId ),
			size: store.getIframeSize(),
		};
	}, [] );

	// Set css from store.
	const css = select( STORE_NAME ).getCSS( storeId );

	// Check if we have css to render.
	if ( '' === css ) {
		return null;
	}

	// Render component.
	return <style id={ 'qp-viewports-block-style-' + storeId }>{ css }</style>;
}
