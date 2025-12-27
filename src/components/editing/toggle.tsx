import { STORE_NAME } from '@quantum-viewports/store';

const {
    components: {
        ToggleControl,
    },
    data: {
        dispatch,
        useSelect,
    },
    i18n: {
        __,
    }
} = window[ 'wp' ];

/**
 * Set component const to export toggle edit ui.
 */
export const ToggleEditing = () => {

    // Set state dependency.
    const {
        isActive,
        isEditing,
        viewport,
        iframeViewport,
    } = useSelect( ( select ) => {
        const store = select( STORE_NAME );

        return {
            isActive: store.isActive(),
            isEditing: store.isEditing(),
            viewport: store.getViewport(),
            iframeViewport: store.getIframeViewport(),
        }
    } );

    // Set dispatcher.
    const dispatcher = dispatch( STORE_NAME );

    /**
     * Set function to fire on click.
     */
    const onChange = () => {
        if ( ! isEditing ) {
            dispatcher.setEditing();
        } else {
            dispatcher.unsetEditing();
        }
    }

    // Set classNames by states.
    const classNames = [ 'qp-viewports-toggle-edit' ];
    if ( isEditing ) {
        classNames.push( 'is-editing' );
    }

    // console.log( 'isActive', isActive, 'viewport', viewport, 'iframeViewport', iframeViewport );
    const minWidth = isActive ? viewport : iframeViewport;

    // Render component.
    return (
        <ToggleControl
            className={ classNames }
            label={ __( 'Edit on min-width', 'quantum-viewports' ) + ': ' + minWidth + 'px' }
            onChange={ onChange }
            checked={ isEditing }
        />
    );
}
