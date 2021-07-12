import { fork, ChildProcess } from 'child_process';
import * as buffer from 'buffer';

export interface BackgroundMemoryAttackOptions {
  size?: number; // bytes
  stepSize?: number; // bytes
  stepTime?: number; // milliseconds
}

export default class BackgroundMemoryAttack {
  static configure(
    opts: BackgroundMemoryAttackOptions
  ): () => BackgroundMemoryAttack {
    return () => {
      const attack = new BackgroundMemoryAttack(opts);
      return attack;
    };
  }

  size: number;
  stepSize: number;
  stepTime: number;
  workers: ChildProcess[] = [];
  private stepInterval?: NodeJS.Timeout;

  constructor({
    size = buffer.constants.MAX_LENGTH,
    stepSize = 0,
    stepTime = 0,
  }: BackgroundMemoryAttackOptions = {}) {
    this.size = size;
    this.stepSize = stepSize;
    this.stepTime = stepTime;
  }

  async start(): Promise<void> {
    if (this.stepTime && this.stepSize) {
      await this.allocate(this.stepSize);
      this.stepInterval = setInterval(
        this.stepAllocate.bind(this),
        this.stepTime
      );
    } else {
      await this.allocate(this.size);
    }
  }

  private async stepAllocate() {
    if (this.workers.length * this.stepSize >= this.size) {
      this.clearStep();
    } else {
      await this.allocate(this.stepSize);
    }
  }

  private clearStep() {
    if (typeof this.stepInterval !== 'undefined') {
      clearInterval(this.stepInterval);
      this.stepInterval = undefined;
    }
  }

  private async allocate(size: number) {
    const worker = fork(`${__dirname}/fork.js`);

    worker.send({ size });

    await new Promise((resolve) => {
      worker.on('message', () => resolve());
    });

    this.workers.push(worker);
  }

  stop(): void {
    this.workers.forEach((worker) => worker.kill());
    this.workers = [];
  }
}
