import CPUAttack from './';

describe('when allowLoopEvery is set to 10ms', () => {
  it('blocks CPU until each allowLoopEvery interval is reached', (done) => {
    const start = Date.now();

    const attack = new CPUAttack({ allowLoopEvery: 10 });
    attack.start();

    setImmediate(() => {
      attack.stop();
      const end = Date.now();
      // should block for at least the 10ms
      expect(end).toBeGreaterThanOrEqual(start + 10);
      // shouldn't block for too long
      expect(end).toBeLessThan(start + 15);
      done();
    });
  });
});

describe('when runTime is set to 10ms', () => {
  it('stops when the runTime is passed', (done) => {
    const start = Date.now();

    const attack = new CPUAttack({ runTime: 10 });
    attack.start();

    setImmediate(() => {
      const end = Date.now();
      // should block for at least the 10ms
      expect(end).toBeGreaterThanOrEqual(start + 10);
      // shouldn't block for too long
      expect(end).toBeLessThan(start + 15);
      done();
    });
  });
});

describe('when defaults are used', () => {
  it('runs until stopped, allowing one event loop every second', (done) => {
    const start = Date.now();

    const attack = new CPUAttack();
    attack.start();

    setImmediate(() => {
      const firstLoop = Date.now();
      // should block for at least the 10ms
      expect(firstLoop).toBeGreaterThanOrEqual(start + 1000);
      // shouldn't block for too long
      expect(firstLoop).toBeLessThan(start + 1010);

      setImmediate(() => {
        attack.stop();
        const end = Date.now();
        // should block for at least the 10ms
        expect(end).toBeGreaterThanOrEqual(start + 2000);
        // shouldn't block for too long
        expect(end).toBeLessThan(start + 2020);
        done();
      });
    });
  });
});

describe('.configure', () => {
  it('returns a function which creates a new attack with the given options', () => {
    const createAttack = CPUAttack.configure({
      allowLoopEvery: 5,
    });
    expect(createAttack).toEqual(expect.any(Function));
    const attack = createAttack();
    expect(attack).toBeInstanceOf(CPUAttack);
    expect(attack.allowLoopEvery).toBe(5);
  });
});
