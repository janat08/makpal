import intent from './intent';
import model from './model';
import view from './view.jsx';
import xs from 'xstream';

export default function Login(sources) {
  const action$ = intent(sources.DOM)
  const reducer$ = model(action$)
  const vdom$ = view(sources.onion.state$)


  return {
    DOM: vdom$,
    onion: reducer$,
  };
}
