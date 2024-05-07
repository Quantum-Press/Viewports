import { useIsMounted } from '../hooks';

const {
	element: {
		useState,
		useEffect,
		useRef,
	}
} = window[ 'wp' ];

export type Size = {
	width: number | undefined
	height: number | undefined
}

export type UseResizeObserverOptions<T extends HTMLElement = HTMLElement> = {
	selector: string,
	onResize?: ( size: Size ) => void
	box?: 'border-box' | 'content-box' | 'device-pixel-content-box'
}

const initialSize: Size = {
	width: undefined,
	height: undefined,
}

export function useResizeObserver<T extends HTMLElement = HTMLElement>(
	options: UseResizeObserverOptions<T>,
): Size {
	const { selector, box = 'content-box' } = options;
	const $element = useRef<HTMLElement>( document.querySelector( selector ) );
	const observer = useRef<ResizeObserver>( null );

	const [ { width, height }, setSize ] = useState<Size>( initialSize );
	const [ reset, setReset ] = useState<Boolean>( false );

	const isMounted = useIsMounted();
	const previousSize = useRef<Size>( { ...initialSize } );
	const onResize = useRef<( ( size : Size ) => void ) | undefined>( undefined );
	onResize.current = options.onResize;

	// Set useEffect to handle iframe resets.
	useEffect( () => {
		if( ! reset ) {
			return;
		}

		if( null !== observer.current ) {
			observer.current.disconnect();
		}

		$element.current = document.querySelector( selector );

		observer.current = getObserver();
		observer.current.observe( $element.current, { box } )

		setReset( false );
	}, [ reset ] );

	// Set useEffect to handle changes on settings.
	useEffect( () => {
		if( typeof window === 'undefined' || ! ( 'ResizeObserver' in window ) ) {
			return;
		}

		$element.current = document.querySelector( selector );

		if( null !== observer.current ) {
			observer.current.disconnect();
		}

		observer.current = getObserver();
		observer.current.observe( $element.current, { box } )

		return () => {
			observer.current.disconnect()
		}

	}, [ box, $element, isMounted ] )

	// Build observer.
	const getObserver = () => {
		return new ResizeObserver( ( [ entry ] ) => {
			if( ! entry[ 'target' ].isConnected ) {
				setReset( true );
				return;
			}

			const boxProp =
				box === 'border-box'
				? 'borderBoxSize'
				: box === 'device-pixel-content-box'
					? 'devicePixelContentBoxSize'
					: 'contentBoxSize'


			const newWidth = extractSize( entry, boxProp, 'inlineSize' );
			const newHeight = extractSize( entry, boxProp, 'blockSize' );

			const hasChanged = previousSize.current.width !== newWidth || previousSize.current.height !== newHeight;

			if( hasChanged ) {
				const newSize: Size = { width: newWidth, height: newHeight }

				previousSize.current.width = newWidth
				previousSize.current.height = newHeight

				if( onResize.current ) {
					onResize.current( newSize )
				} else {
					if( isMounted() ) {
						setSize( newSize )
					}
				}
			}
		} )
	}

	return { width, height }
}

type BoxSizesKey = keyof Pick<
	ResizeObserverEntry,
	'borderBoxSize' | 'contentBoxSize' | 'devicePixelContentBoxSize'
>

function extractSize(
	entry: ResizeObserverEntry,
	box: BoxSizesKey,
	sizeType: keyof ResizeObserverSize,
) : number | undefined {

	if ( ! entry[ box ] ) {
		if ( box === 'contentBoxSize' ) {
			return entry.contentRect[ sizeType === 'inlineSize' ? 'width' : 'height' ]
		}

		return undefined
	}

	return Array.isArray( entry[ box ] )
		? entry[ box ][ 0 ][ sizeType ]
		: // @ts-ignore Support Firefox's non-standard behavior
		( entry[ box ][ sizeType ] as number )
}

export default useResizeObserver;