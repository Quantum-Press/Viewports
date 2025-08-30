import {
	Preview,
	BlockStyles
} from '@viewports/components';

const {
	plugins: {
		registerPlugin,
	},
} = window[ 'wp' ];

/**
 * Register preview dropdown extension.
 */
registerPlugin( 'viewports-keyframes-toggle', {
	render: Preview,
} );

registerPlugin( 'viewports-block-styles', {
	render: BlockStyles,
} );