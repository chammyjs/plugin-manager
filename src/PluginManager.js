class PluginManager {
	constructor() {
		this.plugins = [];
	}

	[ Symbol.iterator ]() {
		return this.plugins[ Symbol.iterator ]();
	}
}

module.exports = PluginManager;
