import { useLongPress } from '../utils';
import { STORE_NAME } from '../store';
import { mobile, tablet, desktop } from './svgs';
import ToggleInspecting from './toggle/inspecting';

const {
	components: {
		Button,
		Icon,
	},
	data: {
		useSelect,
		useDispatch,
	},
	i18n: {
		__,
	}
} = window[ 'wp' ];

/**
 * Set component const to export topbar ui.
 *
 * @param object props
 *
 * @since 0.1.0
 */
const Topbar = () => {

	// Set dispatch.
	const dispatch = useDispatch( STORE_NAME );

	// Set states.
	const props = useSelect( ( select: Function ) => {
		const store = select( STORE_NAME );

		return {
			isActive: store.isActive(),
			viewport: store.getViewport(),
			desktop: store.getDesktop(),
			inDesktopRange: store.inDesktopRange(),
			tablet: store.getTablet(),
			inTabletRange: store.inTabletRange(),
			mobile: store.getMobile(),
			inMobileRange: store.inMobileRange(),
			isInspecting: store.isInspecting(),
			inspectorPosition: store.getInspectorPosition(),
		}
	}, [] );


	// Set event default options for shorthand longpress action.
	const defaultOptions = {
		shouldPreventDefault: true,
		delay: 500,
	};

	// Set events and classNames for desktop.
	const desktopEvents = useLongPress( dispatch.setDesktop, dispatch.toggleDesktop, defaultOptions );
	let classNamesDesktop = 'qp-viewport-shorthand desktop';
	if ( props.desktop === props.viewport ) {
		classNamesDesktop = `${ classNamesDesktop } active`;
	}
	if ( props.inDesktopRange ) {
		classNamesDesktop = `${ classNamesDesktop } in-range`;
	}

	// Set events and classNames for tablet.
	const tabletEvents = useLongPress( dispatch.setTablet, dispatch.toggleTablet, defaultOptions );
	let classNamesTablet = 'qp-viewport-shorthand tablet';
	if ( props.tablet === props.viewport ) {
		classNamesTablet = `${ classNamesTablet } active`;
	}
	if ( props.inTabletRange ) {
		classNamesTablet = `${ classNamesTablet } in-range`;
	}

	// Set events and classNames for mobile.
	const mobileEvents = useLongPress( dispatch.setMobile, dispatch.toggleMobile, defaultOptions );
	let classNamesMobile = 'qp-viewport-shorthand mobile';
	if ( props.mobile === props.viewport ) {
		classNamesMobile = `${ classNamesMobile } active`;
	}
	if ( props.inMobileRange ) {
		classNamesMobile = `${ classNamesMobile } in-range`;
	}

	// Break if we are not allow to show.
	if( ! props.isActive ) {
		return null;
	}

	// Set classNames of prev and next.
	let classNamesPrev = 'qp-viewport-shorthand prev';
	let classNamesNext = 'qp-viewport-shorthand next';

	// Set maxWidth of editor frame to calculate zoom.
	const $ui = document.querySelector( '.interface-interface-skeleton__content' );
	const maxWidth = $ui ? $ui.getBoundingClientRect().width : 0;

	// Calculate zoom.
	let zoom = 100;
	if ( props.viewport > maxWidth ) {
		zoom = Math.round( ( maxWidth - 80 ) / props.viewport * 10000 ) / 100; // 80 = margin left & right of scaled editor frame.
	}


	/**
	 * Set function to handle prev action.
	 *
	 * @since 0.1.0
	 */
	const onClickPrev = () => {
		dispatch.setPrevViewport();
	}


	/**
	 * Set function to handle prev action.
	 *
	 * @since 0.1.0
	 */
	const onClickNext = () => {
		dispatch.setNextViewport();
	}


	// Render component.
	return (
		<div className="qp-viewports-topbar">
			<div className="qp-viewports-actions left">
				{ ! props.isInspecting && 'left' === props.inspectorPosition && ( <ToggleInspecting showText={ true } forceShow={ true } /> ) }
				<span className="chosen-zoom">Zoom: { zoom.toString().replace( '.', ',' ) }%</span>
			</div>
			<div className="qp-viewports-shorthands">
				<Button
					className={ classNamesPrev }
					onClick={ onClickPrev }
					icon="arrow-left"
				/>
				<Button
					className={ classNamesMobile }
					{ ... mobileEvents }
				>
					<Icon icon={ mobile }/>
				</Button>
				<Button
					className={ classNamesTablet }
					{ ... tabletEvents }
				>
					<Icon icon={ tablet }/>
				</Button>
				<Button
					className={ classNamesDesktop }
					{ ... desktopEvents }
				>
					<Icon icon={ desktop }/>
				</Button>
				<Button
					className={ classNamesNext }
					icon="arrow-right"
					onClick={ onClickNext }
				/>
			</div>
			<div className="qp-viewports-actions right">
				{ ! props.isInspecting && 'right' === props.inspectorPosition && ( <ToggleInspecting showText={ true } forceShow={ true } /> ) }
			</div>
		</div>
	);
}

export default Topbar;
