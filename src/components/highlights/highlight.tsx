import { STORE_NAME } from '../../store/constants';
import { useResizeObserver } from '../../hooks/use-resize-observer';

const {
	data: {
		useSelect,
	},
	element: {
		useEffect,
		useState,
		useRef,
	}
} = window[ 'wp' ];

type Highlight = {
	selector: string,
	type: string,
}


/**
 * Set component const to export Highlight UI.
 *
 * @since 0.2.2
 */
const Highlight = ( props ) => {

	const {
		observe: {
			selector,
			type,
			padding = 0,
		}
	} = props;

	const [ selectorData, setSelectorData ] = useState( {} );

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

	// Set client style.
	const style = getClientStyle();

	return (
		<div
			className="qp-viewports-highlight"
			style={ style }
		></div>
	);
}

export default Highlight;
