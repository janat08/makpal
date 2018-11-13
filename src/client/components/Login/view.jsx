import Snabbdom from 'snabbdom-pragma';
import xs from 'xstream';
import SSO from '../views/sso';

export default function view(state$) {
	return state$.map(state=>{
		var {name, pass, error, completed} = state;
		return (
			<div>
				<h3>Авторизация</h3>
				{completed && <h5>Вы Авторизованы</h5>}
				{error == 'validEmail' && <h5>пользователь/почта не найдены</h5>}
				{error == 'emailConfirmation' && <h5>почта пользователя не подтверждена</h5>}
				<input className="nameJs" value={name} required placeholder="почта/пользователь" autoComplete="username email"/>
				{error == 'validPassword' && <h5>пароль не совподает</h5>}
				<input className="passJs" type="password" autoComplete="current-password" value={pass} required placeholder="пароль"/>
				<button className="submitJs">Войти</button>
				<a href="/register">Регистрация</a>
				<br/>
				<a href="/forgotPassword">Восстановление пароля</a>
				<br/>
				{SSO()}

			</div>
		);});
}