/**
 * List of blocks that Viewports should completely ignore for compatibility reasons.
 *
 * TODO: Should probably be filtered in PHP and passed to the script on launch.
 */
export const blocksToIgnore = new Set( [
	'cloudcatch/light-modal-block',
	'quantum-editor/teaser', // Old name - Still in use
	'quantumpress/teaser',
] );
