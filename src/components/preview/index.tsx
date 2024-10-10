import { useResizeEditor } from "../../hooks/use-resize-editor";
import ToggleView from '../toggle/view';
import ToggleEdit from '../toggle/edit';
import { STORE_NAME } from "../../store";

const {
	data: {
		useSelect,
	},
	element: {
		createPortal,
		useEffect,
		useLayoutEffect,
		useState,
		useCallback,
	},
	i18n: {
		__,
	}
} = window['wp'];

const buttonSelector = '.editor-header__settings .editor-preview-dropdown button';
const menugroupSelector = '.components-dropdown-menu__popover .components-menu-group:first-child';
const injectedSelector = '.components-dropdown-menu__popover .qp-viewports-injected-preview';



const Portal = ( { setInjected } ) => {
	useEffect( () => {
		return () => {
			setTimeout( () => {
				setInjected( false );
			}, 1 );
		}
	}, [] );

	return (
		<>
			<ToggleEdit />
			<ToggleView />
		</>
	);
}


/**
 * Set function to return overflow hook
 *
 * @since 0.2.16
 */
export const Preview = () => {
	const [ injected, setInjected ] = useState( false );
	const [ reset, setReset ] = useState( false );

	useEffect( () => {
		setTimeout( () => {
			if( ! injected && document.querySelector( menugroupSelector ) ) {
				setInjected( true );
			}
		}, 1 );
	}, [ injected ] );


	useEffect( () => {
		if( ! reset ) {
			return;
		}

		setReset( false );
	}, [ reset ] );

	const props = useSelect( ( select ) => {
		const selected = select( 'core/block-editor' ).getSelectedBlock();
		const viewport = select( STORE_NAME ).getViewport();

		return {
			selected,
			viewport,
		}
	} );

	const onClickView = useCallback( () => {
		const $button = document.querySelector( buttonSelector );

		if( $button ) {
			if( ! $button.classList.contains( 'is-opened' ) ) {
				setTimeout( () => {
					setInjected( true );
				}, 1 );
			} else {
				setInjected( false );
			}
		} else {
			setInjected( false );
		}

		setReset( true );

	}, [] );

	const addEvent = useCallback( () => {
		const $button = document.querySelector( buttonSelector );

		if( $button ) {
			$button.addEventListener( 'click', onClickView );
		}
	}, [ onClickView ] );

	const removeEvent = useCallback( () => {
		const $button = document.querySelector( buttonSelector );

		if( $button ) {
			$button.removeEventListener( 'click', onClickView );
		}
	}, [ onClickView ] );

	// Handle focusout event to unmount the portal
	const handleFocusOut = useCallback( ( event ) => {
		if( ! injected || event.target.classList.contains( 'editor-preview-dropdown__toggle' ) ) {
			return;
		}

		setTimeout( () => {
			const $popover = document.querySelector( '.components-dropdown-menu__popover' );

			if( $popover && ! $popover.contains( event.relatedTarget ) ) {
				setInjected( false );
			}
		}, 1 );
	}, []);

	useEffect( () => {
		addEvent();

		// Add focusout listener to handle when the popover loses focus
		document.addEventListener( 'focusout', handleFocusOut );

		return () => {
			removeEvent();
			document.removeEventListener( 'focusout', handleFocusOut );
		};
	}, [ addEvent, removeEvent, handleFocusOut ] );

	if( ! injected ) {
		return null;
	}

	let $menugroup = document.querySelector( menugroupSelector );
	let $injected = document.querySelector( injectedSelector );

	if( $menugroup && ! $injected ) {
		const newElement = document.createElement( 'div' );
		newElement.classList.add( 'qp-viewports-injected-preview' );

		$menugroup.after( newElement );

		$injected = document.querySelector( injectedSelector );
	}

	if( ! $injected ) {
		return null;
	}

	return createPortal(
		<Portal
			setInjected={ setInjected }
		/>,
		$injected
	);
}

export default Preview;