import {
	STORE_NAME,
	isInDesktopRange,
	isInMobileRange,
	isInTabletRange,
} from '@viewports/store';

const {
	data: {
		useSelect,
		useDispatch,
	},
	element: {
		useEffect,
		useState,
	}
} = window[ 'wp' ];

/**
 * Set function to return overflow hook
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

	useEffect( () => {
		if( ignore ) {
			setIgnore( false );
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

		// console.log( 'changed deviceType', ignore );

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

		// console.log( 'changed viewport', ignore );

	}, [ viewport ] );

	useEffect( () => {
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

		// console.log( 'changed iframeViewport', ignore );

	}, [ iframeViewport ] );

	/*
	useEffect( () => {
		if( ignore ) {
			setIgnore( false );
		}
	}, [ ignore ] );
	*/

	// console.log( 'return', viewport, iframeViewport, deviceType, ignore );

	// Return state and setter.
	return [];
};

export default useDeviceType;
