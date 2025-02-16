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
			isEditing: store.isEditing(),
		}
	} );

	// Set dispatcher.
	const dispatcher = dispatch( STORE_NAME );

	/**
	 * Set function to fire on click edit.
	 */
	const onClickEdit = () => {
		if( ! isActive ) {
			dispatcher.setEditing();
			dispatcher.setLoading();
		} else {
			if( ! isEditing ) {
				dispatcher.setEditing();
			} else {
				dispatcher.unsetEditing();
			}
		}
	}

	/**
	 * Set function to fire on click viewport simulation.
	 */
	const onClickViewport = () => {
		if( ! isActive ) {
			dispatcher.setLoading();
		} else {
			dispatcher.unsetActive();
		}
	}

	return (
		<>
			<PluginPreviewMenuItem
				onClick={ onClickEdit }
			>
				{ __( 'Edit on Viewport', 'quantum-viewports' ) }
			</PluginPreviewMenuItem>
			<PluginPreviewMenuItem
				onClick={ onClickViewport }
			>
				{ __( 'Viewport simulation', 'quantum-viewports' ) }
			</PluginPreviewMenuItem>
		</>
	)
}

export default Preview;