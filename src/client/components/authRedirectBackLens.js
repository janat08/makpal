//used to redirect to previous route after login
export default function(childScope){
    var lens = {
        get: state => ({[childScope]: state[childScope], authRedirectBack: state.authRedirectBack}),
        set: (state, childState) => {
            var scopedChildState = Object.assign({}, childState)
            delete scopedChildState.authRedirectBack
            console.log(scopedChildState, state,childState, childScope)
            return ({...state, [childScope]: scopedChildState, authRedirectBack: childState.authRedirectBack})
        }
    }
    return {onion: lens}
}