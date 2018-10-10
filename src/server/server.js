import http from 'http';
import addGraphQLSubscriptions from './api/subscriptions.ts';

// import { serverPort } from './net';
import app from './app';
import log from '../common/log';
import config from 'config';

// eslint-disable-next-line import/no-mutable-exports
let server;
server = http.createServer();
server.on('request', app);

addGraphQLSubscriptions(server);

const serverPromise = new Promise(resolve => {
  server.listen(config.port, () => {
    log.info(`API is now running on port ${config.port}`);
      //'ready' is a hook used by the e2e (integration) tests (see node-while)
    server.emit("ready")
    resolve(server);
  });
});

server.on('close', () => {
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
  module.hot.accept(['./app'], () => {
    server.removeAllListeners('request');
    server.on('request', app);
  });
  module.hot.accept(['./api/subscriptions'], () => {
    try {
      addGraphQLSubscriptions(server);
    } catch (error) {
      log(error.stack);
    }
  });

  module.hot.accept();
}

export default serverPromise;
