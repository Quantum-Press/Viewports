import Topbar from './topbar';
import Highlighter from './highlighter/index';
import Viewports from './viewports';
import Keyframes from './keyframes';
import Save from './save';
import Body from './body';

/**
 * Set component const to export ui wrap.
 *
 * @param object props
 *
 * @since 0.1.0
 */
export default function Wrap() {
	return (
		<>
			<Body />
			<Save />
			<Topbar />
			<Viewports />
			<Keyframes />
			<Highlighter />
		</>
	);
}
