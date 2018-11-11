import xs from 'xstream';

export default function intent(dom) {
  return {
    // fields$:
    //   xs.combine(
    //     dom.select('.nameJs').events('keyup')
    //       // .map(e => dom.select('.loginJs').events('click').mapTo(e))
    //       // .flatten()
    //       .map(e => e.target.value),
    //     dom.select('.passJs').events('keyup')
    //       // .map(e => dom.select('.loginJs').events('click').mapTo(e))
    //       // .flatten()
    //       .map(e => e.target.value)
    //   ).map(([name, pass])=>{console.log({name, pass}); return {name, pass}}),
    submit$: dom.select('.submitJs').events('click'),
    name$: dom.select('.nameJs').events('input').map(e=>({name: e.target.value})),
    pass$: dom.select('.passJs').events('input').map(e=>({pass: e.target.value})),
    facebook$: dom.select('.oauthFacebookJs').events('click'),
    google$: dom.select('.oauthGoogleJs').events('click'),
  }
}
