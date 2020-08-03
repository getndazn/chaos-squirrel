import { startCPU } from '@dazn/chaos-squirrel-cpu';
import './fork';

describe('when a message is received', () => {
  it('starts a CPU attack', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    process.emit('message', {});
    expect(startCPU).toHaveBeenCalledTimes(1);
    expect(startCPU).toHaveBeenCalledWith({
      runTime: Infinity,
      allowLoopEvery: Infinity,
    });
  });
});
