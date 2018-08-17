
import xs, {Stream, MemoryStream} from 'xstream';
import {div, button, p, makeDOMDriver} from '@cycle/dom';
import Snabbdom from 'snabbdom-pragma';

// import Snabbdom from 'snabbdom-pragma';

// export default function Login(sources) {
//   const actions = intent(sources.DOM);
//   const reducer$ = model(actions);
//   const vdom$ = view(sources.onion.state$);

//   return {
//     DOM: vdom$,
//     onion: reducer$,
//   };
// }

export default function Home(sources) {
  const vdom$ = xs.of((
      <h1>sdf</h1>
  ))
  
  const initReducer$ = xs.of(function initReducer(prevState) {
    if (prevState) {
      return prevState;
    } else {
      return {count: 0};
    }
  });

  const reducer$ = xs.merge(initReducer$, );
  return {
    DOM: vdom$,
    onion: reducer$,
  };
}
