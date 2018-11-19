import xs from 'xstream';

export default function intent(dom) {
	return {
		submit$: dom.select('.submitJs').events('click'),
		name$: dom
			.select('.nameJs')
			.events('input')
			.map(e => ({ name: e.target.value })),
		pass$: dom
			.select('.passJs')
			.events('input')
			.map(e => ({ pass: e.target.value })),
		passVerify$: dom
			.select('.passVerifyJs')
			.events('input')
			.map(e => ({ pass: e.target.value })),
		email$: dom
			.select('.emailJs')
			.events('input')
			.map(e => ({ pass: e.target.value })),
		facebook$: dom.select('.oauthFacebookJs').events('click'),
		google$: dom.select('.oauthGoogleJs').events('click')
	};
}
