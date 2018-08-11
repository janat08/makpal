import {run} from '@cycle/run';
import {makeDOMDriver} from '@cycle/dom';
import storageDriver from '@cycle/storage';
import {captureClicks, makeHistoryDriver} from '@cycle/history'
import onionify from 'cycle-onionify';
import storageify from "cycle-storageify";
import Layout from './components/Layout/index';
import switchPath from 'switch-path';
import {routerify} from 'cyclic-router';


const main = routerify(onionify(storageify(Layout, {key: 'todos-cycle'})), switchPath);

run(main, {
  DOM: makeDOMDriver('#app'),
  history: captureClicks(makeHistoryDriver()),
  storage: storageDriver,
});
