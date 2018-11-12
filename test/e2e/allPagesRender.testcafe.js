import { Selector } from 'testcafe';

fixture `Pages render`
    .page `http://localhost:4000`;

test('Navbar/pages work', async t => {
    await t
        .expect(Selector('h1').withText('Home').exists).ok()
        .click(Selector('a').withText('Log in'))
        .expect(Selector('h3').withText('Авторизация')).ok();
});