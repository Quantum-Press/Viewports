import { STORE_NAME } from '@viewports/store';

const {
	data: {
		useSelect,
	}
} = window[ 'wp' ];

/**
 * React component: Body
 *
 * Applies or removes CSS class names on the `<body>` element
 * based on the current editor viewport state.
 *
 * This is a passive render-only component with no UI output.
 * It listens to store state changes and synchronizes DOM classes
 * for styling or functional purposes in global CSS.
 *
 * @returns {null} - No visual output; directly manipulates DOM state.
 *
 * @example
 * // Automatically updates <body> classes like:
 * // - is-active-viewports
 * // - is-editing-viewports
 * <Body />
 */
export function Body() {

	// Set states.
	const {
		isActive,
		isEditing,
	} = useSelect( ( select: Function ) => {
		const store = select( STORE_NAME );

		return {
			isActive: store.isActive(),
			isEditing: store.isEditing(),
		}
	}, [] );

	if( isActive && ! document.body.classList.contains( 'is-active-viewports' ) ) {
		document.body.classList.add( 'is-active-viewports' );
	}

	if( ! isActive && document.body.classList.contains( 'is-active-viewports' ) ) {
		document.body.classList.remove( 'is-active-viewports' );
	}

	if( isEditing && ! document.body.classList.contains( 'is-editing-viewports' ) ) {
		document.body.classList.add( 'is-editing-viewports' );
	}

	if( ! isEditing && document.body.classList.contains( 'is-editing-viewports' ) ) {
		document.body.classList.remove( 'is-editing-viewports' );
	}

	return null;
}