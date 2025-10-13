import { STORE_NAME } from '@quantum-viewports/store';
import { Head } from './head';
import { Body } from './body';
import { Foot } from './foot';

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
 */
export const Inspector = () => {

	// Set states.
	const {
		isActive,
		isInspecting,
		isSaving,
	} = useSelect( ( select : Function ) => {
		const store = select( STORE_NAME );

		return {
			isActive: store.isActive(),
			isInspecting: store.isInspecting(),
			isSaving: store.isSaving(),
		}
	}, [] );

	// Check if we need to render.
	if( ! isInspecting ) {
		return null;
	}

	// Setup classNames.
	let classNamesWrap = 'qp-viewports-inspector dark';
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

export * from './attributelist';
export * from './blocklist';
export * from './stylelist';
export * from './portals';
export * from './toggle';
