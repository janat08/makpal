import intent from './intent';
import model from './model';
import view from './view.jsx';
import xs from 'xstream';
import {LOGIN, CURRENTUSER} from '../../gql';
import delay from 'xstream/extra/delay';

export default function Login({DOM, state, apollo}) {
	const action = {...intent(DOM), result$: apollo.select('login').flatten().map(x=>x.data.login)};

	const submitLogin$ = action.submit$.map(x=>{
		return state.stream.map(x=>{
			return xs.of({
				mutation:  LOGIN,
				variables: {input: {usernameOrEmail: x.name, password: x.pass}},
				category: 'login'
			});
		}).flatten().take(1);
	}).flatten();

	var testUser$ = action.result$.map(x=>{
		apollo.client.writeQuery({ query: CURRENTUSER, data: { currentUser: x.user } });
		return xs.of({
			query: CURRENTUSER,
			category: 'currentUser'
		});
	}).flatten();

	const reducer$ = model(action);
	const vdom$ = view(state.stream);

	const hasLoggedIn$ = state.stream.filter(x=>x.completed)
		.compose(delay(1000));

	return {
		// router: action$.register$.map(x=>{return x}).mapTo({pathname: "/", state: {some:"state"}}).mapTo("/"),
		DOM: vdom$,
		state: reducer$,
		apollo: xs.merge(submitLogin$, testUser$),
	};
}
