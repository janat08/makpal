import xs from 'xstream';

var allFieldsInAuth = {name: '', pass: '', passVerify: '', email: '', completed: true};
export default function model(actions) {
	const initReducer$ = xs.of(prevState => {
		var init = {name: '', pass: '', passVerify: '', email: '', error: '', completed: false};
		return prevState === undefined ? init : Object.assign({}, init, prevState);
	});
  
	const fields$ = xs.merge(actions.name$, actions.pass$, actions.passVerify$, actions.email$)
		.map((val) => prev => ({ ...prev, ...val }));

	const passwordVerified$ = actions.submit$.mapTo(prev=>{
		return { ...prev, error: prev.passVerify == prev.pass? '' : 'verifiedPassword'};
	});

	const completed$ = actions.result$.map(x => {
		if (x.errors != null) {
			return xs.of(prev => ({ ...prev, error: x.errors[0].message }));
		} else if (x.user && x.user.id) {
			return xs.of(prev => ({ ...prev, ...allFieldsInAuth }));
		}
	}).flatten();

	const facebook$ = actions.facebook$.mapTo(prev=>{window.location = '/auth/facebook';});
	const google$ = actions.google$.mapTo(prev=>{window.location = '/auth/google';});

	return xs.merge(
		completed$,
		passwordVerified$,
		initReducer$,
		fields$,
		facebook$,
		google$,
	);
}
