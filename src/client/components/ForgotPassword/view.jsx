import Snabbdom from 'snabbdom-pragma';
import xs from 'xstream';
import SSO from '../views/sso';

export default function view(state$) {
	return state$.map(state=>{
		var {email, error, completed} = state;
		var autocompletePass;
		return (
			<div>
				<h3>Восстановление пароля</h3>
				{/* {error == "validEmail" && <h5>пользователь/почта не найдены</h5>} */}
				{completed && <h5>Почта для восстановления выслона</h5>}
				<input className="emailJs" value={email} required placeholder="email" autoComplete="email"/>
				<button className="submitJs">Восстановить</button>
				<a href="/register">Регистрация</a>
				<br/>
				<a href="/login">Авторизация</a>
				<br></br>
				{SSO()}
			</div>
		);});
}