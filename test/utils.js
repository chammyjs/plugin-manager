import { isString } from '../src/utils.js';
import { makeGlobPromise } from '../src/utils.js';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { getPath } from './helpers/helpers.js';
import { createReturnValueTest } from './helpers/helpers.js';

const expect = chai.expect;

chai.use( chaiAsPromised );

describe( 'isString', () => {
	it( 'is a function', () => {
		expect( isString ).to.be.a( 'function' );
	} );

	it( 'returns false for non-string values', createReturnValueTest( {
		values: [
			null,
			undefined,
			1,
			[],
			{},
			function() {},
			Symbol( 'test' )
		],
		expected: false,
		test: isString
	} ) );

	it( 'returns true for string values', createReturnValueTest( {
		values: [
			'',
			'test'
		],
		expected: true,
		test: isString
	} ) );
} );

describe( 'makeGlobPromise', () => {
	it( 'is a function', () => {
		expect( makeGlobPromise ).to.be.a( 'function' );
	} );

	it( 'returns a promise with paths', () => {
		return expect( makeGlobPromise( '.non-existent', getPath( './fixtures' ) ) ).
			to.eventually.deep.equal( [] );
	} );

	it( 'rejects when path is not provided', () => {
		return expect( makeGlobPromise( '' ) ).
			to.be.eventually.rejectedWith( Error );
	} );
} );
