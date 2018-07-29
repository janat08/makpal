import xs, { Stream } from 'xstream';
import { restartable } from 'cycle-restart';
import { makeDOMDriver } from '@cycle/dom';
import { makeHTTPDriver } from '@cycle/http';
import { makeHistoryDriver } from '@cycle/history';
import { timeDriver } from '@cycle/time';
import { routerify, RouteMatcher } from 'cyclic-router';
import onionify from 'cycle-onionify';
import storageify from 'cycle-storageify';
import switchPath from 'switch-path';
import storageDriver from '@cycle/storage';

import speechDriver from './drivers/speech';

// Set of Drivers used in this App
const driverThunks= [
    ['DOM', () => makeDOMDriver('#app')],
    ['HTTP', () => makeHTTPDriver()],
    ['time', () => timeDriver],
    ['history', () => makeHistoryDriver()],
    ['storage', () => storageDriver],
    ['speech', () => speechDriver]
];

export const buildDrivers = (fn) =>
    driverThunks
        .map(fn)
        .map((n, t) => ({ [n]: t }))
        .reduce((a, c) => Object.assign(a, c), {});

export const driverNames = driverThunks
    .map(([n, t]) => n)
    .concat(['onion', 'router']);

export function wrapMain(main) {
    return routerify(
        onionify(
            storageify(main, {
                key: 'cycle-spa-state',
                debounce: 100 // wait for 100ms without state change before writing to localStorage
            })
        ),
        switchPath
    );
}
