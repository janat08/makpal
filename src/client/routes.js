import { Counter } from './components/counter';
import { Speaker } from './components/speaker';

export const routes = {
    '/': { component: Counter, scope: 'counter' },
    '/p2': { component: Speaker, scope: 'speaker' }
};

export const initialRoute = '/';
