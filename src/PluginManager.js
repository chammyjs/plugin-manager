const glob = require( 'glob' );
const { Plugin } = require( '@chammy/plugin-helper' );

function isString( value ) {
	return typeof value === 'string';
}

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


class PluginManager {
	constructor() {
		this.plugins = [];
	}

	/**
	 * Find packages matching the given names
	 * @param {string} pattern Glob pattern.
	 * @param {string} path Path in which the search will be done.
	 * @returns {Promise}
	 */
	find( pattern, path = process.cwd() ) {
		if ( !isString( pattern ) ) {
			throw new TypeError( 'Pattern must be a string' );
		}

		return makeGlobPromise( pattern, path );
	}

	/**
	 * Load given plugins.
	 *
	 * @param {string[]} plugins Names of plugins to load.
	 * @returns {Promise}
	 */
	load( plugins ) {
		if ( !Array.isArray( plugins ) || !plugins.every( isString ) ) {
			throw new TypeError( 'Parameter must be an array of strings' );
		}

		const loaded = plugins.map( ( plugin ) => {
			const module = require( plugin );

			if ( Reflect.getPrototypeOf( module ) !== Plugin ) {
				return Promise.reject( new TypeError( 'Plugins must extend Plugin class' ) );
			}

			return module;
		} );

		return Promise.all( loaded );
	}

	[ Symbol.iterator ]() {
		return this.plugins[ Symbol.iterator ]();
	}
}

module.exports = PluginManager;
