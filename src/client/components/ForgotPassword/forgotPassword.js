import intent from './intent';
import model from './model';
import view from './view.jsx';
import xs from 'xstream';
import {FORGOTPASSWORD} from '../../gql'
import delay from 'xstream/extra/delay'

export default function ForgotPassword({DOM, state, apollo}) {
  const action = {...intent(DOM), result$: apollo.select("forgotPass").flatten().map(x=>x.data.forgotPassword)}
  
  const submitForgotPass$ = action.submit$.map(x=>{
    return state.stream.map(x=>{
      return xs.of({
        mutation:  FORGOTPASSWORD,
        variables: {input: {email: x.email}},
        category: 'forgotPass'
      })
    }).flatten().take(1)
  }).flatten()
  
  const reducer$ = model(action)
  const vdom$ = view(state.stream)

  const passwordResetBegun$ = state.stream.filter(x=>x.completed)
  .compose(delay(1000))
  
  return {
    DOM: vdom$,
    state: reducer$,
    apollo: submitForgotPass$,
  };
}
