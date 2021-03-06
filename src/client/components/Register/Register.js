import intent from "./intent";
import model from "./model";
import view from "./view.jsx";
import xs from "xstream";
import { REGISTER } from "../../gql";
import delay from "xstream/extra/delay";

export default function ForgotPassword(sources) {
	const action = {
		...intent(DOM),
		result$: apollo.select("register").map((x) => x.data.login)
	};

	const register$ = action.submit$
		.map((x) => {
			return state.stream
				.map((x) => {
					if (x.pass !== x.passVerify) {
						return xs.of({});
					}
					return xs.of({
						mutation: REGISTER,
						variables: {
							input: {
								username: x.name,
								password: x.pass,
								email: x.email
							}
						},
						category: "register"
					});
				})
				.flatten()
				.take(1);
		})
		.flatten();

	const reducer$ = model(action);
	const vdom$ = view(sources.state.stream);

	//link back to previous route instead of just redirecting

	return {
		DOM: vdom$,
		state: reducer$,
		apollo: register$
	};
}
