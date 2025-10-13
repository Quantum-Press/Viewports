import { STORE_NAME } from '@quantum-viewports/store';
import { debug, debugOptions } from '@quantum-viewports/utils';
import { Block, BlockSaveProps } from '@quantum-viewports/types';

const {
	data: {
		select,
	},
} = window[ 'wp' ];

/**
 * Export functional BlockSave component to handle block changes.
 */
export const BlockSave = ( { block, props } : { block: Block, props: BlockSaveProps } ) => {

	// Cleanup attributes.viewports if empty.
	if( props.attributes.hasOwnProperty( 'viewports' ) && props.attributes.viewports && 0 === Object.keys( props.attributes.viewports ).length ) {
		delete props.attributes.viewports;
	}

	// Cleanup attributes.inlineStyles if empty.
	if( props.attributes.hasOwnProperty( 'inlineStyles' ) && props.attributes.inlineStyles && 0 === Object.keys( props.attributes.inlineStyles ).length ) {
		delete props.attributes.inlineStyles;
	}

	// Debug saved attributes on enabled debug.
	if( debugOptions.enabled && props.attributes.viewports && Object.keys( props.attributes.viewports ).length ) {
		const isSaving = select( STORE_NAME ).isSaving();
		if( isSaving ) {
			debug(
				'log',
				'save',
				block.name + ' block with viewports',
				{
					style: props.attributes.style,
					viewports: props.attributes.viewports,
					inlineStyles: props.attributes.inlineStyles,
				}
			);
		}
	}

	// Return the result of inherited save component.
	return block.save( props );
}

export default BlockSave;
