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
  private worker?: ChildProcess;

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
    const worker = (this.worker = fork(`${__dirname}/fork.js`));

    worker.send({
      size: this.size,
      stepSize: this.stepSize,
      stepTime: this.stepTime,
    });

    await new Promise((resolve) => {
      worker.on('message', () => resolve(null));
    });
  }

  stop(): void {
    if (typeof this.worker !== 'undefined') {
      this.worker.kill();
      this.worker = undefined;
    }
  }
}
