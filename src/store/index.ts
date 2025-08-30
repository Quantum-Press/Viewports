import { ensureObjectPath } from '../utils';
import reducerManager from './reducer';
import * as selectors from './selectors';
import * as actions from './actions';
import { STORE_NAME } from './constants';

const {
	reducer,
	addReducer
} = reducerManager;

const {
	data: {
		createReduxStore,
		register,
	}
} = window[ 'wp' ];


/**
 * Link datastore addReducer to open up datastore to 3rd party plugins.
 */
Object.assign( ensureObjectPath( window, [ 'qp', 'viewports', 'addReducer' ] ), addReducer );


/**
 * Set data store configuration.
 *
 * @see https://github.com/WordPress/gutenberg/blob/HEAD/packages/data/README.md#registerStore
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
 */
export const store = createReduxStore( STORE_NAME, {
	... storeConfig,
} );


/**
 * Register created store.
 *
 * @see https://github.com/WordPress/gutenberg/blob/HEAD/packages/data/README.md#createReduxStore
 */
register( store );


/**
 * Export constants.
 */
export { DEFAULT_STATE } from './default';
export { STORE_NAME } from './constants';


/**
 * Export utils.
 */
export * from './utils';


/**
 * Export generator.
 */
export { Generator } from './generator';
