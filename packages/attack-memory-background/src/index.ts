import { fork, ChildProcess } from 'child_process';
import buffer from 'buffer';

export interface BackgroundMemoryAttackOptions {
  size?: number;
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
  private worker?: ChildProcess;

  constructor({
    size = buffer.constants.MAX_LENGTH,
  }: BackgroundMemoryAttackOptions = {}) {
    this.size = size;
  }

  async start(): Promise<void> {
    const worker = (this.worker = fork(`${__dirname}/fork.js`));
    worker.send({
      size: this.size,
    });

    await new Promise((resolve) => {
      worker.on('message', () => resolve());
    });
  }

  stop(): void {
    if (this.worker) this.worker.kill();
  }
}
