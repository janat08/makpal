import xs from 'xstream';

var allFieldsInAuth = {
	name: '',
	pass: '',
	passVerify: '',
	email: '',
	completed: true
};

export default function model(actions) {
	const initReducer$ = xs.of(prevState => {
		var init = { email: '', complete: false };
		return prevState === undefined ? init : Object.assign({}, init, prevState);
	});

	const fields$ = xs
		.merge(actions.email$)
		.map(val => prev => ({ ...prev, ...val }));

	const completed$ = actions.result$.map(x => {
		return prev => ({ ...prev, ...allFieldsInAuth });
	});

	const facebook$ = actions.facebook$.mapTo(prev => {
		window.location = '/auth/facebook';
	});
	const google$ = actions.google$.mapTo(prev => {
		window.location = '/auth/google';
	});

	return xs.merge(completed$, initReducer$, fields$, facebook$, google$);
}
