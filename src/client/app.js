import { run } from "@cycle/run";
import storageDriver from "@cycle/storage";
import storageify from "cycle-storageify";
import Layout from "./components/_Layout/Layout.js";
import switchPath from "switch-path";
import Cookies from "universal-cookie";
import createApolloClient from "~/common/createApolloClient";
import { apiUrl } from "./net";
// import modules from './modules/index';
import link from "./user/access/index";
import gql from "graphql-tag";
import xs from "xstream";
import { COUNTER, ADDCOUNTER } from "./gql.js";
import Snabbdom from "snabbdom-pragma";
// import dotenv from 'dotenv';

//drivers
import { makeCookieDriver } from "cyclejs-cookie";
import { routerify } from "cyclic-router";
import { makeApolloDriver } from "./drivers/cycleApollo/cycleApollo.js";
import { withState } from "@cycle/state";
import { makeDOMDriver } from "@cycle/dom";
import { captureClicks, makeHistoryDriver } from "@cycle/history";
// //
// var result = require('dotenv').config();
// console.log(process.env || result);

const client = createApolloClient({
	apiUrl,
	links: link
	// connectionParams: modules.connectionParams, //for uploading images
	// clientResolvers: modules.resolvers
});

//////////////

const main = routerify(withState(Layout), switchPath, { omitHistory: false });

run(main, {
	DOM: makeDOMDriver("#app"),
	history: captureClicks(makeHistoryDriver()),
	apollo: makeApolloDriver(client),
	cookie: makeCookieDriver()
});

export default { main };

/////////////////////SERVICE WORKER CODE
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
