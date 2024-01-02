import BlockEdit from './block/edit';
import BlockSave from './block/save';
import BlockStyle from './block/style';

import Indicator from './components/indicator';

const {
	blockEditor: {
		BlockControls
	},
	components: {
		ToolbarGroup,
	},
	hooks: {
		addFilter,
	}
} = window[ 'wp' ];

/**
 * Filter all block registrations to add style-engine controls.
 *
 * @since 0.1.0
 */
addFilter( 'blocks.registerBlockType', 'quantumpress/viewports', ( block ) => {

	// Merge new attributes with the old ones.
	Object.assign( block.attributes, {
		viewports: {
			type: 'object',
		},
		inlineStyles: {
			type: 'object',
		},
	});

	// Return a new block object.
	return {

		// Spread the settings objects to include all of the block's "old" properties.
		... block,

		/**
		 * Override the block's edit function.
		 *
		 * @link https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
		 */
		edit( props : any ) {
			return (
				<>
					<BlockEdit block={ block } props={ props } />
					<BlockStyle props={ props } />
					<BlockControls>
						<ToolbarGroup>
							<Indicator props={ props }/>
						</ToolbarGroup>
					</BlockControls>
				</>
			);
		},

		/**
		 * Override the block's save function.
		 *
		 * @link https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
		 */
		save( props : any ) {
			return (
				<>
					<BlockSave block={ block } props={ props } />
				</>
			);
		}
	}
});
