import storageDriver from '@cycle/storage';
import storageify from "cycle-storageify";
import App from './components/_Layout/Layout.js';
import switchPath from 'switch-path';
import Cookies from 'universal-cookie';
import createApolloClient from '/../common/createApolloClient';
// import modules from './modules/index';
import gql from 'graphql-tag';  
import xs from "xstream"
import {COUNTER, ADDCOUNTER} from './gql.js'

import { setup, run } from '@cycle/run';
import isolate from '@cycle/isolate';
/// #if DEVELOPMENT
import { restartable, rerunner } from 'cycle-restart';
/// #endif

import { buildDrivers, wrapMain } from './drivers';
import { Component } from './interfaces';

const main: Component = wrapMain(App);

if( process.env.NODE_ENV == "production"){
  console.log("production", 123)
  run(main as any, buildDrivers(([k, t]) => [k, t()]));
} else {
  console.log("dev", 123, process.env.NODE_ENV)
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
rerun(main as any);

if (module.hot) {
  module.hot.accept('./components/_Layout/Layout.js', () => {
      const newApp = (require('./components/_Layout/Layout.js') as any).App;

      rerun(wrapMain(newApp));
  });
}

}





// // //drivers
// import {makeCookieDriver} from 'cyclejs-cookie';
// import {routerify} from 'cyclic-router';
// import {makeApolloDriver} from './drivers/cycleApollo.js'
// import onionify from 'cycle-onionify';
// import {makeDOMDriver} from '@cycle/dom';
// import {captureClicks, makeHistoryDriver} from '@cycle/history'

// const client = createApolloClient({
//   // apiUrl, 
//   // links: link,
//   // connectionParams: modules.connectionParams, //for uploading images
//   // clientResolvers: modules.resolvers
// });

// // ////////////


// const main = routerify(onionify(App), switchPath, {omitHistory: false});
// // const main = onionify(Layout);

// run(main, {
//   DOM: makeDOMDriver('#app'),
//   history: captureClicks(makeHistoryDriver()),
//   apollo: makeApolloDriver (client),
//   cookie: makeCookieDriver(),
// }); 


/////////////////////////DON'T DELETE////////////////////////////////
/////////////////////SERVICE WORKER CODE/////////////////////////////
// if('serviceWorker' in navigator) {
//   navigator.serviceWorker
//            .register('./sw.js')
//            .then(function() { console.log('Service Worker Registered'); })
//            .catch(err=>console.log(err));
// } 

// var deferredPrompt
// var registration
// try {
//   if ("serviceWorker" in navigator) {
//     window.addEventListener("load", () => {
//       try {
//         navigator.serviceWorker.register('./sw.js').then(r=>{
//           registration = registration
//         }).catch(e=>{
//           console.log("SW error", e)
//         })
//       } catch (e) {
//         console.log(e, "error in registration")
//       }
//     })
//   }
// }catch (e) {
//   console.log(e, "error in registration")
// }

// window.addEventListener("beforeinstallprompt", e => {
//   // e.preventDefault()
//   console.log(e, 1)
//   showInstallButton(true)
//   deferredPrompt = e
// })

// example invocation
// setTimeout(prompt, 3000);

// used for manual prompts
// function prompt(){
//   console.log()
// deferredPrompt.prompt()

// deferredPrompt.userChoice
//   .then(choiceResult => {
//     if (choiceResult.outcome === "accepted") {
//       console.log("accepted")
//     } else {
//       console.log("unaccepted")
//     }
//     deferredPrompt = null
//   })
// }