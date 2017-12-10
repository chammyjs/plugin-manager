import * as index from '../src/index.js';
import PluginManager from '../src/PluginManager.js';
import chai from 'chai';

const expect = chai.expect;

describe( 'package', () => {
	it( 'has only default export', () => {
		expect( index ).to.have.all.keys( 'default' );
	} );

	it( 'exposes PluginManager as default', () => {
		console.log( index ); // eslint-disable-line no-console
		expect( index.default ).to.equal( PluginManager );
	} );
} );
