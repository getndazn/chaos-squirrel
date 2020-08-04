import runner from './';

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
  });
});
