import BackgroundCPUAttack from './';
import child_process, { ChildProcess } from 'child_process';

const sendFn = jest.fn();
const killFn = jest.fn();
const onFn = jest.fn((_msg, cb) => cb());
jest
  .spyOn(child_process, 'fork')
  .mockImplementation(
    () =>
      (({ send: sendFn, kill: killFn, on: onFn } as unknown) as ChildProcess)
  );

describe('when defaults are used', () => {
  it('forks 4 threads with infinite runTime', async () => {
    const attack = new BackgroundCPUAttack();
    await attack.start();
    expect(child_process.fork).toHaveBeenCalledTimes(4);
    expect(sendFn).toHaveBeenCalledTimes(4);
    expect(sendFn).toHaveBeenCalledWith({ runTime: Infinity });
    expect(killFn).not.toHaveBeenCalled();
  });
});

describe('when the process takes some time to initialise', () => {
  it('waits', async () => {
    onFn.mockImplementationOnce((_msg, cb) => setTimeout(cb, 20));
    const attack = new BackgroundCPUAttack({ threads: 1 });
    const time = Date.now();
    await attack.start();
    expect(Date.now() - time).toBeGreaterThan(20);
  });
});

describe('when stop is called', () => {
  it('kills all the processes', async () => {
    const attack = new BackgroundCPUAttack();
    await attack.start();
    expect(killFn).not.toHaveBeenCalled();
    attack.stop();
    expect(killFn).toHaveBeenCalledTimes(4);
  });
});

describe('.configure', () => {
  it('returns a function which creates a new attack with the given options', () => {
    const createAttack = BackgroundCPUAttack.configure({
      threads: 1,
    });
    expect(createAttack).toEqual(expect.any(Function));
    const attack = createAttack();
    expect(attack).toBeInstanceOf(BackgroundCPUAttack);
    expect(attack.threads).toBe(1);
  });
});
