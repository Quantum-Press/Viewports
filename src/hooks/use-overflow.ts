import { useResizeObserver } from "@quantum-viewports/hooks";

const {
	element: {
		useEffect,
		useState,
	}
} = window[ 'wp' ];

/**
 * Set function to return overflow hook
 */
export function useOverflow( selector, property ) {

	// Set initial state.
	const [ isOverflowing, setIsOverflowing ] = useState( false );

	// Set initial size.
	const size = useResizeObserver( {
		selector,
		box: 'border-box',
	} );

	// Set useEffect to handle size changes.
	useEffect( () => {
		handleOverflow();
	}, [ size ] );


	/**
	 * Set function to handle overflow.
	 */
	const handleOverflow = () => {
		const element = document.querySelector( selector );

		if( element && 'height' === property ) {
			setIsOverflowing( element.scrollHeight > element.clientHeight );
		}

		if( element && 'width' === property ) {
			setIsOverflowing( element.scrollWidth > element.clientWidth );
		}
	}

	// Return state and setter.
	return [ isOverflowing, setIsOverflowing ];
};

export default useOverflow;
