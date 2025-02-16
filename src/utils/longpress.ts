const {
	useCallback,
	useRef,
	useState
} = window[ 'React' ];


/**
 * Set function to handle longpress events.
 *
 * @param  {function} onLongPress                  [description]
 * @param  {function} onClick                      [description]
 * @param  {boolean}  options.shouldPreventDefault [description]
 * @param  {integer}  options.delay                [description]
 *
 * @return {object}
 */
export const useLongPress = ( onLongPress: Function, onClick: Function, { shouldPreventDefault = true, delay = 300 } = {} ) => {
	const [ longPressTriggered, setLongPressTriggered ] = useState( false );

	const timeout = useRef<ReturnType<typeof setTimeout>>();
	const target  = useRef<HTMLElement>();

	const start = useCallback( ( event: { target: HTMLElement | undefined; } ) => {
		if ( shouldPreventDefault && event.target ) {
			event.target.addEventListener( "touchend", preventDefault, { passive: false });

			target.current = event.target;
		}

		timeout.current = setTimeout( () => {
			onLongPress( event );
			setLongPressTriggered( true );
		}, delay );

	}, [ onLongPress, delay, shouldPreventDefault ] );

	const clear = useCallback( ( shouldTriggerClick = true ) => {
		timeout.current && clearTimeout( timeout.current );
		shouldTriggerClick && ! longPressTriggered && onClick();
		setLongPressTriggered( false );

		if ( shouldPreventDefault && target.current ) {
			target.current.removeEventListener( "touchend", preventDefault );
		}

	}, [shouldPreventDefault, onClick, longPressTriggered] );

	return {
		onMouseDown: ( e: { target: any; } ) => start( e ),
		onTouchStart: ( e: { target: any; } ) => start( e ),
		onMouseUp: () => clear(),
		onMouseLeave: () => clear( false ),
		onTouchEnd: () => clear()
	};
};


/**
 * Set function to indicate touch events by given event object.
 *
 * @param {object} event
 *
 * @return {boolean}
 */
const isTouchEvent = ( event : Event ) => {
	return "touches" in event;
};


/**
 * Set function to prevent default event bubbling.
 *
 * @param {object} event
 *
 * @return {boolean}
 */
const preventDefault = ( event : TouchEvent ) => {
	if ( ! isTouchEvent( event ) ) return;

	if ( event.touches.length < 2 && event.preventDefault ) {
		event.preventDefault();
	}
};
