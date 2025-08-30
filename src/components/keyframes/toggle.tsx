import { STORE_NAME } from "../../store";
import { keyframe } from "../svgs";

const {
	data: {
		dispatch,
		useSelect,
	},
	editor: {
		PluginPreviewMenuItem
	},
	i18n: {
		__,
	}
} = window[ 'wp' ];

const KeyframesToggle = () => {

	// Set state dependency.
	const {
		isActive,
	} = useSelect( ( select ) => {
		const store = select( STORE_NAME );

		return {
			isActive: store.isActive(),
		}
	} );

	// Set dispatcher.
	const dispatcher = dispatch( STORE_NAME );

	/**
	 * Set function to fire on click viewport simulation.
	 */
	const onClickViewport = () => {
		if( ! isActive ) {
			dispatcher.setActive();
		} else {
			dispatcher.unsetActive();
		}
	}

	// Set classname with active state.
	let className = 'qp-viewports-keyframes-toggle';
	if ( isActive ) {
		className += ' active';
	}

	return (
		<>
			<PluginPreviewMenuItem
				icon={ keyframe }
				className={ className }
				onClick={ onClickViewport }
			>
				{ isActive ? __( 'Hide keyframes', 'viewports' ) : __( 'Show keyframes', 'viewports' ) }
			</PluginPreviewMenuItem>
		</>
	)
}

export default KeyframesToggle;