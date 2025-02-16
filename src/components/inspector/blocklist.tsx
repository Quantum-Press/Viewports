import Block from './block';

const {
	data: {
		select,
		useSelect,
	},
} = window[ 'wp' ];

/**
 * Set component const to export sidebar control-edit ui.
 */
const BlockList = () => {

	// Set state dependencies.
	const {
		selected,
	} = useSelect( ( select : Function ) => {
		return {
			selected: select( 'core/block-editor' ).getSelectedBlock(),
		}
	}, [] );

	// Set selected ClientID.
	const clientId = selected ? selected.clientId : null;
	if( clientId ) {
		return null;
	}

	// Set blocks.
	const blocks = select( 'core/editor' ).getBlocks();

	// Render component.
	return (
		<div className="qp-viewports-inspector-blocklist">
			{ blocks.map( ( block ) => {
				return (
					<Block block={ block } level={ 1 } />
				)
			}) }
		</div>
	);
}

export default BlockList;