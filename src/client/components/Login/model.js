import xs from 'xstream';

var init = {name: "", pass: "", error: "", complete: false}
var allFieldsInAuth = {name: "", pass: "", passVerify: "", email: "", completed: true}
export default function model(actions) {
  const initReducer$ = xs.of(prevState => {
    return prevState === undefined ? init : Object.assign({}, init, prevState)
  })
  const fields$ = xs.merge(actions.name$, actions.pass$)
    .map((val) => prev => ({ ...prev, ...val }))


  const facebook$ = actions.facebook$.mapTo(prev=>{window.location = '/auth/facebook'})
  const google$ = actions.google$.mapTo(prev=>{window.location = '/auth/google'})

  const completed$ = actions.result$.map(x => {
    if (x.errors != null) {
      return xs.of(prev => ({ ...prev, error: x.errors[0].message }))
    } else if (x.user && x.user.id) {
      return xs.of(prev => ({ ...prev, ...allFieldsInAuth }))
    }
  }).flatten()

  return xs.merge(
    initReducer$,
    fields$,
    facebook$,
    google$,
    completed$,
  );
}
