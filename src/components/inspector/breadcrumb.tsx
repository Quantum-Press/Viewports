import { STORE_NAME } from '../../store/constants';
import { svgs } from '../svgs';

const {
	components: {
		Icon,
	},
	data: {
		select,
		dispatch,
		useSelect,
	},
	element: {
		useEffect,
	},
	i18n: {
		__,
	}
} = window[ 'wp' ];

/**
 * Set component const to export sidebar control-edit ui.
 *
 * @param object props
 *
 * @since 0.2.2
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
	 *
	 * @since 0.2.2
	 */
	const onClickRoot = () => {
		dispatch( 'core/block-editor' ).selectBlock( false );
	}

	return (
		<ul className="qp-viewports-inspector-breadcrumb">
			<li><span onClick={ onClickRoot }>{ __( 'Blocks', 'quantum-viewports' ) }</span></li>
			{ clientId && <li><span>{ selected.name }</span></li> }
		</ul>
	);
}

export default Breadcrumb;