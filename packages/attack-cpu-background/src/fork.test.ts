jest.mock('@dazn/chaos-squirrel-attack-cpu');
import CPUAttack from '@dazn/chaos-squirrel-attack-cpu';
import './fork';

describe('when a message is received', () => {
  it('starts a CPU attack', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    process.emit('message', {});
    expect(CPUAttack).toHaveBeenCalledTimes(1);
    expect(CPUAttack).toHaveBeenCalledWith({
      runTime: Infinity,
      allowLoopEvery: Infinity,
    });
    expect(CPUAttack.prototype.start).toHaveBeenCalledTimes(1);
  });
});
