
import xs, {Stream, MemoryStream} from 'xstream';
import {div, button, p, makeDOMDriver} from '@cycle/dom';
import Snabbdom from 'snabbdom-pragma';

// import Snabbdom from 'snabbdom-pragma';

// export default function Login(sources) {
//   const actions = intent(sources.DOM);
//   const reducer$ = model(actions);
//   const vdom$ = view(sources.state.stream);

//   return {
//     DOM: vdom$,
//     state: reducer$, 
//   };
// } 

export default function Home(sources) {
  const vdom$ = xs.of((
    <div> 
      <h1>Home</h1>
      <h3>A wellness and longevity site</h3>
    </div>
  ))
  
  // const initReducer$ = xs.of(function initReducer(prevState) {
  //   if (prevState) {
  //     return prevState; 
  //   } else { 
  //     return {count: 0};
  //   }
  // });

  // const reducer$ = xs.merge(initReducer$, );
  return {
    DOM: vdom$,
    // state: reducer$,
  };
}
