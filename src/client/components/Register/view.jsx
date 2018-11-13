import Snabbdom from 'snabbdom-pragma';
import xs from 'xstream';
import SSO from '../views/sso';

export default function view(state$) {
	return state$.map(state=>{
		var {name, pass, passVerify, email, error, completed } = state;
		return (
			<div>
				<h3>Регистрация</h3>
				{completed && <h5>Вы зарегестрировалиь, потвердите почту</h5>}
				{error == 'usernameIsExisted' && <h5>пользователь зарегистрирован</h5>}
				<input className="nameJs" value={name} required placeholder="пользователь" autoComplete="username"/>
				{error == 'emailIsExisted' && <h5>почта зарегистрирована</h5>}
				<input className="emailJs" value={email} required placeholder="почта" autoComplete="email"/>
				{error == 'verifiedPassword' && <h5>пароли не совподают</h5>}
				<input className="passJs" type="password" value={pass} required placeholder="пароль" autoComplete="new-password"/>
				<input className="passVerifyJs" type="password" value={passVerify} required placeholder="пароль потвердить" autoComplete="new-password"/>
				<button className="submitJs">Зарегаться</button>
				<a href="/login">Авторизация</a>
				<br/>
				<a href="/forgotPassword">Восстановление пароля</a>
				<br/>
				{SSO()}

			</div>
		);});
}