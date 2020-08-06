type VoidOrPromise = void | Promise<void>;

interface Attack {
  start: () => VoidOrPromise;
  stop: () => VoidOrPromise;
}

interface PossibleAttack {
  probability: number;
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
    const random = Math.random();
    let probabilityStart = 0;

    for (const attack of this.possibleAttacks) {
      // check the probability in ranges so we have a fair distribution
      const probabilityEnd = probabilityStart + attack.probability;
      if (random < probabilityStart || random >= probabilityEnd) {
        // TODO: logging https://github.com/getndazn/chaos-squirrel/issues/8
        // `Not running ${attack.name} attack, ${random} is not between ${probabilityStart} - ${probabilityEnd}`,
        probabilityStart = probabilityEnd;
        continue;
      }

      return attack.createAttack();
    }
  }
}

export = Runner;
