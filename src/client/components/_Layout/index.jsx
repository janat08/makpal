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
import Login from '../Login/index.js'
import Home from "../Home/index.jsx"
// import Snabbdom from 'snabbdom-pragma';
import Snabbdom from 'snabbdom-pragma';
import gql from 'graphql-tag'
import { json } from 'jsverify';
import flattenConcurrently from 'xstream/extra/flattenConcurrently'


const defaultState = {
}



export default function Layout(sources) {
  // const query$ = xs.of({
  //   query: gql`
  //   query serverCounterQuery {
  //     serverCounter {
  //       amount
  //     }
  //   }
  //   `,
  //     category: 'allusers'
  // })

  // const results$ = sources.apollo.select('allusers')
  //   .flatten()
  //   .startWith([])


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

  let response$ = sources.apollo
    .compose(flattenConcurrently)
    .map(({data}) => data);

  response$.addListener({
    next: s => { console.log(s) },
    error: err => console.error(err),
    complete: () => {},
  });

  const Routes = {
    "/": Home,
    //something must be embedded because of a bug relating to if/when '*' is detected
    "/login": {"/": Login},
    '*': function(){return {DOM: xs.of((<div><h1> 404</h1> <h4> doesn't exist</h4></div>))}}
  }

  var results$ = xs.of({})

  const initReducer$ = xs.of(prevState => (
    prevState === undefined ? defaultState : prevState
  ))

  const history$ = sources.history;
  const pageSinks$ = history$.map((location) => {
    const { pathname } = location;
    return switchPath(pathname, Routes);
  }).map((route) => {
    return isolate(route.value, 'page')(sources)
  });
  pageSinks$.debug("sinks")

  const PS = extractSinks(pageSinks$, ['DOM', 'onion']);
  const vdom$ = view(PS.DOM, history$, results$);
  const reducer$ = xs.merge(initReducer$, PS.onion);

  return {
    DOM: vdom$,
    onion: reducer$,
    apollo: xs.fromArray([{
      query: 'count',
      // variables: {
      //   id: 'randomid'
      // }
    },])
  };
}
