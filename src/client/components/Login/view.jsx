import Snabbdom from 'snabbdom-pragma';
import xs from 'xstream';

export default function view(state$) {
  return state$.map(state=>(
    <div>
      <h3>Login</h3>
      <input className="nameJs" />
      <input className="passJs" />
      <button className="loginJs">login</button>
      <button className="registerJs">register</button>
    </div>
  ));
}