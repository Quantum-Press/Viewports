import { openSidebar, openStylesTab } from '@quantum-viewports/utils';
import { useHighlight } from '@quantum-viewports/hooks';

const {
	element: {
		useEffect,
		useState,
	}
} = window[ 'wp' ];


/**
 * Set function to return highlight viewport hook.
 */
export function useHighlightProperty() {

	// Set initial state.
	const [ selector, setSelector ] = useState( false );

	// Set highlight state.
	const [ highlight, setHighlight ] = useHighlight();

	// Set useEffect to handle $element changes.
	useEffect( () => {
		if( ! selector ) {
			return;
		}

		// Open sidebar first.
		openSidebar();

		// Open styles or general tab.
		openStylesTab();

		// Set element to highlight.
		setHighlight( selector );
		setSelector( false );
	}, [ selector ] );

	// Return setter.
	return [ selector, setSelector ];
};

export default useHighlightProperty;
