import { useResizeEditor, useLocalStorage } from '@quantum-viewports/hooks';
import { STORE_NAME } from '@quantum-viewports/store';
import { Body, Editing, Keyframes, Topbar, Viewports, Visualizer } from '@quantum-viewports/components';
import { Save } from '@quantum-viewports/hacks';

const {
	data: {
		dispatch,
	},
	element: {
		useLayoutEffect,
	},
} = window[ 'wp' ];

/**
 * Set component const to export ui wrap.
 *
 * @param object props
 */
export function Wrap() {

	// Set state dependencies.
	useResizeEditor();

	// Set useLocalStorage to handle nested client settings.
	const [ position ] = useLocalStorage( 'inspector.position', 'right' );

	// Set useLayoutEffect to handle on mount with runtime state.
	useLayoutEffect( () => {
		dispatch( STORE_NAME ).setInspectorPosition( position );
	}, [] );

	return (
		<>
			<Body />
			<Save />
			<Topbar />
			<Viewports />
			<Keyframes />
			<Editing />
			<Visualizer />
		</>
	);
}
