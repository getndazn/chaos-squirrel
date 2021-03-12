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

describe('when configuration disabled', () => {
  it('requests always return true', async () => {
    const results = await createXRequests(10);
    expect(results).not.toContain(false);
  });
});

describe('when attack is stopped', () => {
  it('no requests fail', async () => {
    const attack = new HttpAttack();
    attack.start();
    attack.stop();
    const results = await createXRequests(10);
    expect(results).not.toContain(false);
  });
});

describe('if ignoreUrlPatterns config is passed', () => {
  test('the requests do not fail', async () => {
    const attack = new HttpAttack({ ignoreUrlPatterns: ['postman-echo.com'] });
    attack.start();
    const results = await createXRequests(10);
    expect(results).not.toContain(false);
  });
});

describe('If attack is started', () => {
  test('some requests fail', async () => {
    const attack = new HttpAttack();
    attack.start();
    const results = await createXRequests(10);
    expect(results).toContain(false);
  });
});
