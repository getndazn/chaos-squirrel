import BackgroundMemoryAttack from './';
import child_process, { ChildProcess } from 'child_process';
import buffer from 'buffer';

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
  it('forks a process with the max buffer length', async () => {
    const attack = new BackgroundMemoryAttack();
    await attack.start();
    expect(child_process.fork).toHaveBeenCalledTimes(1);
    expect(sendFn).toHaveBeenCalledTimes(1);
    expect(sendFn).toHaveBeenCalledWith({ size: buffer.constants.MAX_LENGTH });
    expect(killFn).not.toHaveBeenCalled();
  });
});

describe('when the process takes some time to initialise', () => {
  it('waits', async () => {
    onFn.mockImplementationOnce((_msg, cb) => setTimeout(cb, 10));
    const attack = new BackgroundMemoryAttack();
    const time = Date.now();
    await attack.start();
    expect(Date.now() - time).toBeGreaterThanOrEqual(10);
  });
});

describe('when stop is called', () => {
  it('kills all the processes', async () => {
    const attack = new BackgroundMemoryAttack();
    await attack.start();
    expect(killFn).not.toHaveBeenCalled();
    attack.stop();
    expect(killFn).toHaveBeenCalledTimes(1);
  });
});

describe('when stop is called without start', () => {
  it('does nothing', () => {
    const attack = new BackgroundMemoryAttack();
    attack.stop();
    expect(killFn).not.toHaveBeenCalled();
  });
});

describe('.configure', () => {
  it('returns a function which creates a new attack with the given options', () => {
    const createAttack = BackgroundMemoryAttack.configure({
      size: 1,
    });
    expect(createAttack).toEqual(expect.any(Function));
    const attack = createAttack();
    expect(attack).toBeInstanceOf(BackgroundMemoryAttack);
    expect(attack.size).toBe(1);
  });
});
