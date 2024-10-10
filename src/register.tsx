import BlockEdit from './block/edit';
import BlockSave from './block/save';
import BlockStyle from './block/style';
import ToggleInspecting from './components/toggle/inspecting';

const {
	blockEditor: {
		BlockControls,
	},
	components: {
		ToolbarGroup,
	},
	hooks: {
		addFilter,
	}
} = window[ 'wp' ];


// Filter to modify block registration
addFilter( 'blocks.registerBlockType', 'quantumpress/viewports', ( block ) => {

	// Merge new attributes with the old ones.
	Object.assign( block.attributes, {
		viewports: {
			type: 'object',
		},
		inlineStyles: {
			type: 'object',
		},
		tempId: {
			type: 'string',
		}
	});

	// Return a new block object.
	return {
		... block,
		edit( props ) {
			return (
				<>
					<BlockEdit block={ block } props={ props } />
					<BlockStyle block={ props } />
					<BlockControls>
						<ToolbarGroup>
							<ToggleInspecting
								showText={ false }
							/>
						</ToolbarGroup>
					</BlockControls>
				</>
			);
		},

		save( props ) {
			return <BlockSave block={ block } props={ props } />
		}
	};
} );