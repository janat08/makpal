export default function(childScope){
    // var childState = 
    var notification = {
        get: state => ({[childScope]: state[childScope], notifications: state.notifications}),
        set: (state, childState) => {
            var scopedChildState = Object.assign({}, childState)
            delete scopedChildState.notifications
            ({...state, [childScope]: scopedChildState, notifications: childState.notifications})
        }
    }
    return
}