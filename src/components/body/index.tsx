import { STORE_NAME } from '@quantum-viewports/store';

const {
	data: {
		useSelect,
	}
} = window[ 'wp' ];

/**
 * Export component that fires events for dirty and saving state changes.
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
