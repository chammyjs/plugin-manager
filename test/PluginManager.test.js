const PluginManager = require( '../src/PluginManager' );
const chai = require( 'chai' );
const { join } = require( 'path' );
const expect = chai.expect;

function getPath( name ) {
	return `${ join(  __dirname, name ) }`;
}

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

	it( 'exposes load method', () => {
		expect( PluginManager.prototype ).to.have.property( 'load' );
		expect( PluginManager.prototype.load ).to.be.a( 'function' );
	} );

	describe( 'iterator', () => {
		it( 'iterates through plugins property', () => {
			const pluginManager = new PluginManager();
			const samplePlugins = [ 1, 2, 3 ];

			pluginManager.plugins = samplePlugins;

			expect( [ ...pluginManager ] ).to.deep.equal( samplePlugins );
		} );
	} );

	describe( 'load', () => {
		it( 'accepts only array of string as parameter', () => {
			const pluginManager = new PluginManager();
			const invalid = [
				'test',
				1,
				undefined,
				null,
				{},
				[ 1, 2 ],
				[ null ]
			];

			invalid.forEach( ( param ) => {
				expect( () => {
					pluginManager.load( param );
				} ).to.throw( TypeError, 'Parameter must be an array of strings' );
			} );
		} );

		it( 'returns Promise with resolved modules array', () => {
			const pluginManager = new PluginManager();

			return pluginManager.load( [ getPath( './fixtures/test' ) ] ).then( ( plugins ) => {
				expect( plugins ).to.be.an( 'array' );
				expect( plugins ).to.have.lengthOf( 1 );
			} );
		} );
	} );
} );
