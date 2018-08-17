import xs from 'xstream';
import {ENTER_KEY, ESC_KEY} from '../../utils';

export default function intent(domSource) {

  return {
    click$: domSource
      .select('.jslogin').events('click')
      .mapTo(null),
  }
}
