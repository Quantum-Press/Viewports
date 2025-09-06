import KeyframesToggle from './components/keyframes/toggle';
import { BlockStyles } from './components/block-styles';
import { DeviceTypeProvider } from './hooks';

const {
	plugins: {
		registerPlugin,
	},
} = window[ 'wp' ];

/**
 * Register preview dropdown extension.
 */
registerPlugin( 'viewports-device-type', {
	render: DeviceTypeProvider,
} );

registerPlugin( 'viewports-keyframes-toggle', {
	render: KeyframesToggle,
} );

registerPlugin( 'viewports-block-styles', {
	render: BlockStyles,
} );

