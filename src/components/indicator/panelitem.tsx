import {
    Indicator,
} from '.';

const {
    blockEditor: {
        InspectorControls,
    },
    components: {
        __experimentalToolsPanelItem: ToolsPanelItem,
    },
    i18n: {
        __,
    }
} = window[ 'wp' ];

export type IndicatorPanelItemProps = {
    storeId: string,
    property: Array<string>|string,
    groupId?: string,
    panelId?: string,
};

/**
 * Set component const to export indicator panelitem.
 */
export const IndicatorPanelItem = ( { storeId, property, groupId = undefined, panelId = undefined }: IndicatorPanelItemProps ) => {
    const parentPanelId = '' !== panelId ? panelId : storeId;
    const prop = Array.isArray( property ) ? property.join( '-' ) : property;

    return (
        <>
            { groupId && <InspectorControls group={ groupId }>
                <ToolsPanelItem
                    panelId={ parentPanelId }
                    className={ "qp-viewports-indicator-controls property-" + prop }
                    hasValue={ () => { return true } }
                    label={ __( 'Viewports', 'quantum-viewports' ) }
                    isShownByDefault={ true }
                    onDeselect={ () => {} }
                >
                    <Indicator
                        storeId={ storeId }
                        property={ property }
                    />
                </ToolsPanelItem>
            </InspectorControls> }
            { ! groupId && <ToolsPanelItem
                className={ "qp-viewports-indicator-controls property-" + prop }
                hasValue={ () => { return true } }
                label={ __( 'Viewports', 'quantum-viewports' ) }
                isShownByDefault={ true }
                onDeselect={ () => {} }
            >
                <Indicator
                    storeId={ storeId }
                    property={ property }
                />
            </ToolsPanelItem> }
        </>
    );
}

window[ 'qp' ] = window[ 'qp' ] || {};
window[ 'qp' ].viewports = window[ 'qp' ].viewports || {};
window[ 'qp' ].viewports.IndicatorPanelItem = IndicatorPanelItem;
