import express from 'express';
import favicon from 'serve-favicon';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import path from 'path';
import config from 'config';
import morgan from 'morgan';
import url from 'url';

import getLog from "./utils/logger";
import modules from "./modules/index";
import createApolloServer from "./graphql";
const { config } = global;

      
const app = express();        
    
for (const applyBeforeware of modules.beforewares) {
	applyBeforeware(app);
}
  
for (const applyMiddleware of modules.middlewares) {
	applyMiddleware(app);  
} 

//logging
// const log = getLog();  
if (config.logIncomingHttpRequests) {
	const incomingLog = getLog('INCOMING');
	app.use(morgan('short', { stream: { write: message => incomingLog.info(message.trim()) } }));
}

//dont reveal whats running server
app.disable('x-powered-by'); //TODO: helmet

app.use(cookieParser());
app.use(compression()); // GZip compress responses

const corsOptions = {
	credentials: true,
	origin: true
};

const graphqlServer = createApolloServer();
graphqlServer.applyMiddleware({
	app,
	path: '/graphql', 
	cors: corsOptions
});
 
app.get('/graphql', () => {});

//static files
app.use(favicon(path.join(__dirname, '../static/favicon.ico')));
app.use('/', express.static(path.join(__dirname, '../static')));
//bundles are mapped like this so dev and prod builds both work (as dev uses src/static while prod uses dist/static)
app.use('/bundles', express.static(path.join(__dirname, '../../dist/bundles')));


// //all page rendering
// //Note: handles page routing and 404/500 error pages where necessary
app.get('*', function (req, res) {
	res.sendFile(path.join(__dirname, '../static/index.html'));
});

// const server = app.listen(config.port, function () {
//   log.info(`Server started on port ${server.address().port} in ${app.get('env')} mode`);
//   //Its very useful to output init config to console at startup but we deliberately dont dump it to
//   //log files incase it contains sensetive info (like keys for services etc)
//   // console.log(config);//eslint-disable-line no-console
//   //'ready' is a hook used by the e2e (integration) tests (see node-while)
//   server.emit('ready');
// });

//export server instance so we can hook into it in e2e tests etc
export default app;
export {app};