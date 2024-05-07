import { STORE_NAME } from '../../store';
import Head from './head';
import Body from './body';
import Foot from './foot';

const {
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

	// Check if we need to render.
	if( ! isInspecting ) {
		return null;
	}

	// Setup classNames.
	let classNamesWrap = 'qp-viewports-inspector';
	if( ! isActive ) {
		classNamesWrap = classNamesWrap + ' flyout';
	}

	// Render component.
	return (
		<div className={ classNamesWrap }>
			<Head />
			<Body />
			<Foot />
		</div>
	);
}

export default Inspector;
