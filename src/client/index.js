window.Snabbdom = require("snabbdom-pragma");
window.state = function(x) {
	return function(prev) {
		return { ...prev, ...x };
	};
};
require("~/common/defineGlobalVars.js");
require('./testgraphql/index') //test graphql import
require("./app.js");
