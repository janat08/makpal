/**
 * this is for server code source map
 */
const fs = require('fs')
const path = require('path')
require('source-map-support').install({
  retrieveSourceMap: function() {
		return {
			url: __filename,
			map: fs.readFileSync(path.join(__dirname,'../../dist/server/index.map'),'utf-8'),
      environment: 'node'
		};
  }
});

// remove it after check
throw new Error('see me in trace stack!')

global.config = process.environment;
require("~/common/defineGlobalVars");
const log = require("../common/log");
require("./server");

process.on("uncaughtException", (ex) => {
	log.error(ex, "broke");
	process.exit(1);
});

process.on("unhandledRejection", (reason) => {
	log.error(reason, "break reason");
});

if (module.hot) {
	module.hot.status((event) => {
		if (event === "abort" || event === "fail") {
			log("HMR error status: " + event);
			// Signal webpack.run.js to do full-reload of the back-end
			process.exit(250);
		}
	});

	module.hot.accept();
}
