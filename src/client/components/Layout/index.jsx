import xs from 'xstream';
import isolate from '@cycle/isolate';
import intent from '../Login/intent';
import model from '../Login/model';
// import view from '../Login/view';
// import intent from './intent';
// import model from './model';
// import view from './view';
import Login from '../Login/index.js'
// import Snabbdom from 'snabbdom-pragma';
import Snabbdom from 'snabbdom-pragma';


const defaultState = {

}

function navigation(pathname) {

  return (
    <span>
      <a href="/" style={pathname.startsWith('/news') ? 'bold' : ''}>Makpal</a>
      <a href="/" style="bold"> home </a>
    </span>
  );
}

function view(history$, vdom$, login$) {
  return xs.combine(history$, vdom$, login$).map(([{ pathname }, vdom, login]) =>
    <div className="main-wrapper">
      <header>
        <h1>makpal</h1>
      </header>
      <nav>
        {navigation(pathname)}
      </nav>
      <div className="header-wrapper">
      </div>
      <section class="main">
        {vdom}
        {login}
      </section>
      <footer>
        footer
      </footer>
    </div>
  );
}

export default function TaskList(sources) {
  const match$ = sources.router.define({
    "/": Login,
    // "/login": Login
  })

  // const initReducer$ = xs.of(prevState=> (
  //   prevState === undefined ? defaultState : prevState
  // ))

  const page$ = match$.map(
    ({ path, value }) => {
      const { component, scope } = value;
      return isolate(component, scope)({
        ...sources,
        router: sources.router.path(path)
      });
    }
  )

  const view$ = page$.map(v => v.DOM || xs.never()).flatten()
  // const http$ = page$.map(v => v.HTTP || xs.never()).flatten()
  const route$ = page$.map(v => v.router || xs.never()).flatten()
  const reducers$ = page$.map(v => v.onion || xs.never()).flatten()
  const history$ = sources.history

  const state$ = sources.onion.state$;
  const actions = intent(sources.DOM, sources.history);
  const parentReducer$ = model(actions);

  console.log(Login, typeof login)

  const login = isolate(Login, {onion: "counter"})(sources)
  const childReducer$ = login.onion

  console.log(login)
  const vdom$ = view(history$, view$, login.DOM);
  const reducer$ = xs.merge(parentReducer$, reducers$, childReducer$);

  return {
    DOM: vdom$,
    onion: reducer$,
    router: xs.of("/"),
  };
}
