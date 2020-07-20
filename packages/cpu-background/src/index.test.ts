import { startCPUBackground } from './';
import child_process, { ChildProcess } from 'child_process';

const sendFn = jest.fn();
const killFn = jest.fn();
jest
  .spyOn(child_process, 'fork')
  .mockImplementation(
    () => (({ send: sendFn, kill: killFn } as unknown) as ChildProcess)
  );

describe('when defaults are used', () => {
  it('forks 4 threads with infinite runTime', () => {
    startCPUBackground();
    expect(child_process.fork).toHaveBeenCalledTimes(4);
    expect(sendFn).toHaveBeenCalledTimes(4);
    expect(sendFn).toHaveBeenCalledWith({ runTime: Infinity });
    expect(killFn).not.toHaveBeenCalled();
  });
});

describe('when stop is called', () => {
  it('forks 4 threads with infinite runTime', () => {
    const attack = startCPUBackground();
    expect(killFn).not.toHaveBeenCalled();
    attack.stop();
    expect(killFn).toHaveBeenCalledTimes(4);
  });
});
