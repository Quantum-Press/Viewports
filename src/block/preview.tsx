import { STORE_NAME } from '../store';
import {
	Block,
	BlockEditProps
} from '../types';

const {
	data: {
		select,
	},
	element: {
		useLayoutEffect,
		Component
	}
} = window[ 'wp' ];

/**
 * Export BlockPreview component to handle block preview without datastore connection.
 */
export default function BlockPreview( { block, props }: { block: Block, props: BlockEditProps } ) {
	const { name: blockName, clientId } = props;
	const css = select( STORE_NAME ).getPreviewCSS( clientId, blockName, props.attributes );

	useLayoutEffect( () => {
		if( '' === css ) {
			return;
		}

		const iframes = document.querySelectorAll<HTMLIFrameElement>( '.block-editor-block-preview__content iframe, iframe[name="editor-canvas"]' );
		for( const iframe of iframes ) {
			const doc = iframe.contentDocument;
			if( ! doc ) continue;

			const blockRoot = doc.querySelector( `[data-block="${clientId}"]` );
			if( ! blockRoot ) continue;

			const styleId = 'qp-viewports-block-style-' + clientId;
			if( ! doc.getElementById( styleId ) ) {
				const style = doc.createElement( 'style' );
				style.id = styleId;
				style.innerHTML = css;
				doc.head.appendChild( style );
			}
			break;
		}

	}, [ css, clientId ] );


	return typeof block.edit === 'function' && block.edit.prototype instanceof Component
		? new block.edit( props ).render()
		: block.edit( props );
}
