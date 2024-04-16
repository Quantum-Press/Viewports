import { svgs } from '../svgs';

const {
	components: {
		ToolbarButton,
	},
	i18n: {
		__,
	}
} = window[ 'wp' ];

/**
 * Set component const to export inspector ui.
 *
 * @param object props
 *
 * @since 0.2.1
 */
const InspectorToolbar = ( props ) => {
	const {
		clientId,
		attributes,
	} = props;

	// Set storeId.
	const storeId = attributes?.tempId !== clientId ? clientId : attributes?.tempId;


	/**
	 * Set function to fire on click inspect to trigger ui.
	 *
	 * @since 0.2.1
	 */
	const onClickInspect = () => {
		console.log( 'onClick' );
	}

	// Set button classnames.
	const classNames = [ 'qp-viewports-inspector-toolbar' ];

	// Render component.
	return (
		<ToolbarButton
			className={ classNames }
			icon={ svgs.inspect }
			label={ __( 'Inspect styles', 'quantum-viewports' ) }
			onClick={ onClickInspect }
		/>
	);
}

export default InspectorToolbar;
