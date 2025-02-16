import type { Attributes } from '../utils';
import { STORE_NAME } from '../store/constants';
import { debug } from '../utils';

const {
	data: {
		select,
		dispatch,
	},
} = window[ 'wp' ];


/**
 * Set function to render blockSave wrapped in a higher order component.
 */
export const BlockSave = ( { block, props }: { block: Attributes, props: Attributes } ) => {
	if( props.attributes.hasOwnProperty( 'viewports' ) && props.attributes.viewports && 0 === Object.keys( props.attributes.viewports ).length ) {
		delete props.attributes.viewports;
	}

	if( 'swoosh-bogen-small' === props.attributes.className ) {
		console.log( 'save', props );
	}

	return block.save( props );
}

export default BlockSave;
