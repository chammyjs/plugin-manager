const PluginManager = require( '../src/PluginManager' );
const { Plugin } = require( '@chammy/plugin-helper' );
const chai = require( 'chai' );
const chaiAsPromised = require( 'chai-as-promised' );
const { join } = require( 'path' );
const expect = chai.expect;

chai.use( chaiAsPromised );

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

	it( 'exposes find method', () => {
		expect( PluginManager.prototype ).to.have.property( 'find' );
		expect( PluginManager.prototype.find ).to.be.a( 'function' );
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
				expect( Reflect.getPrototypeOf( plugins[ 0 ] ) ).to.equal( Plugin );
			} );
		} );

		it( 'rejects if loaded module is not extending Plugin', () => {
			const pluginManager = new PluginManager();

			return expect( pluginManager.load( [ getPath( './fixtures/invalid' ) ] ) ).
				to.be.eventually.rejectedWith( TypeError, 'Plugins must extend Plugin class' );
		} );
	} );

	describe( 'find', () => {
		it( 'accepts only string or array of strings as 1. parameter', () => {
			const pluginManager = new PluginManager();
			const invalid = [
				1,
				undefined,
				null,
				{},
				[ 1, 2 ],
				[ null ],
			];

			invalid.forEach( ( param ) => {
				expect( () => {
					pluginManager.find( param );
				} ).to.throw( TypeError, 'pattern parameter must be a string or an array of strings' );
			} );
		} );

		it( 'returns Promise with absolute paths to found packages (string)', () => {
			const pluginManager = new PluginManager();

			return pluginManager.find( '@test/*/', getPath( './fixtures' ) ).then( ( paths ) => {
				expect( paths ).to.be.an( 'array' );
				expect( paths ).to.deep.equal( [ getPath( './fixtures/@test/package' ) ] );
			} );
		} );

		it( 'returns Promise with absolute paths to found packages (array of strings)', () => {
			const pluginManager = new PluginManager();
			const expected = [
				getPath( './fixtures/@test/package' ),
				getPath( './fixtures/test-1' ),
				getPath( './fixtures/test-2' )
			];

			return pluginManager.find( [ '@test/*/', 'test-*' ], getPath( './fixtures' ) ).then( ( paths ) => {
				expect( paths ).to.be.an( 'array' );
				expect( paths ).to.have.lengthOf( 3 );
				expect( paths ).to.have.members( expected );
			} );
		} );

	} );
} );
