export default function (dom){
    return {
        logout$: dom.select('.logoutJs').events('click'),

    }
}