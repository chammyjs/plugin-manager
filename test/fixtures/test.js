const { Plugin } = require( '@chammy/plugin-helper' );

module.exports = class Test extends Plugin {
	static get pluginName() {
		return 'Test';
	}

	configure() {}

	execute() {}
};
