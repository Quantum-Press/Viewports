import type { deviceType } from '@quantum-viewports/types';
import {
    STORE_NAME,
    isInMobileRange,
    isInTabletRange,
    isInDesktopRange,
    hasSpectrumSetViewportType
} from '@quantum-viewports/store';
import { Pointer } from './pointer';
import { IndicatorPopup } from './popup';
import {
    desktop,
    mobile,
    tablet
} from '@quantum-viewports/components';

const {
    components: {
        Button,
        Icon,
    },
    data: {
        select,
        useSelect,
        useDispatch,
    },
    element: {
        useState,
    },
    i18n: {
        __,
    }
} = window[ 'wp' ];

export type IndicatorProps = {
    storeId: string,
    property: Array<string>|string,
};


/**
 * Set component const to export inspector ui.
 */
export const Indicator = ( { storeId, property }: IndicatorProps ) => {
    const editorDispatch = useDispatch( 'core/editor' );

    // Extract use select depending properties.
    const {
        isEditing,
        isInspecting,
        iframeViewport,
        viewport,
    } = useSelect( ( select ) => {
        const store = select( STORE_NAME );
        const editorStore = select( 'core/editor' );

        return {
            isActive: store.isActive(),
            isEditing: store.isEditing(),
            isInspecting: store.isInspecting(),
            viewport: store.getViewport(),
            iframeViewport: store.getIframeViewport(),
            deviceType: editorStore.getDeviceType(),
            lastEdit: store.getLastEdit(),
        }
     }, [] );

    // Set spectrumSet.
    const spectrumSet = select( STORE_NAME ).getPropertySpectrumSet( storeId, property );

    // Set spectrumSet indicators.
    const hasTabletSpectrum = spectrumSet.length ? hasSpectrumSetViewportType( 'Tablet', spectrumSet ) : false;
    const hasDesktopSpectrum = spectrumSet.length ? hasSpectrumSetViewportType( 'Desktop', spectrumSet ) : false;

    // Set visibility state of controls.
    const [ isVisible, setIsVisible ] = useState( false );


    /**
     * Set function to handle toggle.
     */
    const handleClick = ( deviceType : deviceType ) => {
        const check = 0 === viewport ? iframeViewport : viewport;

        if (
            ( 'Mobile' === deviceType && ! isInMobileRange( check ) ) ||
            ( 'Tablet' === deviceType && ! isInTabletRange( check ) ) ||
            ( 'Desktop' === deviceType && ! isInDesktopRange( check ) )
        ) {
            editorDispatch.setDeviceType( deviceType );

            if ( ! isVisible ) {
                setIsVisible( true );
            }

        } else if ( ! isVisible ) {
            setIsVisible( true );
        } else {
            setIsVisible( false );
        }
    }


    /**
     * Set function to return className by size.
     *
     * @param {string} size
     *
     * @return {string}
     */
    const getClassName = ( size ) : string => {
        const className = [ 'qp-viewports-indicator', size ];
        const check = 0 === viewport ? iframeViewport : viewport;

        switch ( size ) {
            case 'Mobile' :
                if ( isEditing ) {
                    className.push( 'is-editing' );

                    if ( isInMobileRange( check ) ) {
                        className.push( 'is-active' );
                    }
                }

                for ( let index = 0; index < spectrumSet.length; index++ ) {
                    const spectrum = spectrumSet[ index ];

                    if ( 0 === spectrum.from || isInMobileRange( spectrum.from ) ) {
                        if ( spectrum.hasSaves ) {
                            className.push( 'has-saves' );
                        }

                        if ( spectrum.hasRemoves ) {
                            className.push( 'has-removes' );
                        }

                        if ( spectrum.hasChanges ) {
                            className.push( 'has-changes' );
                        }
                    }
                }

                break;

            case 'Tablet' :
                if ( isEditing ) {
                    className.push( 'is-editing' );

                    if ( isInTabletRange( check ) ) {
                        className.push( 'is-active' );
                    }
                }

                for ( let index = 0; index < spectrumSet.length; index++ ) {
                    const spectrum = spectrumSet[ index ];

                    if ( isInMobileRange( spectrum.from ) ) {
                        continue;
                    }

                    if ( isInTabletRange( spectrum.from ) ) {
                        if ( spectrum.hasSaves ) {
                            className.push( 'has-saves' );
                        }

                        if ( spectrum.hasRemoves ) {
                            className.push( 'has-removes' );
                        }

                        if ( spectrum.hasChanges ) {
                            className.push( 'has-changes' );
                        }
                    }
                }

                break;

            case 'Desktop' :
                if ( isEditing ) {
                    className.push( 'is-editing' );

                    if ( isInDesktopRange( check ) ) {
                        className.push( 'is-active' );
                    }
                }

                for ( let index = 0; index < spectrumSet.length; index++ ) {
                    const spectrum = spectrumSet[ index ];

                    if ( isInMobileRange( spectrum.from ) || isInTabletRange( spectrum.from ) ) {
                        continue;
                    }

                    if ( isInDesktopRange( spectrum.from ) ) {
                        if ( spectrum.hasSaves ) {
                            className.push( 'has-saves' );
                        }

                        if ( spectrum.hasRemoves ) {
                            className.push( 'has-removes' );
                        }

                        if ( spectrum.hasChanges ) {
                            className.push( 'has-changes' );
                        }
                    }
                }

                break;
        }

        return className.join( ' ' );
    }

    // Set classNames for each viewport wrap size.
    const classNamesMobile = getClassName( 'Mobile' );
    const classNamesTablet = getClassName( 'Tablet' );
    const classNamesDesktop = getClassName( 'Desktop' );

    // Render component.
    return (
        <div className="qp-viewports-indicator-wrap">
            <div className={ classNamesMobile }>
                <Pointer
                    deviceType="Mobile"
                    isEditing={ isEditing }
                    iframeViewport={ 0 === viewport ? iframeViewport : viewport }
                    hasTabletSpectrum={ hasTabletSpectrum }
                    hasDesktopSpectrum={ hasDesktopSpectrum }
                />
                <Button
                    onClick={ () => {
                        handleClick( 'Mobile' );
                    } }
                >
                    <Icon
                        icon={ mobile }
                    />
                </Button>
            </div>
            <div className={ classNamesTablet }>
                <Pointer
                    deviceType="Tablet"
                    isEditing={ isEditing }
                    iframeViewport={ 0 === viewport ? iframeViewport : viewport }
                    hasTabletSpectrum={ hasTabletSpectrum }
                    hasDesktopSpectrum={ hasDesktopSpectrum }
                />
                <Button
                    onClick={ () => {
                        handleClick( 'Tablet' );
                    } }
                >
                    <Icon
                        icon={ tablet }
                    />
                </Button>
                { ! isInspecting && <IndicatorPopup
                    isVisible={ isVisible }
                    setIsVisible={ setIsVisible }
                    storeId={ storeId }
                    spectrumSet={ spectrumSet }
                /> }
            </div>
            <div className={ classNamesDesktop }>
                <Pointer
                    deviceType="Desktop"
                    isEditing={ isEditing }
                    iframeViewport={ 0 === viewport ? iframeViewport : viewport }
                    hasTabletSpectrum={ hasTabletSpectrum }
                    hasDesktopSpectrum={ hasDesktopSpectrum }
                />
                <Button
                    onClick={ () => {
                        handleClick( 'Desktop' );
                    } }
                >
                    <Icon
                        icon={ desktop }
                    />
                </Button>
            </div>
        </div>
    );
}

window[ 'qp' ] = window[ 'qp' ] || {};
window[ 'qp' ].viewports = window[ 'qp' ].viewports || {};
window[ 'qp' ].viewports.IndicatorPanelItem = Indicator;

export * from './panelitem';
