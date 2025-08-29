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
registerPlugin( 'viewports-preview', {
	render: Preview,
} );

registerPlugin( 'viewports-block-styles', {
	render: BlockStyles,
} );