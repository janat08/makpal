import xs from 'xstream';
import isolate from '@cycle/isolate';
import intent from '../Login/intent';
import model from '../Login/model';
import view from '../Login/view';
// import intent from './intent';
// import model from './model';
// import view from './view';
import Login from './index.js'
// import Snabbdom from 'snabbdom-pragma';

const defaultState = {

}

export default function TaskList(sources) {
  // const match$ = sources.router.define({
  //   "/": Login,
  //   // "/login": Login
  // })

  // const initReducer$ = xs.of(prevState=> (
  //   prevState === undefined ? defaultState : prevState
  // ))

  // const componentSink$ = match$.map(
  //   ({ path, value }) => {
  //     const { component, scope } = value;
  //     return isolate(component, scope)({
  //         ...sources,
  //         router: sources.router.path(path)
  //     });
  // }
  // )

  // const loginSinks = isolate(Login, "login")(sources)
  // const loginVDOM$ = loginSinks.DOM
  // const loginReducer$ = loginSinks.onion

  // const vdom$ = view(state$, loginVDOM$);
  // const reducer$ = xs.merge(parentReducer$, loginReducer$);

  // const sinks = extractSinks(componentSinks$, driverNames);
  // return {
  //   ...sinks,
  //   onion: xs.merge(initReducer$, sinks.onion),
  // };
  const state$ = sources.onion.state$;
  const actions = intent(sources.DOM, sources.history);
  const parentReducer$ = model(actions);

  const vdom$ = view(state$);
  const reducer$ = xs.merge(parentReducer$);

  return {
    DOM: vdom$,
    onion: reducer$,
  };
}
 