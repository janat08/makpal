import http from "http";
import addGraphQLSubscriptions from "./api/subscriptions";

// import { serverPort } from './net';
import app from "./app";
import log from "../common/log";
const { config } = global;

// eslint-disable-next-line import/no-mutable-exports
let server;
server = http.createServer();
server.on("request", app);

addGraphQLSubscriptions(server);

// const server =
// app.listen(config.port, function () {
//   log.info(`Server started on port ${config.port} in ${app.get('env')} mode`);
//   //Its very useful to output init config to console at startup but we deliberately dont dump it to
//   //log files incase it contains sensetive info (like keys for services etc)
//   // console.log(config);//eslint-disable-line no-console
//   //'ready' is a hook used by the e2e (integration) tests (see node-while)
//   app.emit('ready');
// });

const serverPromise = new Promise((resolve) => {
	server.listen(config.port, () => {
		log.info(`API is now running on port ${config.port}`);
		//'ready' is a hook used by the e2e (integration) tests (see node-while)
		server.emit("ready");
		resolve(server);
	});
});

server.on("close", () => {
	server = undefined;
});

if (module.hot) {
	module.hot.dispose(() => {
		try {
			if (server) {
				server.close();
			}
		} catch (error) {
			log(error.stack);
		}
	});
	module.hot.accept(["./app"], () => {
		server.removeAllListeners("request");
		server.on("request", app);
	});
	module.hot.accept(["./api/subscriptions"], () => {
		try {
			addGraphQLSubscriptions(server);
		} catch (error) {
			log(error.stack);
		}
	});

	module.hot.accept();
}

export default serverPromise;
