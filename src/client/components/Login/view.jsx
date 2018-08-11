import Snabbdom from 'snabbdom-pragma';

export default function view(state$) {
  return state$.map(jsx);
}

function snab (){
  return div([
    input({attrs: {type: 'checkbox'}}), 'Toggle me',
    p("ON")
  ])
}

function jsx({count}){
  return  <div>
     counter: {count}
     </div>
}