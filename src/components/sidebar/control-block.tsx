import { STORE_NAME } from '../../store/constants';
import { svgs } from '../svgs';

const {
	components: {
		ClipboardButton,
		Icon,
	},
	data: {
		dispatch,
		useSelect,
	},
	element: {
		useState,
	},
	i18n: {
		__,
	}
} = window[ 'wp' ];

/**
 * Set component const to export sidebar control-block ui.
 *
 * @param object props
 *
 * @since 0.1.0
 */
const ControlBlock = () => {

	// Set state dependencies.
	const {
		isInspecting,
		selected,
	} = useSelect( ( select : Function ) => {
		const store = select( STORE_NAME );

		return {
			isInspecting: store.isInspecting(),
			selected: select( 'core/editor' ).getSelectedBlock(),
		}
	}, [] );

	// Set internal states.
	const [ hasCopied, setHasCopied ] = useState( false );

	// Setup clientId.
	const clientId = selected !== null ? selected.clientId : null;

	// Break if we are not allow to show.
	if( null === selected ) {
		return null;
	}

	let classNames = 'qp-viewports-sidebar-control block';

	return (
		<div className={ classNames }>
			<div className="qp-viewports-sidebar-control-toggle">
				<div className="qp-viewports-sidebar-control-icon">
					<ClipboardButton
						text={ clientId }
						onCopy={ () => setHasCopied( true ) }
						onFinishCopy={ () => setHasCopied( false ) }
					>
						<Icon icon="block-default"></Icon>
					</ClipboardButton>
				</div>

				{ isInspecting &&
					<div className="qp-viewports-sidebar-control-label">
						{ hasCopied &&
							<span>{ __( 'Copied clientID', 'quantum-viewports' ) }</span>
						}
						{ ! hasCopied &&
							<span>{ 'ClientID: ' + clientId.split( '-' ).shift() }</span>
						}
						{ ! hasCopied &&
							<ClipboardButton
								text={ clientId }
								onCopy={ () => setHasCopied( true ) }
								onFinishCopy={ () => setHasCopied( false ) }
							>
								<Icon icon="edit-page"></Icon>
							</ClipboardButton>
						}
					</div>
				}
			</div>
		</div>
	);
}

export default ControlBlock;