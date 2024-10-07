import { isInDesktopRange, isInMobileRange, isInTabletRange, STORE_NAME } from "../store";

const {
	data: {
		useSelect,
		useDispatch,
	},
	element: {
		useEffect,
		useLayoutEffect,
		useState,
	}
} = window[ 'wp' ];

/**
 * Set function to return overflow hook
 *
 * @since 0.2.16
 */
export function useDeviceType() {

	// Set useSelect.
	const {
		isActive,
		viewport,
		iframeViewport,
		deviceType,
	} = useSelect( ( select: Function ) => {
		const store = select( STORE_NAME );

		return {
			isActive: store.isActive(),
			viewport: store.getViewport(),
			iframeViewport: store.getIframeViewport(),
			deviceType: select( 'core/editor' ).getDeviceType(),
		}
	}, [] );

	const sanitizedDeviceType = deviceType.toLowerCase();
	const [ prevDeviceType, setPrevDeviceType ] = useState( 'desktop' );
	const [ prevViewport, setPrevViewport ] = useState( viewport );
	const [ ignore, setIgnore ] = useState( false );

	const storeDispatch = useDispatch( STORE_NAME );
	const editorDispatch = useDispatch( 'core/editor' );

	useLayoutEffect( () => {
		if( ignore ) {
			setIgnore( false );
			return;
		}

		if( 'desktop' === sanitizedDeviceType && sanitizedDeviceType !== prevDeviceType ) {
			setPrevDeviceType( sanitizedDeviceType );
			storeDispatch.setViewportType( sanitizedDeviceType );
		}

		if( 'tablet' === sanitizedDeviceType && sanitizedDeviceType !== prevDeviceType ) {
			setPrevDeviceType( sanitizedDeviceType );
			storeDispatch.setViewportType( sanitizedDeviceType );
		}

		if( 'mobile' === sanitizedDeviceType && sanitizedDeviceType !== prevDeviceType ) {
			setPrevDeviceType( sanitizedDeviceType );
			storeDispatch.setViewportType( sanitizedDeviceType );
		}

	}, [ deviceType ] );

	useEffect( () => {
		if( viewport !== prevViewport && isActive && isInDesktopRange( viewport ) && deviceType !== 'Desktop' ) {
			setIgnore( true );
			editorDispatch.setDeviceType( 'Desktop' );
		}

		if( viewport !== prevViewport && isActive && isInTabletRange( viewport ) && deviceType !== 'Tablet' ) {
			setIgnore( true );
			editorDispatch.setDeviceType( 'Tablet' );
		}

		if( viewport !== prevViewport && isActive && isInMobileRange( viewport ) && deviceType !== 'Mobile' ) {
			setIgnore( true );
			editorDispatch.setDeviceType( 'Mobile' );
		}

	}, [ viewport ] );

	useLayoutEffect( () => {
		if( viewport !== prevViewport && ! isActive && isInDesktopRange( viewport ) && deviceType !== 'Desktop' ) {
			setIgnore( true );
			editorDispatch.setDeviceType( 'Desktop' );
		}

		if( viewport !== prevViewport && isActive && isInTabletRange( viewport ) && deviceType !== 'Tablet' ) {
			setIgnore( true );
			editorDispatch.setDeviceType( 'Tablet' );
		}

		if( viewport !== prevViewport && isActive && isInMobileRange( viewport ) && deviceType !== 'Mobile' ) {
			setIgnore( true );
			editorDispatch.setDeviceType( 'Mobile' );
		}

	}, [ iframeViewport ] );

	useLayoutEffect( () => {
		if( ignore ) {
			setIgnore( false );
		}
	}, [ ignore ] );

	// Return state and setter.
	return [];
};

export default useDeviceType;
