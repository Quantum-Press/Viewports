import { STORE_NAME } from '../../store/constants';
import ControlExpander from './control-expander';
import ControlEdit from './control-edit';
import ControlDefaults from './control-defaults';
import ControlSaves from './control-saves';
import ControlChanges from './control-changes';
import ControlValids from './control-valids';
import ControlBlock from './control-block';
import ControlLink from './control-link';

const {
	data: {
		useSelect,
	},
	i18n: {
		__,
	}
} = window[ 'wp' ];

/**
 * Set component const to export sidebar ui.
 *
 * @param object props
 *
 * @since 0.1.0
 */
const Sidebar = () => {

	// Set states.
	const {
		isActive,
		isExpanded,
	} = useSelect( ( select : Function ) => {
		const store = select( STORE_NAME );

		return {
			isActive: store.isActive(),
			isExpanded: store.isExpanded(),
		}
	}, [] );

	// Break if we are not allow to show.
	if( ! isActive ) {
		return null;
	}

	// Setup classNames.
	let classNamesWrap = 'qp-viewports-sidebar';
	if( isExpanded ) {
		classNamesWrap = classNamesWrap + ' expanded';
	}

	return (
		<div className={ classNamesWrap }>
			<div className="qp-viewports-sidebar-head">
				<ControlExpander />
				<ControlEdit />
			</div>
			<div className="qp-viewports-sidebar-body">
				<ControlDefaults />
				<ControlSaves />
				<ControlChanges />
				<ControlValids />
			</div>
			<div className="qp-viewports-sidebar-foot">
				<ControlBlock />
				<ControlLink />
			</div>
		</div>
	);
}

export default Sidebar;
