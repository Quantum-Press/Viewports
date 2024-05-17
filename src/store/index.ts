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


/**
 * Export store types.
 *
 * @since 0.2.3
 */
export type * from './types';


/**
 * Export utils.
 *
 * @since 0.2.7
 */
export * from './utils';


/**
 * Export constants.
 *
 * @since 0.2.5
 */
export { STORE_NAME } from './constants';

/**
 * Export generator.
 *
 * @since 0.2.5
 */
export { Generator } from './generator';