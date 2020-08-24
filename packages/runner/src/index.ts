type VoidOrPromise = void | Promise<void>;

export interface Attack {
  start: () => VoidOrPromise;
  stop: () => VoidOrPromise;
}

export interface PossibleAttack {
  weight?: number;
  createAttack: () => Attack;
}

export type Logger = (
  level: 'debug' | 'info',
  message: string,
  details: Record<string, unknown>
) => void;

export interface RunnerConfig {
  probability?: number;
  possibleAttacks: PossibleAttack[];
  logger?: Logger;
}

export default class Runner {
  static configure(opts: RunnerConfig): () => Runner {
    return () => new Runner(opts);
  }

  probability: number;
  possibleAttacks: PossibleAttack[];
  attack?: Attack;
  logger: Logger;
  private attackStarted?: number;

  constructor({
    probability = 1,
    possibleAttacks,
    logger = (level, ...args) => console[level](...args),
  }: RunnerConfig) {
    this.probability = probability;
    this.possibleAttacks = possibleAttacks;
    this.logger = logger;
  }

  start(): VoidOrPromise {
    const globalRandom = Math.random();
    if (globalRandom > this.probability) {
      this.logger(
        'debug',
        `Not running any attacks, ${globalRandom} is greater than ${this.probability}`,
        { globalRandom, probability: this.probability }
      );
      return;
    }

    this.attack = this.findAttack();
    if (!this.attack) return; // logging handled in findAttack fn

    this.logger('info', `Starting attack: ${this.attack.constructor.name}`, {
      attackName: this.attack.constructor.name,
    });
    this.attackStarted = Date.now();
    return this.attack.start();
  }

  stop(): VoidOrPromise {
    if (!this.attack) return;
    this.logger('info', `Stopping attack: ${this.attack.constructor.name}`, {
      attackName: this.attack.constructor.name,
      // attackStarted will be set immediately after this.attack is set, so this is safe
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      runTime: Date.now() - this.attackStarted!,
    });
    return this.attack.stop();
  }

  private findAttack(): Attack | undefined {
    let probabilityStart = 0;

    const sumWeights = this.possibleAttacks.reduce(
      (prev, { weight = 1 }) => prev + weight,
      0
    );

    const weightedRandom = Math.random() * sumWeights;

    for (const { createAttack, weight = 1 } of this.possibleAttacks) {
      // check the probability in ranges so we have a fair distribution
      const probabilityEnd = probabilityStart + weight;
      if (
        weightedRandom < probabilityStart ||
        weightedRandom >= probabilityEnd
      ) {
        // TODO: logging https://github.com/getndazn/chaos-squirrel/issues/8
        // `Not running ${attack.name} attack, ${random} is not between ${probabilityStart} - ${probabilityEnd}`,
        probabilityStart = probabilityEnd;
        continue;
      }

      return createAttack();
    }

    this.logger(
      'debug',
      'Not running any attacks, no attack matched in findAttack',
      { weightedRandom, sumWeights }
    );
  }
}
