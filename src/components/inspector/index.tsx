import { STORE_NAME } from '../../store/constants';
import Head from './head';
import Body from './body';
import Foot from './foot';

const {
	components: {
		ToolbarButton,
	},
	data: {
		useSelect,
	},
	i18n: {
		__,
	}
} = window[ 'wp' ];

/**
 * Set component const to export inspector ui.
 *
 * @param object props
 *
 * @since 0.2.2
 */
const Inspector = () => {

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
	let classNamesWrap = 'qp-viewports-inspector';
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
			<Head />
			<Body />
			<Foot />
		</div>
	);
}

export default Inspector;
