jest.mock('@dazn/chaos-squirrel-attack-memory');
import MemoryAttack from '@dazn/chaos-squirrel-attack-memory';
import './fork';

describe('when a message is received', () => {
  it('starts a memory attack', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    process.emit('message', { size: 5 });
    expect(MemoryAttack).toHaveBeenCalledTimes(1);
    expect(MemoryAttack).toHaveBeenCalledWith({
      size: 5,
    });
    expect(MemoryAttack.prototype.start).toHaveBeenCalledTimes(1);
  });
});
