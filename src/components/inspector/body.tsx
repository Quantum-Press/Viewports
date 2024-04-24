import { STORE_NAME } from '../../store/constants';
import { svgs } from '../svgs';
import Breadcrumb from './breadcrumb';
import BlockList from './blocklist';

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
const Body = () => {
	return (
		<div className="qp-viewports-inspector-body">
			<Breadcrumb />
			<BlockList />
		</div>
	);
}

export default Body;