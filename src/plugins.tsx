import {
    KeyframesToggle,
} from '@quantum-viewports/components';
import { DeviceTypeProvider } from '@quantum-viewports/hooks';

const {
    plugins: {
        registerPlugin,
    },
} = window[ 'wp' ];

/**
 * Register preview dropdown extension.
 */
registerPlugin( 'quantum-viewports-device-type', {
    render: DeviceTypeProvider,
} );

registerPlugin( 'quantum-viewports-keyframes-toggle', {
    render: KeyframesToggle,
} );
