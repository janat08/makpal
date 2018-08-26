import {run} from '@cycle/run';
import {makeDOMDriver} from '@cycle/dom';
import storageDriver from '@cycle/storage';
import {captureClicks, makeHistoryDriver} from '@cycle/history'
import onionify from 'cycle-onionify';
import storageify from "cycle-storageify";
import Layout from './components/_Layout/index.jsx';
import switchPath from 'switch-path';
import {routerify} from 'cyclic-router';
import { createHistory } from '@cycle/history'
import { makeRouterDriver } from 'cyclic-router'


const main = onionify(Layout);

run(main, {
  DOM: makeDOMDriver('#app'),
  history: captureClicks(makeHistoryDriver())
  // storage: storageDriver,
});


// if('serviceWorker' in navigator) {
//   navigator.serviceWorker
//            .register('/sw.js')
//            .then(function() { console.log('Service Worker Registered'); })
//            .catch(err=>console.log(err));
// } 