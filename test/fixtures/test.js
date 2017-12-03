const { Plugin } = require( '@chammy/plugin-helper' );

module.exports = class Test extends Plugin {
	static get name() {
		return 'Test';
	}

	configure() {}

	execute() {}
};
