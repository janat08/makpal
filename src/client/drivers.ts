import xs, { Stream } from "xstream";
import { makeDOMDriver } from "@cycle/dom";
import { makeHTTPDriver } from "@cycle/http";
import { captureClicks, makeHistoryDriver } from "@cycle/history";
import { timeDriver } from "@cycle/time";
import { routerify } from "cyclic-router";
import onionify from "cycle-onionify";
// import storageify from 'cycle-storageify';
import switchPath from "switch-path";
// import storageDriver from '@cycle/storage';

import { makeCookieDriver } from "cyclejs-cookie";
import { makeApolloDriver } from "./drivers/cycleApollo/cycleApollo";
import createApolloClient from "~/common/createApolloClient.js";
import link from "./user/access/index";
import { apiUrl } from "./net";

import { Component } from "./interfaces";

export type DriverThunk = Readonly<[string, () => any]> & [string, () => any]; // work around readonly
export type DriverThunkMapper = (t: DriverThunk) => DriverThunk;

const client = createApolloClient({
	apiUrl,
	links: link
	// connectionParams: modules.connectionParams, //for uploading images
	// clientResolvers: modules.resolvers
});

// Set of Drivers used in this App
const driverThunks: DriverThunk[] = [
	["DOM", () => makeDOMDriver("#app")],
	["HTTP", () => makeHTTPDriver()],
	// ['time', () => timeDriver],
	["history", () => captureClicks(makeHistoryDriver())],
	["apollo", () => makeApolloDriver(client)],
	["cookie", () => makeCookieDriver()]
];

export const buildDrivers = (fn: DriverThunkMapper) =>
	driverThunks
		.map(fn)
		.map(([n, t]: DriverThunk) => ({ [n]: t }))
		.reduce((a, c) => Object.assign(a, c), {});

export const driverNames = driverThunks
	.map(([n, t]) => n)
	.concat(["onion", "router"]);

export function wrapMain(main: Component): Component {
	return routerify(onionify(main as any), switchPath, {
		omitHistory: false
	}) as any;
}
