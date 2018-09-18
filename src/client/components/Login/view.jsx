import Snabbdom from 'snabbdom-pragma';
import xs from 'xstream';

export default function view(state$) {
  return state$.map(state=>{
    var {register, name, pass, passVerify} = state
    return (
    <div>
      <h3>Login</h3>
      <input className="nameJs" value={name} placeholder="name"/>
      <input className="passJs" value={pass} placeholder="pass"/>
      {register && (<input classname="passVerifyJs" value={passVerify} placeholder="pass verify"/>)}
      <button className="loginJs">{register? "submit" : "login"}</button>
      <button className="registerJs">register</button>
      <br></br>
      <button className="oauthFacebookJs">Login with facebook</button>
      <button className="oauthGoogleJs">Login with google</button>
    </div>
  )});
}