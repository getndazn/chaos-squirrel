import MemoryAttack from './';
import buffer from 'buffer';

describe('when provided a small buffer size', () => {
  it('creates a small buffer', () => {
    const attack = new MemoryAttack({ size: 5 });
    attack.start();
    expect(attack.buffers).toHaveLength(1);
    expect(Buffer.byteLength(attack.buffers[0])).toBe(5);
  });
});

describe('when given default', () => {
  it('creates buffer of the max buffer length', () => {
    const attack = new MemoryAttack();
    attack.start();
    expect(attack.buffers).toHaveLength(1);
    expect(Buffer.byteLength(attack.buffers[0])).toBe(
      buffer.constants.MAX_LENGTH
    );
    attack.stop();
    expect(attack.buffers).toHaveLength(0);
  });
});

describe('when given lengths larger than the max buffer length', () => {
  it('creates multiple buffers', () => {
    const attack = new MemoryAttack({
      size: buffer.constants.MAX_LENGTH + 1,
    });
    attack.start();
    expect(attack.buffers).toHaveLength(2);
    expect(Buffer.byteLength(attack.buffers[0])).toBe(
      buffer.constants.MAX_LENGTH
    );
    expect(Buffer.byteLength(attack.buffers[1])).toBe(1);
    attack.stop();
    expect(attack.buffers).toHaveLength(0);
  });
});

describe('when given progressive attack options', () => {
  beforeAll(() => jest.useFakeTimers());
  afterAll(() => jest.useRealTimers());

  it('progressively allocates memory', () => {
    const attack = new MemoryAttack({
      size: 20,
      stepSize: 10,
      stepTime: 100,
    });
    attack.start();

    expect(setInterval).toHaveBeenCalled();

    expect(attack.buffers).toHaveLength(1);
    expect(Buffer.byteLength(attack.buffers[0])).toBe(10);

    jest.advanceTimersByTime(100);

    expect(attack.buffers).toHaveLength(2);
    expect(Buffer.byteLength(attack.buffers[0])).toBe(10);

    jest.advanceTimersByTime(100);

    expect(attack.buffers).toHaveLength(2);

    attack.stop();

    expect(attack.buffers).toHaveLength(0);
    expect(clearInterval).toHaveBeenCalled();
  });
});

describe('.configure', () => {
  it('returns a function which creates a new attack with the given options', () => {
    const createAttack = MemoryAttack.configure({
      size: 5,
    });
    expect(createAttack).toEqual(expect.any(Function));
    const attack = createAttack();
    expect(attack).toBeInstanceOf(MemoryAttack);
    expect(attack.size).toBe(5);
  });
});
