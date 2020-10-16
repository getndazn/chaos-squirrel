import { fork, ChildProcess } from 'child_process';

export interface BackgroundCPUAttackOptions {
  runTime?: number;
  threads?: number;
}

export default class BackgroundCPUAttack {
  static configure(
    opts: BackgroundCPUAttackOptions
  ): () => BackgroundCPUAttack {
    return () => {
      const attack = new BackgroundCPUAttack(opts);
      return attack;
    };
  }

  runTime: number;
  threads: number;
  private workers: ChildProcess[] = [];

  constructor({
    runTime = Infinity,
    threads = 4,
  }: BackgroundCPUAttackOptions = {}) {
    this.runTime = runTime;
    this.threads = threads;
  }

  async start(): Promise<void> {
    const starts: Promise<void>[] = [];
    for (let i = 0; i < this.threads; i++) {
      const worker = fork(`${__dirname}/fork.js`);
      worker.send({
        runTime: this.runTime,
      });
      this.workers.push(worker);

      starts.push(
        new Promise((resolve) => {
          worker.on('message', () => resolve());
        })
      );
    }

    await Promise.all(starts);
  }

  stop(): void {
    this.workers.forEach((worker) => {
      worker.kill();
    });
  }
}
