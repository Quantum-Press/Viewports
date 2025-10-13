import { STORE_NAME } from "@quantum-viewports/store";
import { useEditorSidebar, useResizeEditor } from "@quantum-viewports/hooks";

const {
	data: {
		useSelect
	},
	element: {
		useState,
		useEffect,
	}
} = window[ 'wp' ];


/**
 * Set function to render blockEdit wrapped in a higher order component, depending on viewports changes.
 */
export function Visualizer() {

	// Set dependency to editor sidebar.
	const [ tab ] = useEditorSidebar();

	// Set state to handle hover.
	const [ hover, setHover ] = useState( false );

	// Set dependency to editor resizing.
	const {
		editor,
		scale,
	} = useResizeEditor();


	// Set dependency to viewport changes.
	useSelect( ( select ) => {
		return {
			iframeViewport: select( STORE_NAME ).getIframeViewport(),
		}
	}, [] );


	// Set useEffect to handle tab changes.
	useEffect( () => {

		// Set timeout to wait for the end of react render cycle.
		setTimeout( () => {

			// Set nodelist of rangesliders.
			const rangeSliders = document.querySelectorAll( '.components-range-control__slider' );

			// Iterate over rangesliders to set mouse events.
			rangeSliders.forEach( slider => {
				slider.removeEventListener( 'mouseover', handleMouseOver );
				slider.addEventListener( 'mouseover', handleMouseOver );

				slider.removeEventListener( 'mouseout', handleMouseOut );
				slider.addEventListener( 'mouseout', handleMouseOut );
			} );
		}, 1 );

	}, [ tab ] );


	// Set useEffect to handle hover changes.
	useEffect( () => {

		// Set timeout to wait for the end of react render cycle.
		setTimeout( () => {
			handleClass();
		}, 1 );

	}, [ hover ] );


	// Set function to handle mouseover event.
	const handleMouseOver = () => {
		setHover( true );

		// Set timeout to wait for react render cycle.
		setTimeout( () => {
			handleVisualizer();
		}, 1 );
	};


	// Set function to handle mouseout event.
	const handleMouseOut = () => {
		setHover( false );
	};


	// Set function to handle class for visibility.
	const handleClass = () => {
		const $visualizer = document.querySelector( '.block-editor__spacing-visualizer' ) as HTMLElement;

		if( $visualizer ) {
			if( hover ) {
				if( ! $visualizer.classList.contains( 'hovered' ) ) {
					$visualizer.classList.add( 'hovered' );
				}
			} else {
				$visualizer.classList.remove( 'hovered' );
			}
		}
	}


	// Set function to handle visualizer sizing.
	const handleVisualizer = () => {
		if( ! hover ) {
			return;
		}

		const $visualizer = document.querySelector( '.block-editor__spacing-visualizer' ) as HTMLElement;

		// Check if we need to scale.
		if( $visualizer && scale < 1 ) {

			// Check if visualizer has inset to identify as margin.
			if( $visualizer.style.inset ) {
				$visualizer.style.transform = 'scale(' + scale + ')';

				const inset = $visualizer.style.inset.split( 'px' );

				$visualizer.style.transformOrigin = ( parseInt( inset[ 1 ] ) * -1 ) + 'px ' + ( parseInt( inset[ 0 ] ) * -1 ) + 'px';

			} else {
				$visualizer.style.transform = 'scale(' + scale + ')';
				$visualizer.style.transformOrigin = 'top left';
			}
		}

		handleClass();
	};

	handleVisualizer();

	return null;
}
