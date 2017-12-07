import PluginManager from '../../src/PluginManager.js';
import { Plugin } from '@chammy/plugin-helper';
import { join } from 'path';
import { expect } from 'chai';

function createParameterTest( { invalid = [], test = () => {}, errorType = TypeError, errorMsg = '' } = {} ) {
	return () => {
		invalid.forEach( ( param ) => {
			expect( () => {
				test( param );
			} ).to.throw( errorType, errorMsg );
		} );
	};
}

function createMethodTest( object, method ) {
	return () => {
		expect( object ).to.have.property( method );
		expect( object[ method ] ).to.be.a( 'function' );
	};
}

function createLoadTest( paths, pluginsPropertyValue ) {
	return () => {
		const pluginManager = new PluginManager();

		return pluginManager.load( paths ).then( ( plugins ) => {
			expect( plugins ).to.be.an( 'array' );
			expect( plugins ).to.have.lengthOf( paths.length );

			plugins.forEach( ( plugin ) => {
				expect( Reflect.getPrototypeOf( plugin ) ).to.equal( Plugin );
			} );

			expect( [ ...pluginManager.plugins ] ).to.deep.equal( pluginsPropertyValue || plugins );
		} );
	};
}

function createFindPathTest( { patterns = '', path = undefined, expected = [] } = {} ) {
	return () => {
		const pluginManager = new PluginManager();

		return pluginManager.find( patterns, path ).then( ( paths ) => {
			expect( paths ).to.be.an( 'array' );
			expect( paths ).to.have.lengthOf( expected.length );
			expect( paths ).to.have.members( expected );
		} );
	};
}

function getPath( name ) {
	return `${ join(  __dirname, '..', name ) }`;
}

export { createParameterTest };
export { createMethodTest };
export { createLoadTest };
export { createFindPathTest };
export { getPath };
