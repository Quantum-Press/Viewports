import { STORE_NAME } from '../../store';

const {
	data: {
		useSelect,
	},
} = window[ 'wp' ];

/**
 * Set component const to export Highlights UI.
 */
const Editing = () => {

	// Set store states.
	const {
		isActive,
		isEditing,
	} = useSelect( ( select: Function ) => {
		const store = select( STORE_NAME );

		return {
			iframeSize: store.getIframeSize(),
			isLoading: store.isLoading(),
			isActive: store.isActive(),
			isEditing: store.isEditing(),
			isInspecting: store.isInspecting(),
			inspectorPosition: store.getInspectorPosition(),
		}
	}, [] );

	// Check if we need to render.
	if( ! isEditing || ! isActive ) {
		return null;
	}


	/**
	 * Set Function to get client rect data.
	 */
	const getClientRect = () => {
		const element = document.querySelector( 'iframe[name="editor-canvas"], .editor-styles-wrapper, .edit-site-editor-canvas-container' );

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
	 */
	const getClientStyle = () => {
		const rect = getClientRect();
		const padding = 10;

		return {
			width: rect.width + ( padding * 2 ),
			height: rect.height + ( padding * 2 ),
			top: rect.top - padding,
			left: rect.left - padding,
		};
	}

	// Render component.
	return (
		<div className="qp-viewports-highlight-wrap">
			<div
				className="qp-viewports-highlight"
				style={ getClientStyle() }
			></div>
		</div>
	);
};

export default Editing;
