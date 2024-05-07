import useResizeEditor from '../hooks/use-resize-editor';
import Save from './save';
import Body from './body';
import Topbar from './topbar';
import Viewports from './viewports';
import Keyframes from './keyframes';
import Editing from './editing';

/**
 * Set component const to export ui wrap.
 *
 * @param object props
 *
 * @since 0.1.0
 */
export default function Wrap() {

	// Set resize editor state dependency.
	useResizeEditor();

	return (
		<>
			<Body />
			<Save />
			<Topbar />
			<Viewports />
			<Keyframes />
			<Editing />
		</>
	);
}
