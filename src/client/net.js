import url from "url";

const { __API_URL__, __DEV__ } = window.config;
export const isApiExternal = !!url.parse(__API_URL__).protocol;
export const apiUrl = !isApiExternal
	? `${window.location.protocol}//${window.location.hostname}${
			window.location.port ? ":" + window.location.port : ""
	  }${__API_URL__}`
	: __API_URL__;
