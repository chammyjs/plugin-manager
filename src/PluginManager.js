/**
 * @external {Plugin} https://github.com/chammyjs/plugin-helper
 */

import { Plugin } from '@chammy/plugin-helper';
import { isString } from './utils.js';
import { makeGlobPromise } from './utils.js';

/**
 * Simple plugin manager for Chammy.js.
 * It's responsible for finding and loading plugins.
 */
class PluginManager {
	constructor() {
		/**
		 * Iterable set of all loaded plugins.
		 *
		 * @type {Set<Plugin>}
		 */
		this.plugins = new Set();
	}

	/**
	 * Find packages matching the given names.
	 *
	 * @param {string|string[]} patterns Glob patterns.
	 * @param {string} path Path in which the search will be done.
	 * @throws {TypeError}
	 * @returns {Promise<string[],Error>} Promise resolving to array of paths.
	 */
	find( patterns, path = process.cwd() ) {
		if ( !isString( patterns ) && ( !Array.isArray( patterns ) || !patterns.every( isString ) ) ) {
			throw new TypeError( 'pattern parameter must be a string or an array of strings' );
		}

		if ( !isString( path ) ) {
			throw new TypeError( 'path parameter must be a string' );
		}

		if ( isString ( patterns ) ) {
			patterns = [ patterns ];
		}

		const promises = patterns.map( ( pattern ) => {
			return makeGlobPromise( pattern, path );
		} );

		return Promise.all( promises ).then( ( result ) => {
			return result.reduce( ( all, current ) => {
				return all.concat( current );
			}, [] );
		} );
	}

	/**
	 * Load given plugins.
	 *
	 * @param {string[]} plugins Names of plugins to load.
	 * @throws {TypeError}
	 * @returns {Promise<Plugin[],TypeError>} Promise resolving to array of plugin classes.
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

			this.plugins.add( module );

			return module;
		} );

		return Promise.all( loaded );
	}

	/**
	 * Find packages matching given patterns and load them.
	 *
	 * @param {string|string[]} patterns Glob patterns.
	 * @param {string} path Path in which the search will be done.
	 * @returns {Promise<Plugin[],TypeError>} Promise resolving to array of plugin classes.
	 */
	findAndLoad( patterns, path = process.cwd() ) {
		return this.find( patterns, path ).then( ( paths ) => {
			return this.load( paths );
		} );
	}

	/**
	 * Allows to iterate over all plugins loaded by given
	 * PluginManager instance.
	 *
	 * @returns {Iterator} Iterator for {@link PluginManager#plugins} property.
	 */
	[ Symbol.iterator ]() {
		return this.plugins[ Symbol.iterator ]();
	}
}

export default PluginManager;
