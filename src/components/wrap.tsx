import Save from './save';
import Body from './body';
import Topbar from './topbar';
import Viewports from './viewports';
import Keyframes from './keyframes';
import Highlighter from './highlighter/index';

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
