import { STORE_NAME } from '../../store/constants';
import StyleObject from './style-object';

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
		useState,
		useEffect,
	},
	i18n: {
		__,
	}
} = window[ 'wp' ];

/**
 * Set component const to export sidebar control-valids ui.
 *
 * @param object props
 *
 * @since 0.1.0
 */
const ControlValids = () => {

	// Set state dependencies.
	const {
		isInspecting,
		selected,
	} = useSelect( ( select : Function ) => {
		return {
			isInspecting: select( STORE_NAME ).isInspecting(),
			selected: select( 'core/editor' ).getSelectedBlock(),
		}
	}, [] );

	// Set internal states.
	const [ open, setOpen ] = useState( false );
	const [ view, setView ] = useState( 'object' );
	const [ update, setUpdate ] = useState( false );

	// Setup clientId.
	const clientId = selected !== null ? selected.clientId : null;

	// Setup has indicator.
	const hasBlockValids = select( STORE_NAME ).hasBlockValids( clientId );

	// Set useEffect to handle refresh on update.
	useEffect( () => {
		if( ! update ) {
			return;
		}

		setUpdate( false );

		if( ! hasBlockValids ) {
			setOpen( false );
		}
	}, [ update ] );

	// Break if we are not allow to show.
	if( null === selected ) {
		return null;
	}

	// Setup styles to show.
	const blockValids = select( STORE_NAME ).getBlockValids( clientId );

	/**
	 * Set funtion to toggle control content.
	 *
	 * @since 0.1.0
	 */
	const onClickControl = () => {
		setOpen( hasBlockValids && ! open ? true : false );
	}

	// Setup classNames.
	let classNames = 'qp-viewports-sidebar-control valids';
	if( hasBlockValids ) {
		classNames = classNames + ' has';
	}
	if( open ) {
		classNames = classNames + ' open';
	}

	return (
		<div className={ classNames }>
			<div className="qp-viewports-sidebar-control-toggle" onClick={ onClickControl }>
				<div className="qp-viewports-sidebar-control-icon">
					<Icon icon="admin-customizer"></Icon>
				</div>

				{ isInspecting &&
					<div className="qp-viewports-sidebar-control-label">
						{ __( 'Rendered styles', 'quantum-viewports' ) }
					</div>
				}
			</div>

			{ open &&
				<div className="qp-viewports-sidebar-control-content">
					{ 'object' === view &&
						<div className="qp-viewports-style-object-tree">
							<code className="object-tree">
								{ Object.entries( blockValids ).map( ( style, index ) => {
									const origKeys = [];
									const baseKeys = [ index ];

									return <StyleObject
										key={ baseKeys.join( '-' ) }
										origKeys={ origKeys }
										baseKeys={ baseKeys }
										styleKey={ style[0] }
										styleValue={ style[1] }
										onClickFunction={ () => {} }
									/>
								}) }
							</code>
						</div>
					}
				</div>
			}
		</div>
	)
}

export default ControlValids;