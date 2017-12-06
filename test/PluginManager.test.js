const PluginManager = require( '../src/PluginManager' );
const { Plugin } = require( '@chammy/plugin-helper' );
const chai = require( 'chai' );
const chaiAsPromised = require( 'chai-as-promised' );
const { join } = require( 'path' );
const expect = chai.expect;

chai.use( chaiAsPromised );

function createParameterTest( { invalid = [], test = () => {}, errorType = TypeError, errorMsg = '' } = {} ) {
	return () => {
		invalid.forEach( ( param ) => {
			expect( () => {
				test( param );
			} ).to.throw( errorType, errorMsg );
		} );
	}
}

function createMethodTest( object, method ) {
	return() => {
		expect( object ).to.have.property( method );
		expect( object[ method ] ).to.be.a( 'function' );
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

	it( 'exposes iterator', createMethodTest( PluginManager.prototype, Symbol.iterator ) );

	it( 'exposes find method', createMethodTest( PluginManager.prototype, 'find' ) );

	it( 'exposes load method', createMethodTest( PluginManager.prototype, 'load' ) );

	it( 'exposes findAndLoad method', createMethodTest( PluginManager.prototype, 'findAndLoad' ) );

	describe( 'iterator', () => {
		it( 'iterates through plugins property', () => {
			const pluginManager = new PluginManager();
			const samplePlugins = [ 1, 2, 3 ];

			pluginManager.plugins = samplePlugins;

			expect( [ ...pluginManager ] ).to.deep.equal( samplePlugins );
		} );
	} );

	describe( 'load', () => {
		it( 'accepts only array of string as parameter', createParameterTest( {
			invalid: [
				'test',
				1,
				undefined,
				null,
				{},
				[ 1, 2 ],
				[ null ]
			],
			test: ( param ) => {
				const pluginManager = new PluginManager();

				pluginManager.load( param );
			},
			errorType: TypeError,
			errorMsg: 'Parameter must be an array of strings'
		} ) );

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
		it( 'accepts only string or array of strings as 1. parameter', createParameterTest( {
			invalid: [
				1,
				undefined,
				null,
				{},
				[ 1, 2 ],
				[ null ],
			],
			test: ( param ) => {
				const pluginManager = new PluginManager();

				pluginManager.find( param );
			},
			errorType: TypeError,
			errorMsg: 'pattern parameter must be a string or an array of strings'
		} ) );

		it( 'accepts only string as 2. parameter', createParameterTest( {
			invalid: [
				1,
				null,
				{},
				[ 1, 2 ],
				[ null ],
			],
			test: ( param ) => {
				const pluginManager = new PluginManager();

				pluginManager.find( '', param );
			},
			errorType: TypeError,
			errorMsg: 'path parameter must be a string'
		} ) );

		it( 'returns Promise with absolute paths to found packages (string)', createFindPathTest( {
			patterns:'@test/*/',
			path: getPath( './fixtures' ),
			expected: [
				getPath( './fixtures/@test/package' )
			]
		} ) );

		it( 'returns Promise with empty array if path is default (string)', createFindPathTest( {
			patterns: '@test/*/',
			expected: []
		} ) );

		it( 'returns Promise with absolute paths to found packages (array of strings)', createFindPathTest( {
			patterns: [ '@test/*/', 'test-*' ],
			path: getPath( './fixtures' ),
			expected: [
				getPath( './fixtures/@test/package' ),
				getPath( './fixtures/test-1' ),
				getPath( './fixtures/test-2' )
			]
		} ) );

		it( 'returns Promise with empty array if path is default (array of strings)', createFindPathTest( {
			patterns: [ '@test/*/', 'test-*' ],
			expected: []
		} ) );
	} );

	describe( 'findAndLoad', () => {
		it( 'returns Promise with resolved modules array', () => {
			const pluginManager = new PluginManager();

			return pluginManager.findAndLoad( '@test/*/', getPath( './fixtures' ) ).then( ( plugins ) => {
				expect( plugins ).to.be.an( 'array' );
				expect( plugins ).to.have.lengthOf( 1 );
				expect( Reflect.getPrototypeOf( plugins[ 0 ] ) ).to.equal( Plugin );
			} );
		} );
	} );
} );
