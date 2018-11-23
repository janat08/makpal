import url from 'url';

var { port, __API_URL__ } = global.config;

export const serverPort = process.env.PORT || port;
export const isApiExternal = !!url.parse(__API_URL__).protocol;
export const apiUrl = !isApiExternal
	? `http://localhost:${serverPort}${__API_URL__}`
	: __API_URL__;
