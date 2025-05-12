import Preview from './components/preview';
import { BlockStyles } from './components/block-styles';

const {
	plugins: {
		registerPlugin,
	},
} = window[ 'wp' ];

/**
 * Register preview dropdown extension.
 */
registerPlugin( 'quantum-viewports-preview', {
	render: Preview,
} );

registerPlugin( 'quantum-viewports-block-styles', {
	render: BlockStyles,
} );