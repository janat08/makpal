import { setup, run } from '@cycle/run';
import isolate from '@cycle/isolate';
/// #if DEVELOPMENT
import { restartable, rerunner } from 'cycle-restart/lib/restart';
/// #endif

import { buildDrivers, wrapMain } from './drivers';
// import { Component } from './interfaces';
import { App } from './components/app';

const main = wrapMain(App);

/// #if PRODUCTION
run(main, buildDrivers(([k, t]) => [k, t()]));

/// #else
const mkDrivers = () =>
    buildDrivers(([k, t]) => {
        if (k === 'DOM') {
            return [k, restartable(t(), { pauseSinksWhileReplaying: false })];
        }
        if (k === 'time' || k === 'router') {
            return [k, t()];
        }
        return [k, restartable(t())];
    });
const rerun = rerunner(setup, mkDrivers, isolate);
rerun(main);


// if (module.hot) {
//     module.hot.accept('./components/app', () => {
//         const newApp = (require('./components/app') as any).App;

//         rerun(wrapMain(newApp));
//     });
// }
/// #endif


// import {run} from '@cycle/run';
// import {makeDOMDriver, div, button} from '@cycle/dom';
// import _ from 'lodash';
// import xs from 'xstream';

// function main (sources) {
//   const add$ = sources.DOM
//     .select('.add')
//     .events('click')
//     .map(ev => 1);

//   const count$ = add$.fold((total, change) => total + change, 0);

//   return {
//     DOM: count$.map(count =>
//       div('.counter', [
//         'Count: ' + count,
//         button('.add', 'Add')
//       ])
//     )
//   };
// }

// const drivers = {
//   DOM: makeDOMDriver('#app')
// }

// // Normally you need to call run, but Tricycle handles that for you!
// // If you want to try this out locally, just uncomment this code.
// //
// run(main, drivers);

// console.log(1)