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

  start(): void {
    this.worker = fork(`${__dirname}/fork.js`);
    this.worker.send({
      size: this.size,
    });
  }

  stop(): void {
    if (this.worker) this.worker.kill();
  }
}
