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
import Cookies from 'universal-cookie';
import createApolloClient from '/../common/createApolloClient';
import { apiUrl } from './net';
// import modules from './modules/index';
import link from './modules/user/access/index'
import gql from 'graphql-tag';  
import {makeApolloDriver} from './drivers/cycleApollo.js'
import xs from "xstream"
import {COUNTER, ADDCOUNTER} from './gql.js'

const client = createApolloClient({
  apiUrl, 
  links: link,
  // connectionParams: modules.connectionParams, //for uploading images
  // clientResolvers: modules.resolvers
});

// var a = client.watchQuery({query: gql`${COUNTER}`, polling: 1000})
// a.subscribeToMore(function(x){console.log(x)})
// console.log("client", a)

// client.query({query: query, errorPolicy: "all"}).then(x=>console.log("test", x))//.catch(x=>console.log('err', x))
// client.mutate({mutation: gql`${LOGIN}${USERPROFILED}`, variables: {input: {usernameOrEmail: "asdf", password: "asdf"}}}).then(x=>console.log(x)).then(()=>{
  // client.watchQuery({query: gql`${COUNTER}`}).then(x=>console.log("current", x))
// })

//////////////


const main = onionify(Layout);

run(main, {
  DOM: makeDOMDriver('#app'),
  history: captureClicks(makeHistoryDriver()),
  apollo: makeApolloDriver (client)
}); 



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