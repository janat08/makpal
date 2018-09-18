import xs from 'xstream';

export default function model(actions) {
  // const startEditReducer$ = actions.startEdit$
  //   .mapTo(function startEditReducer(data) {
  //     return {...data, editing: true};
  //   });

  // const doneEditReducer$ = actions.doneEdit$
  //   .map(content => function doneEditReducer(data) {
  //     return {...data, title: content, editing: false};
  //   });

  // const cancelEditReducer$ = actions.cancelEdit$
  //   .mapTo(function cancelEditReducer(data) {
  //     return {...data, editing: false};
  //   });

  // const toggleReducer$ = actions.toggle$
  //   .map(isToggled => function toggleReducer(data) {
  //     return {...data, completed: isToggled};
  //   });

  // const destroyReducer$ = actions.destroy$
  //   .mapTo(function destroyReducer(data) {
  //     return void 0;
  //   });
  const initReducer$ = xs.of(prevState => {
    return prevState === undefined ? { name: "", pass: "", register: false, passVerify: "" } : prevState
  })
  const fields$ = xs.merge(actions.name$, actions.pass$)
    .map((val) => prev => ({ ...prev, ...val }))


  const login$ = actions.login$
    .mapTo(prev => (prev.register? { ...prev, name: "", pass: "" } :{ ...prev, passVerify: "", name: "", pass: "" }))

  const register$ = actions.register$.mapTo(prev => ({ ...prev, register: !prev.register }))

  const facebook$ = actions.facebook$.mapTo(prev=>{window.location = '/auth/facebook'})
  const google$ = actions.google$.mapTo(prev=>{window.location = '/auth/google'})

  return xs.merge(
    initReducer$,
    fields$,
    login$,
    register$,
    facebook$,
    google$,
    // name$,
    // startEditReducer$,
    // doneEditReducer$,
    // cancelEditReducer$,
    // toggleReducer$,
    // destroyReducer$
  );
}
