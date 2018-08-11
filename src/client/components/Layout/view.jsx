import xs from 'xstream';
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

function renderHeader(state) {
  return (
    <header>
      <h1>makpal</h1>
    </header>
  )
}

function renderMainSection(state, login) {

  return(
    <section class="main">
      <Login />
    </section>
  )
}

function renderFooter(state) {
  return (
    <footer>
      footer
    </footer>
  )
}

// export default function view(state$, listVDom$, loginVDOM$) {
//   return xs.combine(state$, listVDom$, loginVDOM$).map(([state, listVDom, loginVDom]) =>
//   <div>
//     {renderHeader(state)}
//     {renderMainSection(state, loginVDom)}
//     {renderFooter(state)}
//   </div>
//   );
// };
