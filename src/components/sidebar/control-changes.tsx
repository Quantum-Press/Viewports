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
		useDispatch,
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
 * Set component const to export sidebar control-edit ui.
 *
 * @param object props
 *
 * @since 0.1.0
 */
const ControlChanges = () => {

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
	const hasBlockChanges = select( STORE_NAME ).hasBlockChanges( clientId );

	// Set useEffect to handle refresh on update.
	useEffect( () => {
		if( ! update ) {
			return;
		}

		setUpdate( false );

		if( ! hasBlockChanges ) {
			setOpen( false );
		}
	}, [ update ] );

	// Break if we are not allow to show.
	if( null === selected ) {
		return null;
	}

	// Setup styles to show.
	const blockChanges = select( STORE_NAME ).getBlockChanges( clientId );

	/**
	 * Set funtion to toggle control content.
	 *
	 * @since 0.1.0
	 */
	const onClickControl = () => {
		setOpen( hasBlockChanges && ! open ? true : false );
	}

	/**
	 * Set function to fire on click remove.
	 *
	 * @param {array} keys
	 *
	 * @since 0.1.0
	 */
	const onClickRemove = ( keys : Array<any> ) => {
		const props = [ ... keys ];
		const viewport = parseInt( props.shift() );

		dispatch( STORE_NAME ).removeBlockChanges( clientId, props, viewport );
		setUpdate( true );
	}

	// Setup classNames.
	let classNames = 'qp-viewports-sidebar-control changes';
	if( hasBlockChanges ) {
		classNames = classNames + ' has';
	}
	if( open ) {
		classNames = classNames + ' open';
	}

	return (
		<div className={ classNames }>
			<div className="qp-viewports-sidebar-control-toggle" onClick={ onClickControl }>
				<div className="qp-viewports-sidebar-control-icon">
					<Icon icon="database-add"></Icon>
				</div>

				{ isInspecting &&
					<div className="qp-viewports-sidebar-control-label">
						{ __( 'Block changes', 'quantum-viewports' ) }
					</div>
				}
			</div>

			{ open &&
				<div className="qp-viewports-sidebar-control-content">
					{ 'object' === view &&
						<div className="qp-viewports-style-object-tree">
							<code className="object-tree">
								{ Object.entries( blockChanges ).map( ( style, index ) => {
									const origKeys = [];
									const baseKeys = [ index ];

									return <StyleObject
										key={ baseKeys.join( '-' ) }
										origKeys={ origKeys }
										baseKeys={ baseKeys }
										styleKey={ style[0] }
										styleValue={ style[1] }
										onClickFunction={ onClickRemove }
									/>
								}) }
							</code>
						</div>
					}
				</div>
			}
		</div>
	);
}

export default ControlChanges;