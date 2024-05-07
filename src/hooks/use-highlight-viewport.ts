import { openSidebar, openStylesTab } from '../utils';
import useHighlight from './use-highlight';

const {
	element: {
		useEffect,
		useState,
	}
} = window[ 'wp' ];


/**
 * Set function to return highlight viewport hook.
 *
 * @since 0.2.5
 */
export function useHighlightViewport() {

	// Set initial state.
	const [ viewport, setViewport ] = useState( false );

	// Set highlight state.
	const [ highlight, setHighlight ] = useHighlight();

	// Set useEffect to handle $element changes.
	useEffect( () => {
		if( ! viewport ) {
			return;
		}

		// Open sidebar first.
		openSidebar();

		// Open styles or general tab.
		openStylesTab();

		// Set selector.
		const selector = '.dimensions-block-support-panel';

		// Set element to highlight.
		setHighlight( selector );
		setViewport( false );
	}, [ viewport ] );

	// Return setter.
	return [ viewport, setViewport ];
};

export default useHighlightViewport;
