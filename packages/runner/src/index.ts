const emptyStop = {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  stop: () => {},
};

type StopFn = (() => Promise<void>) | (() => void);

interface PossibleAttack {
  name: string;
  probability: number;
  start?: () => { stop: StopFn } | Promise<{ stop: StopFn }>;
}

interface RunnerConfig {
  probability?: number;
  possibleAttacks: PossibleAttack[];
}

const findAttack = (
  possibleAttacks: PossibleAttack[]
): PossibleAttack['start'] | void => {
  const random = Math.random();
  let probabilityStart = 0;

  for (const attack of possibleAttacks) {
    // check the probability in ranges so we have a fair distribution
    const probabilityEnd = probabilityStart + attack.probability;
    if (random < probabilityStart || random >= probabilityEnd) {
      // TODO: logging https://github.com/getndazn/chaos-squirrel/issues/8
      // `Not running ${attack.name} attack, ${random} is not between ${probabilityStart} - ${probabilityEnd}`,
      probabilityStart = probabilityEnd;
      continue;
    }

    if (attack.start) {
      return attack.start;
    }

    // TODO: can we remove the `as` here?
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const startAttack = require(`@dazn/chaos-squirrel-attack-${attack.name}`) as PossibleAttack['start'];
    return startAttack;
  }
};

const runner = async ({
  probability = 1,
  possibleAttacks,
}: RunnerConfig): Promise<{ stop: StopFn }> => {
  const globalRandom = Math.random();
  if (globalRandom > probability) {
    // TODO: logging https://github.com/getndazn/chaos-squirrel/issues/8
    // `Not running any attacks, ${globalRandom} is not less than ${probability}`,
    return emptyStop;
  }

  const startAttack = findAttack(possibleAttacks);
  if (!startAttack) return emptyStop;

  return startAttack();
};

export = runner;
