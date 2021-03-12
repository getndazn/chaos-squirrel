import wrapper from './';
import Runner from '@dazn/chaos-squirrel-runner';

const logger = jest.fn();

const runnerConfig = {
  possibleAttacks: [],
  logger,
};

const myFunction = async (number: number): Promise<number> => number + 1;

describe('Wrapper Runner', () => {
  it('wraps a function in chaos', async () => {
    const myFunctionWithChaos = wrapper(myFunction, {
      createRunner: Runner.configure(runnerConfig),
    });

    expect(await myFunction(1)).toBe(2);
    expect(await myFunctionWithChaos(1)).toBe(2);
  });

  describe.each([true, false])('when wait is set to %s', (wait) => {
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

      const myFunctionWithChaos = wrapper(
        async () => {
          expect(started).toBe(wait ? true : false);
        },
        {
          createRunner: Runner.configure(runnerConfig),
          wait,
        }
      );

      await myFunctionWithChaos();
      expect(stopped).toBe(wait ? true : false);
    });
  });
});
