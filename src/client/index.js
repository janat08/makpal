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


if('serviceWorker' in navigator) {
  navigator.serviceWorker
           .register('./sw.js')
           .then(function() { console.log('Service Worker Registered'); })
           .catch(err=>console.log(err));
} 

var deferredPrompt
var registration
try {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      try {
        navigator.serviceWorker.register('./sw.js').then(r=>{
          registration = registration
        }).catch(e=>{
          console.log("SW error", e)
        })
      } catch (e) {
        console.log(e, "error in registration")
      }
    })
  }
}catch (e) {
  console.log(e, "error in registration")
}

window.addEventListener("beforeinstallprompt", e => {
  // e.preventDefault()
  console.log(e, 1)
  showInstallButton(true)
  deferredPrompt = e
})

// example invocation
// setTimeout(prompt, 3000);

// used for manual prompts
function prompt(){
  console.log()
deferredPrompt.prompt()

deferredPrompt.userChoice
  .then(choiceResult => {
    if (choiceResult.outcome === "accepted") {
      console.log("accepted")
    } else {
      console.log("unaccepted")
    }
    deferredPrompt = null
  })
}