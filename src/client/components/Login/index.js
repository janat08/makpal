import intent from './intent';
import model from './model';
import view from './view.jsx';
import xs, {Stream, MemoryStream} from 'xstream';

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

export default function Counter(sources) {
  const action$ = xs.merge(
    sources.DOM.select('.decrement').events('click').map(ev => -1),
    sources.DOM.select('.increment').events('click').map(ev => +1)
  );

  const state$ = sources.onion.state$;

  const vdom$ = state$.map(state =>
    div([
      button('.decrement', 'Decrement'),
      button('.increment', 'Increment'),
      p('Counter: ' + state.count)
    ])
  );

  const initReducer$ = xs.of(function initReducer(prevState) {
    if (prevState) {
      return prevState;
    } else {
      return {count: 0};
    }
  });
  const updateReducer$ = action$
    .map(num => function updateReducer(prevState){
      return {count: prevState.count + num};
    });
  const reducer$ = xs.merge(initReducer$, updateReducer$);

  return {
    DOM: vdom$,
    onion: reducer$,
  };
}
