import xs from 'xstream';
import Snabbdom from 'snabbdom-pragma';


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

      </ol>
    </nav>
  );
}

export default function view(vdom$, path$, result$) {
  return xs.combine(vdom$, path$,result$).map(([vdom, { pathname }, result]) =>{
    // console.log(results)
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
        footer
        {/* {JSON.stringify(result)} {result} */}
      </footer>
    </div>)
  }
  );
}