import xs, { Stream } from 'xstream';
import sampleCombine from 'xstream/extra/sampleCombine';
import { VNode, DOMSource } from '@cycle/dom';
import { StateSource } from 'cycle-onionify';


// Types

// State

export const defaultState = { text: 'Edit me!' };
// export var Reducer = (prev? => State | undefined;

// Actions
const SPEECH = 'speech',
    NAVIGATE = 'navigate',
    UPDATE = 'update';

// type Action = SpeechAction | NavigationAction | UpdateAction;

export function Speaker({ DOM, onion }) {
    const action$= intent(DOM);

    return {
        DOM: view(onion.state$),
        speech: speech(action$, onion.state$),
        onion: onionFn(action$),
        router: router(action$)
    };
}

function router(action$) {
    return action$.filter(({ type }) => type === NAVIGATE).mapTo('/');
}

function speech(
    action$,
    state$
) {
    return action$
        .filter(({ type }) => type === SPEECH)
        .compose(sampleCombine(state$))
        .map(([_, s]) => s.text);
}

function intent(DOM) {
    const updateText$ = DOM.select('#text')
        .events('input')
        .map((ev) => ev.target.value)
        .map((value) => ({
            type: UPDATE,
            reducer: () => ({ text: value })
        }));

    const speech$ = DOM.select('[data-action="speak"]')
        .events('click')
        .mapTo<Action>({ type: SPEECH });

    const navigation$ = DOM.select('[data-action="navigate"]')
        .events('click')
        .mapTo<Action>({ type: NAVIGATE });

    return xs.merge(updateText$, speech$, navigation$);
}

function onionFn(action$) {
    const init$ = xs.of(
        prevState => (prevState === undefined ? defaultState : prevState)
    );

    const update$ = action$
        .filter(({ type }) => type === UPDATE)
        .map((action) => action.reducer);

    return xs.merge(init$, update$);
}

function view(state$) {
    return state$.map(({ text }) => (
        <div>
            <h2>My Awesome Cycle.js app - Page 2</h2>
            <textarea id="text" rows="3" value={text} />
            <button type="button" data-action="speak">
                Speak to Me!
            </button>
            <button type="button" data-action="navigate">
                Page 1
            </button>
        </div>
    ));
}
