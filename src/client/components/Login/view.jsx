import Snabbdom from 'snabbdom-pragma';
import xs from 'xstream';

export default function view(state$) {
  return state$.map(state=>{
    var {register, name, pass, passVerify} = state
    var autocompletePass
    return (
    <div>
      <h3>Login</h3>
      <input className="nameJs" value={name} required placeholder="name or email"/>
      <input className="passJs" type="password" autocomplete="current-password" value={pass} required placeholder="pass"/>
      {register && (<input classname="passVerifyJs" type="password" value={passVerify} placeholder="pass verify"/>)}
      <button className="submitJs">submit</button>
      <button className="registerJs">switch to {register? "login" : "register"}</button>
      <button className="forgotPasswordJs">Forgot your password?</button>
      <br></br>
      <button className="oauthFacebookJs">Login with facebook</button>
      <button className="oauthGoogleJs">Login with google</button>
    </div>
  )});
}