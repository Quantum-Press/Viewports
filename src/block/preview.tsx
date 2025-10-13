import { STORE_NAME } from '@quantum-viewports/store';
import { Block, BlockEditProps } from '@quantum-viewports/types';

const {
	data: {
		select
	},
	element: {
		useEffect,
		useLayoutEffect,
		Component
	}
} = window[ 'wp' ];

/**
 * React component to render a block preview in Gutenberg without
 * connecting to the datastore for each block.
 *
 * This version optimizes performance by injecting all block CSS
 * for a given iframe into a single <style> element.
 *
 * The CSS is generated once per block and is not updated afterwards.
 *
 * @param props.block - The block definition object from Gutenberg.
 * @param props.props - Block edit properties including attributes and clientId.
 *
 * @returns React.ReactNode - The rendered block preview.
 */
export default function BlockPreview({ block, props }: { block: Block; props: BlockEditProps }): React.ReactNode {
	const { name: blockName, clientId } = props;
	const css = select( STORE_NAME ).getPreviewCSS( clientId, blockName, props.attributes );

	useEffect( () => {
		if ( ! css ) return;

		const iframes = document.querySelectorAll<HTMLIFrameElement>(
			'.block-editor-block-preview__content iframe, iframe[name="editor-canvas"]'
		);

		for ( const iframe of iframes ) {
			const doc = iframe.contentDocument;
			if ( ! doc ) continue;

			const styleId = 'qp-viewports-block-style-' + clientId;
			if ( doc.getElementById( styleId ) ) continue;

			const style = doc.createElement( 'style' );
			style.id = styleId;
			style.textContent = css;
			doc.head.appendChild( style );
		}
	}, [] );

	return typeof block.edit === 'function' && block.edit.prototype instanceof Component
		? new block.edit( props ).render()
		: block.edit( props );
}
