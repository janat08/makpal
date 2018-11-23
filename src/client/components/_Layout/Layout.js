import xs from "xstream";
import isolate from "@cycle/isolate";
import { extractSinks } from "cyclejs-utils";

import view from "./view.jsx";
import intent from "./intent";

import flattenConcurrently from "xstream/extra/flattenConcurrently";
import notificationLens from "../notificationLens.js";
import authRedirectBackLens from "../authRedirectBackLens.js";

// // PAGES
import Login from "../Login/Login.js";
import Home from "../Home/Home.jsx";
import ForgotPassword from "../ForgotPassword/ForgotPassword.js";
import Register from "../Register/Register.js";

import { LOGIN, COUNTER, CURRENTUSER, LOGOUT } from "../../gql.js";

const defaultState = {
	//used to tell how many times back to redirect
};

export default function Layout(sources) {
	const { apollo, DOM, router, cookie, state, history } = sources;
	window.apollo = apollo.client;
	var actions = intent(DOM);
	var logout$ = actions.logout$.map((x) => {
		apollo.client.resetStore();
		console.log("logging");
		return {
			mutation: LOGOUT,
			category: "logout"
		};
	});

	logout$.debug("logout").subscribe({});

	var currentUser$ = xs.of({
		query: CURRENTUSER,
		category: "currentUser"
	});
	//  && x.result.id?true:false
	var hasLoggedIn$ = apollo.select("currentUser").map((x) => x.result && x);
	// hasLoggedIn$.map(x=>{
	//   console.log(apollo, "apollo")
	//   apollo.client.cache.reset()
	//   console.log(apollo.client.cache)
	//   return x
	// }).subscribe({})
	hasLoggedIn$.debug("user").subscribe({});

	const routes$ = router.define({
		"/": Home,
		"/secondHome": Home,
		//something must be embedded because of a bug relating to if/when '*' is detected
		"/login": { "/": Login },
		"/forgotPassword": ForgotPassword,
		"/register": Register,
		"*": function() {
			return {
				DOM: xs.of(
					<div>
						<h1> 404</h1> <h4> doesn't exist</h4>
					</div>
				)
			};
		}
	});

	const initReducer$ = xs.of((prevState) =>
		prevState === undefined ? defaultState : prevState
	);

	const history$ = history;

	const page$ = routes$.map(({ path, value }) => {
		var newSources = Object.assign({}, sources, {
			router: router.path(path)
		});
		if (filterAuthRoutes(true, "path")({ path })) {
			return isolate(value, "auth")(newSources);
		}
		// return isolate(value, authRedirectBackLens("page"))(newSources);
		return isolate(value, `${path}`)(newSources);
	});

	function filterAuthRoutes(inOrOut = true, key) {
		return (item) => {
			switch (item[key]) {
				case "/login":
				case "/forgotPassword":
				case "/register":
					return inOrOut;
				//simply for experimenting, as cookied will be used instead for this
				// return isolate(value, authRedirectBackLens("page"))(newSources);
				default:
					return !inOrOut;
			}
		};
	}

	//tracks last route
	const authRedirectBack$ = routes$
		.filter(filterAuthRoutes(false, "path"))
		.map(({ path }) => {
			return lastRouteCookie(path);
		});

	function lastRouteCookie(val) {
		return {
			key: "lastRouteOutsideAuth",
			value: val,
			settings: {
				expires: 3 // expiring in 30 days
			}
		};
	}
	var lastRouteCookie$ = xs.merge(
		xs.of(lastRouteCookie("/")),
		authRedirectBack$
	);

	const PS = extractSinks(page$, ["DOM", "state", "router", "apollo"]);
	const vdom$ = view(PS.DOM, history$, hasLoggedIn$);
	const reducer$ = xs.merge(initReducer$, PS.state);

	return {
		DOM: vdom$,
		state: reducer$,
		apollo: xs.merge(PS.apollo, currentUser$, logout$),
		router: PS.router,
		cookie: xs.merge(lastRouteCookie$)
	};
}
