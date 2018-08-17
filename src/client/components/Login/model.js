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
    return prevState === undefined ? {count: 0} : prevState
  })

  const clickedReducer$ = actions.click$
    .mapTo(function(prev){
      return {count: prev.count + 1}
    })

  return xs.merge(
    initReducer$,
    clickedReducer$
    // startEditReducer$,
    // doneEditReducer$,
    // cancelEditReducer$,
    // toggleReducer$,
    // destroyReducer$
  );
}
