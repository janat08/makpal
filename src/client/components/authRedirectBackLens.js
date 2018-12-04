//used to redirect to previous route after login
export default function(childScope) {
	var lens = {
		get: (state) => ({
			[childScope]: state[childScope],
			authRedirectBack: state.authRedirectBack
		}),
		set: (state, childState) => {
			var scopedChildState = Object.assign({}, childState);
			delete scopedChildState.authRedirectBack;
			return {
				...state,
				[childScope]: scopedChildState,
				authRedirectBack: childState.authRedirectBack
			};
		}
	};
	return { state: lens };
}
