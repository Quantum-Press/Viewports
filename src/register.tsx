import type {
	Block,
	BlockEditProps,
	BlockSaveProps,
} from './types';
import BlockEdit from './block/edit';
import BlockSave from './block/save';
import ToggleInspecting from './components/toggle/inspecting';
import { isInBlockBlacklist } from './config';
import BlockPreview from './block/preview';

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


// Filter into all blocks register to wrap around block.edit and block.save.
addFilter( 'blocks.registerBlockType', 'quantumpress/viewports', ( block : Block ) => {

	// Ignore all blacklisted blocks.
	if( isInBlockBlacklist( block.name ) ) {
		return block;
	}

	// Add viewports attributes.
	Object.assign( block.attributes, {
		viewports: {
			type: 'object',
		},
		inlineStyles: {
			type: 'object',
		}
	});

	// Return wrapped edit and save.
	return {
		... block,
		edit( props : BlockEditProps ) {
			return (
				<>
					{ props.isSelectionEnabled && <BlockEdit
						block={ block }
						props={ props }
					/> }

					{ ! props.isSelectionEnabled && <BlockPreview
						block={ block }
						props={ props }
					/> }
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

		save( props : BlockSaveProps ) {
			return <BlockSave block={ block } props={ props } />
		}
	};
} );