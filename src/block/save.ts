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

    // Debug saved attributes on enabled debug.
    if ( debugOptions.enabled && props.attributes.viewports && Object.keys( props.attributes.viewports ).length ) {
        const isSaving = select( STORE_NAME ).isSaving();
        if ( isSaving ) {
            debug(
                'log',
                'save',
                block.name + ' block with viewports',
                {
                    style: props.attributes.style,
                    viewports: props.attributes.viewports,
                }
            );
        }
    }

    // Return the result of inherited save component.
    return block.save( props );
}

export default BlockSave;
