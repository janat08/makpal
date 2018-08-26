import xs from 'xstream';
import { ENTER_KEY, ESC_KEY } from '../../utils';

export default function intent(dom) {
  return {
    fields$:
      xs.combine(
        dom.select('.nameJs').events('keyup')
          .map(e => dom.select('.loginJs').events('click').mapTo(e))
          .flatten()
          .map(e => e.target.value),
        dom.select('.passJs').events('keyup')
          .map(e => dom.select('.loginJs').events('click').mapTo(e))
          .flatten()
          .map(e => e.target.value)
      ).map(([name, pass])=>{console.log({name, pass}); return {name, pass}}),
    login$: dom.select('.loginJs').events('click'),
    name$: dom.select('.nameJs').events('input'),
  }
}
