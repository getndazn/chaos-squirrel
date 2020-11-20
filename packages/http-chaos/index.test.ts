import HttpAttack from './';
import got from 'got';

// TODO: type response
const makeRequest = async () => {
  try {
    // TODO: Do we want to test other HTTP request methods?
    await got.get('http://postman-echo.com/get?foo1=bar1&foo2=bar2');
    return true;
  } catch (e) {
    // TODO: Assert on this error object structure.
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
  expect(typeof attack).toBe('object');
  expect(results).not.toContain(false);
});

test('If started, requests sometimes return false', async () => {
  const attack = new HttpAttack();
  attack.start();
  const results = await createXRequests(10);
  expect(typeof attack).toBe('object');
  expect(results).toContain(false);
});
