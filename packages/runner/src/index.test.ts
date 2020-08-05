import runner from './';
import startCPU from '@dazn/chaos-squirrel-attack-cpu';

describe('when probability is 0', () => {
  it('never runs anything', async () => {
    let times = 1000;
    const start = jest.fn();
    const runs = [];
    while (times--) {
      runs.push(
        runner({
          probability: 0,
          possibleAttacks: [
            {
              name: 'test',
              probability: 1,
              start,
            },
          ],
        })
      );
    }
    const attacks = await Promise.all(runs);
    for (const attack of attacks) {
      expect(attack.stop).toEqual(expect.any(Function));
    }
    expect(start).not.toHaveBeenCalled();
  });
});

describe('when there are no possible attacks', () => {
  it('returns a stop function', async () => {
    const attack = await runner({
      possibleAttacks: [],
    });

    expect(attack.stop).toEqual(expect.any(Function));
    attack.stop();
  });
});

describe('when there is a custom attack', () => {
  describe('when using sync functions', () => {
    it('runs the attack', async () => {
      const start = jest.fn();
      const stop = jest.fn();
      start.mockReturnValue({ stop });

      const attack = await runner({
        possibleAttacks: [
          {
            name: 'custom',
            probability: 1,
            start,
          },
        ],
      });

      expect(start).toHaveBeenCalledTimes(1);
      attack.stop();
      expect(stop).toHaveBeenCalledTimes(1);
    });
  });

  describe('when using async functions', () => {
    it('runs the attack', async () => {
      expect.assertions(1);

      const attack = await runner({
        possibleAttacks: [
          {
            name: 'custom',
            probability: 1,
            start: async () => {
              return {
                stop: async () => {
                  expect(true).toBe(true);
                },
              };
            },
          },
        ],
      });

      attack.stop();
    });
  });
});

describe('when random does not match any attacks', () => {
  it('returns a stop function without running any', async () => {
    const start = jest.fn();
    const stop = jest.fn();
    start.mockReturnValue({ stop });

    jest.spyOn(Math, 'random').mockReturnValue(0.99);

    const attack = await runner({
      possibleAttacks: [
        {
          name: 'custom',
          probability: 0.1,
          start,
        },
        {
          name: 'custom2',
          probability: 0.89,
          start,
        },
      ],
    });

    expect(start).not.toHaveBeenCalled();
    expect(attack.stop).toEqual(expect.any(Function));
  });
});

describe('when a standard attack is specified', () => {
  it('runs the attack', async () => {
    const attack = await runner({
      possibleAttacks: [
        {
          name: 'cpu',
          probability: 1,
        },
      ],
    });

    expect(startCPU).toHaveBeenCalledTimes(1);
    attack.stop();
  });
});
