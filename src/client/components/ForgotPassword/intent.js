import xs from "xstream";

export default function intent(dom) {
	return {
		submit$: dom.select(".submitJs").events("click"),
		email$: dom
			.select(".emailJs")
			.events("input")
			.map((e) => ({ name: e.target.value })),
		facebook$: dom.select(".oauthFacebookJs").events("click"),
		google$: dom.select(".oauthGoogleJs").events("click")
	};
}
