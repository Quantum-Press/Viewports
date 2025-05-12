import useResizeEditor from '../hooks/use-resize-editor';
import { useLocalStorage } from '../hooks';
import { STORE_NAME } from '../store';
import Body from './body';
import Save from '../hacks/save';
import Topbar from './topbar';
import Viewports from './viewports';
import Keyframes from './keyframes';
import Editing from './editing';
import Visualizer from '../block/visualizer';

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
export default function Wrap() {

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
