export interface CPUAttackOptions {
  runTime?: number;
  allowLoopEvery?: number;
}

export default class CPUAttack {
  static configure(opts: CPUAttackOptions): () => CPUAttack {
    return () => {
      const attack = new CPUAttack(opts);
      return attack;
    };
  }

  runTime: number;
  allowLoopEvery: number;
  stopped = false;

  constructor({
    runTime = Infinity,
    allowLoopEvery = 1000,
  }: CPUAttackOptions = {}) {
    this.runTime = runTime;
    this.allowLoopEvery = allowLoopEvery;
  }

  start(): void {
    const runUntil = Date.now() + this.runTime;

    const loopCPU = () => {
      setImmediate(() => {
        if (this.stopped) return;
        const next = this.getNextUntil(runUntil);
        // this part it totally blocking
        this.cpuRun(next.until);
        if (next.lastRun) return;
        loopCPU();
      });
    };

    loopCPU();
  }

  stop(): void {
    this.stopped = true;
  }

  private cpuRun(until: number): number {
    let loops = 0;
    while (new Date().getTime() < until) {
      loops++;
    }
    return loops;
  }

  private getNextUntil(runUntil: number): { until: number; lastRun: boolean } {
    const nextTick = Date.now() + this.allowLoopEvery;
    const lastRun = nextTick > runUntil;
    return { until: lastRun ? runUntil : nextTick, lastRun };
  }
}
