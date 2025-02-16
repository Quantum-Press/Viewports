import { STORE_NAME } from "../../store";

const {
	data: {
		dispatch,
		useSelect,
	},
	editor: {
		PluginPreviewMenuItem
	},
	i18n: {
		__,
	}
} = window[ 'wp' ];

const Preview = () => {

	// Set state dependency.
	const {
		isActive,
		isEditing,
	} = useSelect( ( select ) => {
		const store = select( STORE_NAME );

		return {
			isActive: store.isActive(),
		}
	} );

	// Set dispatcher.
	const dispatcher = dispatch( STORE_NAME );

	/**
	 * Set function to fire on click viewport simulation.
	 */
	const onClickViewport = () => {
		if( ! isActive ) {
			dispatcher.setActive();
		} else {
			dispatcher.unsetActive();
		}
	}

	return (
		<>
			<PluginPreviewMenuItem
				onClick={ onClickViewport }
			>
				{ __( 'Viewport keyframes', 'quantum-viewports' ) }
			</PluginPreviewMenuItem>
		</>
	)
}

export default Preview;