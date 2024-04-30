import { STORE_NAME } from '../store/constants';
import { svgs } from './svgs';


const {
	components: {
		ToolbarButton,
	},
	data: {
		select,
		dispatch,
		useSelect,
	},
	i18n: {
		__,
	}
} = window[ 'wp' ];

/**
 * Set component const to export toggle edit ui.
 *
 * @since 0.1.0
 */
const ToggleEdit = () => {

	// Set state dependency.
	const {
		isActive,
		isEditing,
	} = useSelect( ( select ) => {
		return {
			isActive: select( STORE_NAME ).isActive(),
			isEditing: select( STORE_NAME ).isEditing(),
		}
	} );

	// Set dispatcher.
	const dispatcher = dispatch( STORE_NAME );

	/**
	 * Set function to fire on click.
	 *
	 * @since 0.2.3
	 */
	const onClick = () => {
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

	// Set classNames by states.
	const classNames = [ 'qp-viewports-toggle-editing' ];
	if( isEditing ) {
		classNames.push( 'is-editing' );
	}

	// Render component.
	return (
		<ToolbarButton
			className={ classNames }
			icon={ svgs.edit }
			label={ __( 'Edit viewport settings', 'quantum-viewports' ) }
			onClick={ onClick }
		/>
	);
}

export default ToggleEdit;
