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
 * Set component const to export indicator ui.
 *
 * @param object props
 *
 * @since 0.1.0
 */
const Indicator = ( props ) => {
	const {
		clientId,
		attributes,
	} = props;

	const storeId = attributes?.tempId !== clientId ? clientId : attributes?.tempId;

	const {
		isEditing
	} = useSelect( ( select ) => {
		return {
			isEditing: select( STORE_NAME ).isEditing(),
		}
	} );

	const store = dispatch( STORE_NAME );
	const isActive = select( STORE_NAME ).isActive();

	const onClick = () => {
		if( ! isActive ) {
			store.setLoading();
		}

		if( isEditing ) {
			store.unsetEditing();
		} else {
			store.setEditing();
		}
	}

	const classNames = [ 'qp-viewports-indicator' ];
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

export default Indicator;
