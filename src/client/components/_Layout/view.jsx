import xs from 'xstream';
import Snabbdom from 'snabbdom-pragma';


// export default function view(state$) {
//   return state$.map(jsx);
// }

function snab (){
  return div([
    input({attrs: {type: 'checkbox'}}), 'Toggle me',
    p("ON")
  ])
}

var a = <div> example </div>

function jsx({count}){
  return  <div>
    {a}
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

function navigation(pathname) {

  return (
    <nav>
      <ol>
        <li>
          <a href="/" style={pathname.startsWith('/') ? 'font-weight:bold' : ''}>Makpal</a>
        </li>
        <li>
          <a href="/login" style={pathname.startsWith('/login') ? 'font-weight:bold' : ''}>Login</a>
        </li>
        <a href="/losssgin" style={pathname.startsWith('/login') ? 'font-weight:bold' : ''}>Losssgin</a>

      </ol>
    </nav>
  );
}

export default function view(vdom$, path$, results$) {
  return xs.combine(vdom$, path$, results$).map(([vdom, { pathname }, results]) =>{
    console.log(results)
    return (<div className="main-wrapper">
      <header>
        <h1>makpal</h1>
      </header>
      <nav>
        {navigation(pathname)}
      </nav>
      <div className="header-wrapper">
      </div>
      <section class="main">
        {vdom}
      </section>
      <footer>
        footer 1
        {JSON.stringify(results)} {results}
      </footer>
    </div>)
  }
  );
}