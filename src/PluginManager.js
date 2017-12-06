const { Plugin } = require( '@chammy/plugin-helper' );

function isString( value ) {
	return typeof value === 'string';
}


class PluginManager {
	constructor() {
		this.plugins = [];
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
