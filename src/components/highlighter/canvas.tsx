import { STORE_NAME } from '../../store/constants';

const {
	data: {
		useSelect,
	},
	element: {
		useEffect,
		useState,
		useRef,
	}
} = window[ 'wp' ];

// Set dpi for calculating.
const dpi = window.devicePixelRatio;

/**
 * Set component const to export Canvas UI.
 *
 * @param object props
 *
 * @since 0.1.0
 */
const Canvas = ({ selectors }) => {

	// Set states.
	const [ selectorData, setSelectorData ] = useState( [] );
	const [ resize, setResize ] = useState( false );

	// Set references.
	const canvasRef = useRef();

	// Set timeouts.
	var timeoutDraw;
	var timeoutResize;


	// UseEffect to handle mount / unmount component
	// to handle resize event and canvas init.
	useEffect( () => {
		scaleCanvas();

		// Set resize event listener on component mount.
		window.addEventListener( 'resize', () => { handleResize() } );

		// Cleanup resize event listener on component unmount.
		return () => {
			window.removeEventListener( 'resize', () => { handleResize() } );
		};

	}, [] );


	// Function to update selector data on resize.
	const handleResize = () => {
		clearTimeout( timeoutResize );
		clearCanvas();

		timeoutResize = setTimeout( () => {
			scaleCanvas();

			setResize( true );
		}, 500 );
	};


	// UseEffect to update selectorData on resize.
	useEffect( () => {
		if( ! resize ) {
			return;
		}

		updateSelectorData();
		setResize( false );
	}, [ resize ] );


	// UseEffect to update selectorData.
	useEffect( () => {
		clearTimeout( timeoutResize );
		clearCanvas();

		timeoutResize = setTimeout( () => {
			setResize( true );
		}, 500 );
	}, [ selectors ] );


	// UseEffect to draw.
	useEffect( () => {
		clearTimeout( timeoutDraw );

		timeoutDraw = setTimeout( drawCanvas, 0 );
	}, [ selectorData ]);


	// Function to update selector data.
	const updateSelectorData = () => {
		const dataset = Object.values( selectors );
		const update = dataset.map( data => { return setElementData( data ) } );

		// Update state.
		setSelectorData( update );
	}


	// Function to set element data.
	const setElementData = ( data ) => {
		const element = document.querySelector( data.selector );

		if( element ) {
			const rect = element.getBoundingClientRect();

			return {
				... data,
				width: rect.width,
				height: rect.height,
				top: ( rect.top + window.scrollY ),
				left: ( rect.left + window.scrollX ),
			}
		}

		return data;
	}


	// Function to draw in canvas.
	const drawCanvas = () => {
		const canvas = canvasRef.current;
		const ctx = canvas.getContext( '2d' );

		ctx.clearRect( 0, 0, canvas.width, canvas.height );

		// Draw the outlines for each selector.
		selectorData.forEach( data => {
			if( 'target' === data.type ) {
				animateTargetFrame( ctx, data );
			}
		});
	}


	// Function to animate target.
	const animateTargetFrame = ( ctx, data ) => {
		const duration = 952;

		let count = 1;
		let startTime = performance.now();

		// Function to draw target frame.
		const drawTargetFrame = () => {
			const currentTime = performance.now();
			const elapsed = currentTime - startTime;
			const progress = Math.min( elapsed / duration, 1 );

			clearCanvas();

			const widthFirst  = progress > 0 ? progress * 5 + 15 : 15;
			const widthSecond = progress > 0 ? progress * 5 + 10 : 10;
			const widthLast   = progress > 0 ? progress * 5 + 5 : 5;

			const opacityFirst = 1 - progress;
			const opacityLast  = progress;

			drawTarget( ctx, data, widthFirst, opacityFirst );
			drawTarget( ctx, data, widthSecond, 1 );
			drawTarget( ctx, data, widthLast, opacityLast );

			// We loop for infitity.
			if( 1 === progress ) {
				startTime = performance.now();
				count--;
			}

			if( 0 < count ) {
				requestAnimationFrame( drawTargetFrame );
			}
		}

		requestAnimationFrame( drawTargetFrame );
	}


	// Function to draw target outlines.
	const drawTarget = ( ctx, data, width, opacity ) => {

		// Draw top left corner.
		ctx.beginPath();
		ctx.strokeStyle = "rgb(221, 130, 59, " + opacity + ")";
		ctx.lineWidth = 1;
		ctx.moveTo( data.left - width, data.top + width );
		ctx.lineTo( data.left - width, data.top - width );
		ctx.lineTo( data.left + width, data.top - width );
		ctx.stroke();

		// Draw top right corner.
		ctx.beginPath();
		ctx.strokeStyle = "rgb(221, 130, 59, " + opacity + ")";
		ctx.lineWidth = 1;
		ctx.moveTo( data.left + data.width - width, data.top - width );
		ctx.lineTo( data.left + data.width + width, data.top - width );
		ctx.lineTo( data.left + data.width + width, data.top + width );
		ctx.stroke();

		// Draw bottom right corner.
		ctx.beginPath();
		ctx.strokeStyle = "rgb(221, 130, 59, " + opacity + ")";
		ctx.lineWidth = 1;
		ctx.moveTo( data.left + data.width + width, data.top + data.height - width );
		ctx.lineTo( data.left + data.width + width, data.top + data.height + width );
		ctx.lineTo( data.left + data.width - width, data.top + data.height + width );
		ctx.stroke();

		// Draw bottom left corner.
		ctx.beginPath();
		ctx.strokeStyle = "rgb(221, 130, 59, " + opacity + ")";
		ctx.lineWidth = 1;
		ctx.moveTo( data.left + width, data.top + data.height + width );
		ctx.lineTo( data.left - width, data.top + data.height + width );
		ctx.lineTo( data.left - width, data.top + data.height - width );
		ctx.stroke();
	}


	const scaleCanvas = () => {
		const canvas = canvasRef.current;
		const ctx = canvas.getContext( '2d' );

		ctx.scale( dpi, dpi );
	}


	const clearCanvas = () => {
		const canvas = canvasRef.current;
		const ctx = canvas.getContext( '2d' );

		ctx.clearRect( 0, 0, canvas.width, canvas.height );
	}


	return (
		<canvas
			className="quantum-viewports-highlighter"
			ref={ canvasRef }
			width={ window.innerWidth * dpi }
			height={ window.innerHeight * dpi }
			style={{
				position: 'fixed',
				width: window.innerWidth,
				height: window.innerHeight,
				top: 0,
				left: 0,
				pointerEvents: 'none',
				zIndex: 1000,
			}}
		/>
	)
};

export default Canvas;