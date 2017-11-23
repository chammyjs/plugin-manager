const PluginManager = require( '../src/PluginManager' );
const chai = require( 'chai' );
const expect = chai.expect;

describe( 'PluginManager', () => {
	it( 'is a class', () => {
		expect( PluginManager ).to.be.a( 'function' );
	} );

	it( 'has own property plugins', () => {
		const pluginManager = new PluginManager();

		expect( pluginManager ).to.have.own.property( 'plugins' );
		expect( pluginManager.plugins ).to.be.an( 'array' );
	} );

	it( 'exposes iterator', () => {
		expect( PluginManager.prototype ).to.have.property( Symbol.iterator );
	} );

	describe( 'iterator', () => {
		it( 'iterates through plugins property', () => {
			const pluginManager = new PluginManager();
			const samplePlugins = [ 1, 2, 3 ];

			pluginManager.plugins = samplePlugins;

			expect( [ ...pluginManager ] ).to.deep.equal( samplePlugins );
		} );
	} );
} );
