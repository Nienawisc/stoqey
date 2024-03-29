import debug from 'debug';
import _get from 'lodash/get';

const appName = _get(process.env, 'APP_NAME', 'stoqey');

const libraryPrefix = appName;

/**
 * Use to log in general case
 */
export const log = debug(`${libraryPrefix}:info`);

/**
 * Use for verbose log
 */
export const verbose = debug(`${libraryPrefix}:verbose`);
