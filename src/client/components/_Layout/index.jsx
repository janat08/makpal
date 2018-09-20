import xs from 'xstream';
import isolate from '@cycle/isolate';
import intent from '../Login/intent';
import model from '../Login/model';
import { extractSinks } from 'cyclejs-utils';
import switchPath from 'switch-path';

// import view from '../Login/view';
// import intent from './intent';
// import model from './model';
import view from './view.jsx';
import Login from '../Login/login.js'
import Home from "../Home/index.jsx"
// import Snabbdom from 'snabbdom-pragma';
import Snabbdom from 'snabbdom-pragma';
import gql from 'graphql-tag'
import { json } from 'jsverify';
import flattenConcurrently from 'xstream/extra/flattenConcurrently'
import notificationLens from '../notificationLens.js'

import {LOGIN, COUNTER} from '/gql.js'; 


const defaultState = {
  notifications: xs.fromArray([])
}


export default function Layout(sources) {
  const query$ = xs.of({
    mutation:  LOGIN,
    variables: {input: {usernameOrEmail: "asdf", password: "asdf"}},
      category: 'allusers'
  })

  const counterUpdated$ = xs.of({
    subscription: true,
    query: gql`subscription onCounterUpdated {
      counterUpdated {
        amount
      }
    }`,
    category: "sub"
  })

  const counter$ = xs.of({
    query: COUNTER,
    category: 'counter',
    pollingInterval: 500
  })


  // const subscription$ = sources.apollo.select('sub')
  //   .flatten()


  // const response$ = sources.apollo.select('allusers')
  //   .flatten()
  //   // .startWith([])
  // const counterQuery$ = sources.apollo.select('serverCounterQuery')
  //   .flatten()

  // const counterQuery2$ = sources.apollo.select('counter')
  //   .flatten()


  // let results$ = sources.apollo
  // .flatMap(r$ => r$
  //   .replaceError(err => xs.of({errors: [err.message]}))
  // )
  // .filter(({errors}) => {
  //   if (errors && errors.length) {
  //     console.log('errors:', errors)
  //     return false
  //   }
  //   return true
  // })
  // .map(({data}) => data)

  // let response$ = sources.apollo//.flatten()
  //   .compose(flattenConcurrently)
  //   .map((data) => data);

  // subscription$.subscribe({
  //   next: s => { console.log("new", new Date()/1000, s) },
  //   error: err => console.error(err),
  //   complete: () => {},
  // });

  // response$.addListener({
  //   next: s => { console.log("user", new Date()/1000, s) },
  //   error: err => console.error(err),
  //   complete: () => {},
  // });
  var ab = {
    next: s => {console.log("new counted", s)},
    complete: s => {console.log("counter done")}
  }

  // counterQuery$.subscribe(ab)
  // counterQuery2$.subscribe(ab)

  // xs.merge(counterQuery2$, counterQuery$).addListener({
  //   next: s => {console.log("new counted", s)},
  //   complete: s => {console.log("counter done")}
  // })

  const routes$ = sources.router.define({
    "/": Home,
    //something must be embedded because of a bug relating to if/when '*' is detected
    "/login": {"/": Login},
    "/forgotPassword": Login,
    '*': function(){return {DOM: xs.of((<div><h1> 404</h1> <h4> doesn't exist</h4></div>))}}
  })

  const initReducer$ = xs.of(prevState => (
    prevState === undefined ? defaultState : prevState
  ))

  const history$ = sources.router.history$
  // console.log("path", sources.router.history$)

  // const pageSinks$ = history$.map((location) => {
  //   const { pathname } = location;
  //   return switchPath(pathname, Routes);
  // }).map((route) => {
  //   return isolate(route.value, {onion: notificationLens('page')})(sources)
  // });

  const page$ = routes$.map(({path, value}) => {
    var newSources = Object.assign({}, sources, {
      router: sources.router.path(path)
    })
    console.log(path, value, newSources)
    return isolate(value, "page")(newSources);
  })
  // .map((comp) => {
  //   return isolate(comp, {onion: notificationLens('page')})(sources)
  // });
  

  page$.debug("sinks")

  const PS = extractSinks(page$, ['DOM', 'onion']);
  const vdom$ = view(PS.DOM, history$);
  const reducer$ = xs.merge(initReducer$, PS.onion);

  return {
    DOM: vdom$,
    onion: reducer$,
    // apollo: xs.fromArray([{
    //   query: 'count',
    //   // variables: {
    //   //   id: 'randomid'
    //   // }
    // },{
    //   query: "currentUser"
    // },])
    // apollo: xs.merge(counterUpdated$, query$, counter$)
    apollo: xs.merge( counter$)

  };
}
