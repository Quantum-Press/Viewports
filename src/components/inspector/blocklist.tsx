import { STORE_NAME } from '../../store/constants';
import { svgs } from '../svgs';
import Block from './block';

const {
	components: {
		Icon,
	},
	data: {
		select,
		dispatch,
		useSelect,
	},
	element: {
		useEffect,
	},
	i18n: {
		__,
	}
} = window[ 'wp' ];

/**
 * Set component const to export sidebar control-edit ui.
 *
 * @param object props
 *
 * @since 0.2.2
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