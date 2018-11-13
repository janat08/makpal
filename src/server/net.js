import url from 'url';
import config from 'config';

var {port, API_URL } = config;

export const serverPort = process.env.PORT || port;
export const isApiExternal = !!url.parse(API_URL).protocol;
export const apiUrl = !isApiExternal ? `http://localhost:${serverPort}${config.__API_URL__}` : __API_URL__;
