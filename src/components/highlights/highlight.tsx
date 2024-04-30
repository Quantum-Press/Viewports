import { useResizeObserver } from '../../hooks/use-resize-observer';

type Highlight = {
	selector: string,
	padding: number,
}

/**
 * Set component const to export Highlight UI.
 *
 * @since 0.2.2
 */
const Highlight = ( props ) => {

	// Deconstruct component props.
	const {
		observe: {
			selector,
			padding = 0,
		}
	} = props;

	// Set resize observer hook to observe element sizing and position.
	const size = useResizeObserver( {
		selector,
		box: 'border-box',
	} );


	/**
	 * Set Function to get client rect data.
	 *
	 * @since 0.2.2
	 */
	const getClientRect = () => {
		const element = document.querySelector( selector );

		if( element ) {
			const rect = element.getBoundingClientRect();

			return {
				width: rect.width,
				height: rect.height,
				top: ( rect.top + window.scrollY ),
				left: ( rect.left + window.scrollX ),
			}
		}

		return {};
	}


	/**
	 * Set Function to get client style.
	 *
	 * @since 0.2.2
	 */
	const getClientStyle = () => {
		const rect = getClientRect();

		return {
			width: rect.width + ( padding * 2 ),
			height: rect.height + ( padding * 2 ),
			top: rect.top - padding,
			left: rect.left - padding,
		};
	}

	// Render component.
	return (
		<div
			className="qp-viewports-highlight"
			style={ getClientStyle() }
		></div>
	);
}

export default Highlight;
