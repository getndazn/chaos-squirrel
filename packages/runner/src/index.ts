type VoidOrPromise = void | Promise<void>;

interface Attack {
  start: () => VoidOrPromise;
  stop: () => VoidOrPromise;
}

interface PossibleAttack {
  weight?: number;
  createAttack: () => Attack;
}

interface RunnerConfig {
  probability?: number;
  possibleAttacks: PossibleAttack[];
}

class Runner {
  static configure(opts: RunnerConfig): () => Runner {
    return () => new Runner(opts);
  }

  probability: number;
  possibleAttacks: PossibleAttack[];
  attack?: Attack;

  constructor({ probability = 1, possibleAttacks }: RunnerConfig) {
    this.probability = probability;
    this.possibleAttacks = possibleAttacks;
  }

  start(): VoidOrPromise {
    const globalRandom = Math.random();
    if (globalRandom > this.probability) {
      // TODO: logging https://github.com/getndazn/chaos-squirrel/issues/8
      // `Not running any attacks, ${globalRandom} is not less than ${probability}`,
      return;
    }

    this.attack = this.findAttack();
    if (!this.attack) return;

    return this.attack.start();
  }

  stop(): VoidOrPromise {
    if (!this.attack) return;
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
  }
}

export = Runner;
