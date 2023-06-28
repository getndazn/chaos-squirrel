import middleware, { ChaosContext } from './';
import Runner from '@dazn/chaos-squirrel-runner';
import middy from '@middy/core';

const logger = jest.fn();

const runnerConfig = {
  possibleAttacks: [],
  logger,
};

const m = middleware({ createRunner: Runner.configure(runnerConfig) });

it('returns a before, after and onError function', () => {
  expect(m.before).toEqual(expect.any(Function));
  expect(m.after).toEqual(expect.any(Function));
  expect(m.onError).toEqual(expect.any(Function));
});

describe('when before is called', () => {
  it('starts a new chaos runner', () => {
    jest.spyOn(Runner.prototype, 'start');
    m.before!({ context: {} } as middy.Request);
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
      fn!({ context: {} } as middy.Request);
      expect(Runner.prototype.stop).not.toHaveBeenCalled();
    });
  });

  describe('when there is a runner on the context', () => {
    it('stops the runner', () => {
      jest.spyOn(Runner.prototype, 'stop');
      const context = {};
      m.before!({ context } as middy.Request);
      fn!({ context } as middy.Request);
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
    await m.before!({ context } as middy.Request);
    expect(started).toBe(wait ? true : false);
    await m.after!({ context } as middy.Request);
    expect(stopped).toBe(wait ? true : false);
  });
});

describe('when configured with a createLogger option', () => {
  it('overwrites any runner logger with the created logger', async () => {
    const middlewareLogger = jest.fn();
    const context = {};
    const m = middleware({
      createRunner: Runner.configure({ ...runnerConfig, probability: 0 }),
      createLogger: (calledContext) => {
        // assert context is passed to function so we can use correlationIds
        expect(calledContext).toBe(context);
        return middlewareLogger;
      },
    });

    await m.before!({ context } as middy.Request);
    expect(logger).not.toHaveBeenCalled();
    expect((context as ChaosContext).chaosRunner!.logger).toBe(
      middlewareLogger
    );
  });
});
