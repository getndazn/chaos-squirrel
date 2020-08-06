import { fork, ChildProcess } from 'child_process';

interface BackgroundCPUAttackOptions {
  runTime?: number;
  threads?: number;
}

class BackgroundCPUAttack {
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

  start(): void {
    for (let i = 0; i < this.threads; i++) {
      const worker = fork(`${__dirname}/fork.js`);
      worker.send({
        runTime: this.runTime,
      });
      this.workers.push(worker);
    }
  }

  stop(): void {
    this.workers.forEach((worker) => {
      worker.kill();
    });
  }
}

export = BackgroundCPUAttack;
