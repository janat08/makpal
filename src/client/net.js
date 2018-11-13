import url from 'url';

var __API_URL__ =  '/graphql';
var __DEV__ = true;
export const isApiExternal = !!url.parse(__API_URL__).protocol;
export const apiUrl = !isApiExternal
	? `${window.location.protocol}//${window.location.hostname}${
		__DEV__ ? ':4000' : window.location.port ? ':' + window.location.port : ''
	}${__API_URL__}`
	: __API_URL__;
