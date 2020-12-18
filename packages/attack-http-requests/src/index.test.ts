import HttpAttack from './index';
import got from 'got';

const URL = 'http://postman-echo.com';

const makeRequest = async () => {
  try {
    await got.get(`${URL}/get?foo1=bar1&foo2=bar2`);
    return true;
  } catch (e) {
    return false;
  }
};

const createXRequests = (num: number) =>
  Promise.all(new Array(num).fill(makeRequest()));

test('If configuration disabled, requests always return true', async () => {
  const results = await createXRequests(10);
  expect(results).not.toContain(false);
});

test('If stopped requests do not return false', async () => {
  const attack = new HttpAttack();
  attack.start();
  attack.stop();
  const results = await createXRequests(10);
  expect(results).not.toContain(false);
});

test('If URL passed, requests do not return false', async () => {
  const attack = new HttpAttack({ ignoreURLpatterns: ['postman-echo.com'] });
  attack.start();
  const results = await createXRequests(10);
  expect(results).not.toContain(false);
});

test('If started, requests sometimes return false', async () => {
  const attack = new HttpAttack();
  attack.start();
  const results = await createXRequests(10);
  expect(results).toContain(false);
});
