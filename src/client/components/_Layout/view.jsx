import xs from 'xstream';
import Snabbdom from 'snabbdom-pragma';


function navigation(pathname, hasLoggedIn) {
  var sessionState = hasLoggedIn? 
  (<a class="logoutJs" href="#" style={pathname.startsWith('/logout') ? 'font-weight:bold' : ''}>Log out</a>)
  : (<a class="loginJs" href="/login" style={pathname.startsWith('/login') ? 'font-weight:bold' : ''}>Log in</a>)

  return (
    <nav>
      <ol>
        <li>
          <a class="homeJs" href="/" style={pathname.startsWith('/') ? 'font-weight:bold' : ''}>Makpal</a>
        </li>
        <li>
          <a class="secondHomeJs" href="/secondHome" style={pathname.startsWith('/secondHome') ? 'font-weight:bold' : ''}>Makpal2</a>
        </li>
        <li>
          {sessionState}
        </li>
        <li>
          <a href="/profile" style={pathname.startsWith('/profile') ? 'font-weight:bold' : ''}>Profile</a>
        </li>

      </ol>
    </nav>
  );
}

export default function view(vdom$, path$, hasLoggedIn$) {
  return xs.combine(vdom$, path$, hasLoggedIn$).map(([vdom, { pathname }, hasLoggedIn]) =>{
    // console.log(results)
    return (<div className="main-wrapper">
      <header>
        <h1>makpal</h1>
      </header>
      <nav>
        {navigation(pathname, hasLoggedIn)}
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