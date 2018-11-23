window.Snabbdom = require("snabbdom-pragma");
window.state = function(x) {
	return function(prev) {
		return { ...prev, ...x };
	};
};
require("~/common/defineGlobalVars.js");
require("./app.js");
