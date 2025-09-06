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
		createContext,
		useContext,
	}
} = window[ 'wp' ];


/**
 * React hook to synchronize the device type and viewport state
 * between the editor and a viewports store.
 *
 * This hook ensures that the `deviceType` in the WordPress editor
 * stays consistent with the active viewport size (desktop, tablet, mobile)
 * and with a custom store that tracks viewport changes.
 *
 * ### Behavior
 * - Listens for changes in the Gutenberg editor's `deviceType`.
 * - Listens for changes in the `viewport` and `iframeViewport` from the custom store.
 * - Automatically dispatches updates to both the custom store and the Gutenberg editor
 * to ensure synchronization across contexts.
 * - Prevents infinite loops of updates using an internal `ignore` flag.
 *
 * ### Returned Value
 * Currently returns an empty array. This may be extended in the future
 * to expose state or handlers.
 *
 * ### Side Effects
 * - Updates `deviceType` in the Gutenberg editor via `core/editor` store.
 * - Updates `viewportType` in the custom store defined by `STORE_NAME`.
 *
 * @returns {Array} Currently an empty array (placeholder for future expansion).
 */
function useDeviceTypeInternal() : DeviceTypeValue {

	// Select state from the viewports store and core/editor.
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


	// Sync when Gutenberg device type changes.
	useLayoutEffect( () => {
		if( ignore ) {
			setIgnore( false );
			return;
		}

		if( 'desktop' === sanitizedDeviceType && sanitizedDeviceType !== prevDeviceType ) {
			setIgnore( true );
			setPrevDeviceType( sanitizedDeviceType );
			storeDispatch.setViewportType( sanitizedDeviceType );
			// console.log( 'changed deviceType - desktop', ignore, sanitizedDeviceType );
		}

		if( 'tablet' === sanitizedDeviceType && sanitizedDeviceType !== prevDeviceType ) {
			setIgnore( true );
			setPrevDeviceType( sanitizedDeviceType );
			storeDispatch.setViewportType( sanitizedDeviceType );
			// console.log( 'changed deviceType - tablet', ignore, sanitizedDeviceType );
		}

		if( 'mobile' === sanitizedDeviceType && sanitizedDeviceType !== prevDeviceType ) {
			setIgnore( true );
			setPrevDeviceType( sanitizedDeviceType );
			storeDispatch.setViewportType( sanitizedDeviceType );
			// console.log( 'changed deviceType - mobile', ignore, sanitizedDeviceType );
		}

	}, [ deviceType ] );


	// Sync when viewport changes while the store is active.
	useLayoutEffect( () => {
		if( ignore ) {
			setIgnore( false );
			return;
		}

		if( viewport !== prevViewport && isActive && isInDesktopRange( viewport ) && deviceType !== 'Desktop' ) {
			setIgnore( true );
			editorDispatch.setDeviceType( 'Desktop' );
			// console.log( 'changed viewport - Desktop', ignore );
		}

		if( viewport !== prevViewport && isActive && isInTabletRange( viewport ) && deviceType !== 'Tablet' ) {
			setIgnore( true );
			editorDispatch.setDeviceType( 'Tablet' );
			// console.log( 'changed viewport - tablet', ignore );
		}

		if( viewport !== prevViewport && isActive && isInMobileRange( viewport ) && deviceType !== 'Mobile' ) {
			setIgnore( true );
			editorDispatch.setDeviceType( 'Mobile' );
			// console.log( 'changed viewport - mobile', ignore );
		}

	}, [ viewport ] );


	// Sync when iframe viewport changes while the store is inactive.
	useLayoutEffect( () => {
		if( ignore ) {
			setIgnore( false );
			return;
		}

		if( viewport !== prevViewport && ! isActive && isInDesktopRange( viewport ) && deviceType !== 'Desktop' ) {
			setIgnore( true );
			editorDispatch.setDeviceType( 'Desktop' );
			// console.log( 'changed iframeViewport - desktop', ignore );
		}

		if( viewport !== prevViewport && isActive && isInTabletRange( viewport ) && deviceType !== 'Tablet' ) {
			setIgnore( true );
			editorDispatch.setDeviceType( 'Tablet' );
			// console.log( 'changed iframeViewport - tablet', ignore );
		}

		if( viewport !== prevViewport && isActive && isInMobileRange( viewport ) && deviceType !== 'Mobile' ) {
			setIgnore( true );
			editorDispatch.setDeviceType( 'Mobile' );
			// console.log( 'changed iframeViewport - mobile', ignore );
		}

	}, [ iframeViewport ] );

	// Return state and setter placeholder.
	return [ deviceType ];
};


type DeviceTypeValue = [ string ];

const DeviceTypeContext = createContext<DeviceTypeValue | null>(null);

type ProviderProps = { children: any };

export function DeviceTypeProvider({ children }: ProviderProps) {
	const value = useDeviceTypeInternal();

	return (
		<DeviceTypeContext.Provider value={value}>
			{children}
		</DeviceTypeContext.Provider>
	);
}


export function useDeviceType(): DeviceTypeValue {
	const ctx = useContext( DeviceTypeContext );

	// console.log( 'ctx', ctx );

	if ( ! ctx ) {
		console.warn( 'useDeviceType used outside DeviceTypeProvider' );
		return null;
	}

	return ctx;
}
