import { Selector } from 'testcafe';
import createTestCafe from 'testcafe';

const runner = await createTestCafe();

await runner.run({
    disableNativeAutomation: true;
});
fixture('First test')
    .page('https://devexpress.github.io/testcafe/example');

test('My first test', async t => {
    await t
        .typeText('#developer-name', 'John Smith')
        .click('#submit-button')
        .expect(Selector('#article-header').innerText).eql('Thank you, John Smith!');
});