const {
	data: {
		useSelect,
	},
	element: {
		useEffect,
		useState,
	}
} = window[ 'wp' ];

/**
 * Set function to return overflow hook
 */
export function useEditorSidebar() {

	// Set initial state.
	const [ tab, setTab ] = useState( false );

	// Set useSelect dependencies.
	const {
		selected,
	} = useSelect( ( select ) => {
		return {
			selected: select( 'core/block-editor' ).getSelectedBlock(),
		}
	}, [] );


	// Set selectors.
	const selectorTabSettings = '[id^="tabs-"][id$="-settings"]';
	const selectorTabStyles = '[id^="tabs-"][id$="-styles"]';


	// Set dependencies to wp store.
	const {
		isEditorSidebarOpened,
	} = useSelect( select => {
		return {
			isEditorSidebarOpened: select( 'core/edit-post').isEditorSidebarOpened(),
		};
	} );


	/**
	 * Set function to return active tab name.
	 */
	const getActiveTab = () => {
		if( document.querySelectorAll( selectorTabSettings + '[data-active-item]' ).length ) {
			return 'settings';
		}

		if( document.querySelectorAll( selectorTabStyles + '[data-active-item]' ).length ) {
			return 'styles';
		}

		return false;
	}


	// Set useEffect to handle sidebar opening state.
	useEffect( () => {
		if( ! isEditorSidebarOpened ) {
			setTab( false );
		} else {
			setTab( getActiveTab() );
		}

		return () => {
			setTab( false );
		}

	}, [ isEditorSidebarOpened, selected ] );


	/**
	 * Set function to handle event register.
	 */
	const setEvents = () => {
		const settings = document.querySelector( selectorTabSettings );
		const styles = document.querySelector( selectorTabStyles );

		if( settings ) {
			settings.addEventListener( 'click', handleTabClick );
		}

		if( styles ) {
			styles.addEventListener( 'click', handleTabClick );
		}
	}


	/**
	 * Set function to handle click.
	 */
	const handleTabClick = () => {
		setTab( getActiveTab() );
	}


	setEvents();


	// Return state and setter.
	return [ tab, setTab ];
};

export default useEditorSidebar;
