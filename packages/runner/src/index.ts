const emptyStop = {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  stop: () => {},
};

interface PossibleAttack {
  name: string;
  probability: number;
  start?: () => { stop: () => void };
}

interface RunnerConfig {
  probability?: number;
  exclusive?: boolean;
  possibleAttacks?: PossibleAttack[];
}

const runner = async ({
  probability = 1,
  // exclusive = true,
  possibleAttacks = [],
}: RunnerConfig): Promise<{ stop: () => void }> => {
  const random = Math.random();
  if (random > probability) {
    // TODO: logging https://github.com/getndazn/chaos-squirrel/issues/8
    // `Not running any attacks, ${random} is not less than ${probability}`,
    return emptyStop;
  }

  const attacks = [];

  for (const attack of possibleAttacks) {
    const random = Math.random();
    if (random > attack.probability) {
      // TODO: logging https://github.com/getndazn/chaos-squirrel/issues/8
      // `Not running ${attack.name} attack, ${random} is not less than ${attack.probability}`,
      continue;
    }

    if (attack.start) {
      attacks.push(attack.start());
      continue;
    }

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const startAttack = require(`@dazn/chaos-squirrel-attack-${attack.name}`);
    attacks.push(startAttack());
  }

  const runningAttacks = await Promise.all(attacks);

  return {
    stop: async () => {
      await Promise.all(
        runningAttacks.map((runningAttack) => runningAttack.stop())
      );
    },
  };
};

export default runner;
