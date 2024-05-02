import { STORE_NAME } from '../store/constants';
import Generator from '../generator';
import { useResizeObserver } from '../hooks';

const {
	data: {
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
	const {
		valids,
	} = useSelect( ( select : Function ) => {
		const store = select( STORE_NAME );

		return {
			valids: store.getBlockValids( storeId ),
		};
	}, [] );

	// Set resize state.
	const selector = '.interface-interface-skeleton__content';
	const size = useResizeObserver( {
		selector,
		box: 'border-box',
	} );


	// Set styles generator and get spectrumSet.
	const generator = new Generator( block, '#block-' + clientId );
	const css = generator.getCSS();

	// Check if we have css to render.
	if ( '' === css ) {
		return null;
	}

	// Render component.
	return <style id={ 'qp-viewports-block-style-' + storeId }>{ css }</style>;
}
