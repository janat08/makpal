import xs, { Stream } from 'xstream';
import { VNode, DOMSource } from '@cycle/dom';
import { StateSource } from 'cycle-onionify';


export const defaultState = {
    count: 30
};

export function Counter({ DOM, onion }) {
    const action$ = intent(DOM);
    const vdom$ = view(onion.state$);

    const routes$ = DOM.select('[data-action="navigate"]')
        .events('click')
        .mapTo('/p2');

    return {
        DOM: vdom$,
        onion: action$,
        router: routes$
    };
}

function intent(DOM) {
    const init$ = xs.of(
        prevState => (prevState === undefined ? defaultState : prevState)
    );

    const add$ = DOM.select('.add')
        .events('click')
        .mapTo(state => ({ ...state, count: state.count + 1 }));

    const subtract$ = DOM.select('.subtract')
        .events('click')
        .mapTo(state => ({ ...state, count: state.count - 1 }));

    return xs.merge(init$, add$, subtract$);
}

function view(state$) {
    return state$.map(({ count }) => (
        <div>
            <h2>My Awesome Cycle.js app - Page 1</h2>
            <span>{'Counter: ' + count}</span>
            <button type="button" className="add">
                Increase
            </button>
            <button type="button" className="subtract">
                Decrease
            </button>
            <button type="button" data-action="navigate">
                Page 2
            </button>
        </div>
    ));
}
