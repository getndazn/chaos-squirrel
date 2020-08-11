import middleware from './';
import Runner from '@dazn/chaos-squirrel-runner';
import { HandlerLambda } from 'middy';

const runnerConfig = {
  possibleAttacks: [],
};

// middy types seem to expect this even when using async
const next = jest.fn();

const m = middleware({ createRunner: Runner.configure(runnerConfig) });

it('returns a before, after and onError function', () => {
  expect(m.before).toEqual(expect.any(Function));
  expect(m.after).toEqual(expect.any(Function));
  expect(m.onError).toEqual(expect.any(Function));
});

describe('when before is called', () => {
  it('starts a new chaos runner', () => {
    jest.spyOn(Runner.prototype, 'start');
    m.before!({ context: {} } as HandlerLambda, next);
    expect(Runner.prototype.start).toHaveBeenCalledTimes(1);
  });
});

describe.each([
  ['after', m.after],
  ['onError', m.onError],
])('when %s is called', (_name, fn) => {
  describe('when the runner has not been started', () => {
    it('does nothing', () => {
      jest.spyOn(Runner.prototype, 'stop');
      fn!({ context: {} } as HandlerLambda, next);
      expect(Runner.prototype.stop).not.toHaveBeenCalled();
    });
  });

  describe('when there is a runner on the context', () => {
    it('stops the runner', () => {
      jest.spyOn(Runner.prototype, 'stop');
      const context = {};
      m.before!({ context } as HandlerLambda, next);
      fn!({ context } as HandlerLambda, next);
      expect(Runner.prototype.stop).toHaveBeenCalledTimes(1);
    });
  });
});

describe.each([true, false])('when wait is set to %s', (wait) => {
  const m = middleware({
    createRunner: Runner.configure(runnerConfig),
    wait,
  });

  it(`${
    wait ? 'waits' : 'does not wait'
  } for start/stop promises to resolve`, async () => {
    let started = false;
    let stopped = false;
    jest.spyOn(Runner.prototype, 'start').mockImplementation(
      () =>
        new Promise((resolve) =>
          setImmediate(() => {
            started = true;
            resolve();
          })
        )
    );
    jest.spyOn(Runner.prototype, 'stop').mockImplementation(
      () =>
        new Promise((resolve) =>
          setImmediate(() => {
            stopped = true;
            resolve();
          })
        )
    );

    const context = {};
    await m.before!({ context } as HandlerLambda, next);
    expect(started).toBe(wait ? true : false);
    await m.after!({ context } as HandlerLambda, next);
    expect(stopped).toBe(wait ? true : false);
  });
});
