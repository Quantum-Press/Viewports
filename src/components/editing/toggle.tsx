import { STORE_NAME } from '../../store';

const {
	components: {
		ToggleControl,
	},
	data: {
		dispatch,
		useSelect,
	},
	i18n: {
		__,
	}
} = window[ 'wp' ];

/**
 * Set component const to export toggle edit ui.
 */
const ToggleEditing = () => {

	// Set state dependency.
	const {
		isEditing,
		viewport,
	} = useSelect( ( select ) => {
		return {
			isEditing: select( STORE_NAME ).isEditing(),
			viewport: select( STORE_NAME ).getViewport(),
		}
	} );

	// Set dispatcher.
	const dispatcher = dispatch( STORE_NAME );

	/**
	 * Set function to fire on click.
	 */
	const onChange = () => {
		if( ! isEditing ) {
			dispatcher.setEditing();
		} else {
			dispatcher.unsetEditing();
		}
	}

	// Set classNames by states.
	const classNames = [ 'qp-viewports-toggle-edit' ];
	if( isEditing ) {
		classNames.push( 'is-editing' );
	}

	// Render component.
	return (
		<ToggleControl
			className={ classNames }
			label={ __( 'Edit on min-width', 'quantum-viewports' ) + ': ' + viewport + 'px' }
			onChange={ onChange }
			checked={ isEditing }
		/>
	);
}

export default ToggleEditing;
