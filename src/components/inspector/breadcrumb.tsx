const {
	data: {
		dispatch,
		useSelect,
	},
	i18n: {
		__,
	}
} = window[ 'wp' ];

/**
 * Set component const to export sidebar control-edit ui.
 */
const Breadcrumb = () => {

	// Set state dependencies.
	const {
		selected,
	} = useSelect( ( select : Function ) => {
		return {
			selected: select( 'core/block-editor' ).getSelectedBlock(),
		}
	}, [] );

	// Set selected ClientID.
	const clientId = selected ? selected.clientId : null;


	/**
	 * Set function to fire on click root.
	 */
	const onClickRoot = () => {
		dispatch( 'core/block-editor' ).selectBlock( false );
	}

	// Render component.
	return (
		<ul className="qp-viewports-inspector-breadcrumb">
			<li><span onClick={ onClickRoot }>{ __( 'Blocks', 'viewports' ) }</span></li>
			{ clientId && <li><span>{ selected.name }</span></li> }
		</ul>
	);
}

export default Breadcrumb;