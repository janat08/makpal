import intent from './intent';
import model from './model';
import view from './view.jsx';
import xs from 'xstream';
import {FORGOTPASSWORD} from '../../gql'
import delay from 'xstream/extra/delay'

export default function ForgotPassword({DOM, onion, apollo}) {
  const action = {...intent(DOM), result$: apollo.select("forgotPass").flatten().map(x=>x.data.forgotPassword)}
  
  const submitForgotPass$ = action.submit$.map(x=>{
    return onion.state$.map(x=>{
      return xs.of({
        mutation:  FORGOTPASSWORD,
        variables: {input: {email: x.email}},
        category: 'forgotPass'
      })
    }).flatten().take(1)
  }).flatten()
  action.result$.debug().subscribe({})
  
  const reducer$ = model(action)
  const vdom$ = view(onion.state$)

  const passwordResetBegun$ = onion.state$.filter(x=>x.completed)
  .compose(delay(1000))
  
  return {
    // router: action$.register$.map(x=>{console.log("routing"); return x}).mapTo({pathname: "/", state: {some:"state"}}).mapTo("/"),
    DOM: vdom$,
    onion: reducer$,
    apollo: submitForgotPass$,
  };
}
