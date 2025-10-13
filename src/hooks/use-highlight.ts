import { scrollParent } from '@quantum-viewports/utils';

const {
	element: {
		useEffect,
		useState,
	}
} = window[ 'wp' ];


/**
 * Set function to return highlight hook.
 */
export function useHighlight() {

	// Set initial state.
	const [ selector, setSelector ] = useState( false );

	// Set useEffect to handle $element changes.
	useEffect( () => {
		if( ! selector ) {
			return;
		}

		// Set elements to highlight.
		const elements = document.querySelectorAll( selector );

		// Set scrolled indicator.
		let scrolled = false;
		let focusElement = null;

		// Highlight elements.
		elements.forEach( element => {
			if( null === focusElement ) {
				const focusableElement = element.querySelector( 'input, select, textarea, button, a, [tabindex]:not([tabindex="-1"])' );
				if ( focusableElement ) {
					focusElement = focusableElement;
				}
			}

			if( ! scrolled ) {
				scrollParent( element );
				scrolled = true;
			}

			// Reset highlighted elements after a timeout.
			element.classList.add( 'is-highlighted' );
		} );

		// Focus on the next button or input.
		if( focusElement ) {
			focusElement.focus();
		}

		// Set timeout to wait for rendered components to scroll into.
		setTimeout( () => {

			// Set elements to highlight.
			const elements = document.querySelectorAll( selector );

			// Set scrolled indicator.
			let scrolled = false;

			// Scroll to first element.
			elements.forEach( element => {
				if( ! scrolled ) {
					scrollParent( element );
					scrolled = true;
				}
			} );

		}, 100 );

		// Reset highlighted elements after a timeout.
		setTimeout( () => {

			// Set elements to reset.
			const elements = document.querySelectorAll( selector );

			// Unhighlight elements.
			elements.forEach( element => {
				element.classList.remove( 'is-highlighted' );
			} );

			setSelector( false );
		}, 1200 );
	}, [ selector ] );

	// Return setter.
	return [ selector, setSelector ];
};

export default useHighlight;
