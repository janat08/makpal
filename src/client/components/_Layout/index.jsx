import xs from 'xstream';
import isolate from '@cycle/isolate';
import intent from '../Login/intent';
import model from '../Login/model';
import { extractSinks } from 'cyclejs-utils';
import switchPath from 'switch-path';

// import view from '../Login/view';
// import intent from './intent';
// import model from './model';
// import view from './view';
import Login from '../Login/index.js'
import Home from "../Home/index.jsx"
// import Snabbdom from 'snabbdom-pragma';
import Snabbdom from 'snabbdom-pragma';


const defaultState = {
}

function navigation(pathname) {

  return (
    <nav>
      <ol>
        <li>
          <a href="/" style={pathname.startsWith('/') ? 'font-weight:bold' : ''}>Makpal</a>
        </li>
        <li>
          <a href="/login" style={pathname.startsWith('/login') ? 'font-weight:bold' : ''}>Login</a>
        </li>
      </ol>
    </nav>
  );
}

function view(vdom$, path$) {
  return xs.combine(vdom$, path$).map(([vdom, { pathname }]) =>
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
      </section>
      <footer>
        footer 1
      </footer>
    </div>
  );
}

export default function Layout(sources) {
  const Routes = {
    "/": Home,
    //something must be embedded because of a bug relating to if/when '*' is detected
    "/login": {"/": Login},
    '*': function(){return {DOM: xs.of((<div><h1> 404</h1> <h4> doesn't exist</h4></div>))}}
  }

  const initReducer$ = xs.of(prevState => (
    prevState === undefined ? defaultState : prevState
  ))
  initReducer$.debug("init")

  const history$ = sources.history;
  const pageSinks$ = history$.map((location) => {
    const { pathname } = location;
    return switchPath(pathname, Routes);
  }).map((route) => {
    return isolate(route.value, 'page')(sources)
  });
  pageSinks$.debug("sinks")

  const PS = extractSinks(pageSinks$, ['DOM', 'onion']);
  const vdom$ = view(PS.DOM, history$);
  const reducer$ = xs.merge(initReducer$, PS.onion);

  return {
    DOM: vdom$,
    onion: reducer$,
  };
}
