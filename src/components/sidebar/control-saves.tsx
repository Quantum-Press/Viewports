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
 * Set component const to export sidebar control-saves ui.
 *
 * @param object props
 *
 * @since 0.1.0
 */
const ControlSaves = () => {

	// Set state dependencies.
	const {
		isExpanded,
		selected,
	} = useSelect( ( select : Function ) => {
		return {
			isExpanded: select( STORE_NAME ).isExpanded(),
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
	const hasBlockSaves = select( STORE_NAME ).hasBlockSaves( clientId );

	// Set useEffect to handle refresh on update.
	useEffect( () => {
		if( ! update ) {
			return;
		}

		setUpdate( false );

		if( ! hasBlockSaves ) {
			setOpen( false );
		}
	}, [ update ] );

	// Break if we are not allow to show.
	if( null === clientId ) {
		return null;
	}

	// Setup styles to show.
	const blockSaves = select( STORE_NAME ).getBlockSaves( clientId );

	/**
	 * Set funtion to toggle control content.
	 *
	 * @since 0.1.0
	 */
	const onClickControl = () => {
		setOpen( hasBlockSaves && ! open ? true : false );
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

		dispatch( STORE_NAME ).removeBlockSaves( clientId, props, viewport );
		setUpdate( true );
	}

	// Setup classNames.
	let classNames = 'qp-viewports-sidebar-control saves';
	if( hasBlockSaves ) {
		classNames = classNames + ' has';
	}
	if( open ) {
		classNames = classNames + ' open';
	}

	return (
		<div className={ classNames }>
			<div className="qp-viewports-sidebar-control-toggle" onClick={ onClickControl }>
				<div className="qp-viewports-sidebar-control-icon">
					<Icon icon="database-view"></Icon>
				</div>

				{ isExpanded && <div className="qp-viewports-sidebar-control-label">
					{ __( 'Block saves', 'quantum-viewports' ) }
				</div> }
			</div>

			{ open &&
				<div className="qp-viewports-sidebar-control-content">
					{ 'object' === view &&
						<div className="qp-viewports-style-object-tree">
							<code className="object-tree">
								{ Object.entries( blockSaves ).map( ( style, index ) => {
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
	)
}

export default ControlSaves;