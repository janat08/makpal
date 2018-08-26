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
  const initReducer$ = xs.of(prevState=>{
    return prevState === undefined ? {name: "", pass: ""} : prevState
  })
  const fields$ = actions.fields$
    .map((stuff)=> function(prev){
      console.log(stuff, "unde")
      return {...prev}
    })


    const login$ = actions.login$
    .mapTo(prev=>{
      console.log(prev.name, prev.pass)
      return initReducer$
      // return ()=>console.log("testing")
    })
    // const name$ = actions.name$.map(prev=>{

    // })
  return xs.merge(
    initReducer$,
    fields$,
    login$,
    // name$,
    // startEditReducer$,
    // doneEditReducer$,
    // cancelEditReducer$,
    // toggleReducer$,
    // destroyReducer$
  );
}
