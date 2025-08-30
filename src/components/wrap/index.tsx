import {
	Body,
	Topbar,
	Viewports,
	Keyframes,
	Editing,
} from '@viewports/components';
import { Save } from '@viewports/hacks';
import { useResizeEditor, useLocalStorage } from '@viewports/hooks';
import { STORE_NAME } from '@viewports/store';

import Visualizer from '../../block/visualizer';
import GlobalBlockStyles from '../../block/global';

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
export const Wrap = () => {

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
			<GlobalBlockStyles />
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
