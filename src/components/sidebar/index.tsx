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
		isInspecting,
	} = useSelect( ( select : Function ) => {
		const store = select( STORE_NAME );

		return {
			isActive: store.isActive(),
			isInspecting: store.isInspecting(),
		}
	}, [] );

	// Setup classNames.
	let classNamesWrap = 'qp-viewports-sidebar';
	if( ! isActive && ! isInspecting ) {
		classNamesWrap = classNamesWrap + ' inactive';
	}
	if( ! isActive && isInspecting ) {
		classNamesWrap = classNamesWrap + ' flyout';
	}
	if( isInspecting ) {
		classNamesWrap = classNamesWrap + ' expanded';
	}

	return (
		<div className={ classNamesWrap }>
			<div className="qp-viewports-sidebar-head">
				<ControlExpander />
				<ControlEdit />
			</div>
			<div className="qp-viewports-sidebar-body">

			</div>
			<div className="qp-viewports-sidebar-foot">
				<ControlBlock />
				<ControlLink />
			</div>
		</div>
	);
}

export default Sidebar;
