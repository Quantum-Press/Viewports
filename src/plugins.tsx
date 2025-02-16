import Preview from './components/preview';

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