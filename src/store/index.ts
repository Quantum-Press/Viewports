import reducer from './reducer';
import * as selectors from './selectors';
import * as actions from './actions';
import { STORE_NAME } from './constants';

const {
	data: {
		createReduxStore,
		register,
	}
} = window[ 'wp' ];


/**
 * Set data store configuration.
 *
 * @see https://github.com/WordPress/gutenberg/blob/HEAD/packages/data/README.md#registerStore
 *
 * @since 0.1.0
 */
export const storeConfig = {
	reducer,
	selectors,
	actions,
};


/**
 * Set created redux store.
 *
 * @see https://github.com/WordPress/gutenberg/blob/HEAD/packages/data/README.md#createReduxStore
 *
 * @since 0.1.0
 */
export const store = createReduxStore( STORE_NAME, {
	... storeConfig,
} );


/**
 * Register created store.
 *
 * @see https://github.com/WordPress/gutenberg/blob/HEAD/packages/data/README.md#createReduxStore
 *
 * @since 0.1.0
 */
register( store );
