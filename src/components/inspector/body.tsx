import { ToggleEdit } from '@viewports/components';

import Breadcrumb from './breadcrumb';
import BlockList from './blocklist';
import Selected from './selected';

const {
	data: {
		useSelect,
	},
} = window[ 'wp' ];

/**
 * Set component const to export sidebar control-edit ui.
 */
const Body = () => {

	// Set state dependencies.
	const {
		selected,
	} = useSelect( ( select : Function ) => {
		return {
			selected: select( 'core/block-editor' ).getSelectedBlock(),
		}
	}, [] );

	// Render component.
	return (
		<div className="qp-viewports-inspector-body">
			<Breadcrumb />
			{ ! selected && ( <BlockList /> ) }
			{ selected && ( <ToggleEdit /> ) }
			{ selected && ( <Selected block={ selected }/> ) }
		</div>
	);
}

export default Body;
