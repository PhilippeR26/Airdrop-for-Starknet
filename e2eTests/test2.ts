import { Selector } from 'testcafe';

fixture('First test')
    .page('http://localhost:3000');

test('My first test', async t => {
    await t
        .typeText('#developer-name', 'John Smith')
        .click('#submit-button')
        .expect(Selector('#article-header').innerText).eql('Thank you, John Smith!');
});