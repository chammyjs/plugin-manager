import glob from 'glob';

/**
 * Check if given parameter is a string.
 *
 * @private
 * @param {mixed} value Value to be checked.
 * @returns {boolean} Return true if passed value is a string,
 * false otherwise.
 */
function isString( value ) {
	return typeof value === 'string';
}

/**
 * Wrap glob invocation into {@link Promise}.
 *
 * @private
 * @param {string} pattern Glob pattern.
 * @param {string} path Path, in which search should begin.
 * @returns {Promise<string[],Error>} Promise resolving to found
 * file paths.
 */
function makeGlobPromise( pattern, path ) {
	return new Promise( ( resolve, reject ) => {
		glob( pattern, {
			cwd: path,
			absolute: true
		}, ( err, files ) => {
			if ( err ) {
				reject( err );
			}

			resolve( files );
		} );
	} );
}

export { isString };
export { makeGlobPromise };
