import xs, { Stream } from 'xstream';
import { VNode, DOMSource } from '@cycle/dom';
import { StateSource } from 'cycle-onionify';
import isolate from '@cycle/isolate';
import { extractSinks } from 'cyclejs-utils';

import { driverNames } from '../drivers';
import { RouteValue, routes, initialRoute } from '../routes';

import { State as CounterState } from './counter';
import { State as SpeakerState } from './speaker';

// State

export const defaultState = {
    counter: { count: 5 },
    speaker: undefined //use default state of component
};

export function App(sources) {
    const initReducer$ = xs.of(
        prevState => (prevState === undefined ? defaultState : prevState)
    );

    const match$ = sources.router.define(routes);

    const componentSinks$ = match$.map(
        ({ path, value }) => {
            const { component, scope } = value;
            return isolate(component, scope)({
                ...sources,
                router: sources.router.path(path)
            });
        }
    );

    const sinks = extractSinks(componentSinks$, driverNames);
    return {
        ...sinks,
        onion: xs.merge(initReducer$, sinks.onion)
    };
}
