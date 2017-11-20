const PluginManager = require( '../src/PluginManager' );
const chai = require( 'chai' );
const expect = chai.expect;

describe( 'PluginManager', () => {
	it( 'is a class', () => {
		expect( PluginManager ).to.be.a( 'function' );
	} );
} );
