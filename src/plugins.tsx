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
registerPlugin( 'quantum-viewports-device-type', {
	render: DeviceTypeProvider,
} );

registerPlugin( 'quantum-viewports-keyframes-toggle', {
	render: KeyframesToggle,
} );

registerPlugin( 'quantum-viewports-block-styles', {
	render: BlockStyles,
} );

