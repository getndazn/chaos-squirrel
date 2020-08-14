import buffer from 'buffer';

const BUF_LENGTH = buffer.constants.MAX_LENGTH;

interface MemoryAttackOptions {
  size?: number;
}

class MemoryAttack {
  static configure(opts: MemoryAttackOptions): () => MemoryAttack {
    return () => {
      const attack = new MemoryAttack(opts);
      return attack;
    };
  }

  size: number;
  buffers: Buffer[] = [];

  constructor({ size = BUF_LENGTH }: MemoryAttackOptions = {}) {
    this.size = size;
  }

  start(): void {
    let toFill = this.size;
    while (toFill > 0) {
      const bufSize = Math.min(toFill, BUF_LENGTH);
      this.buffers.push(Buffer.alloc(bufSize, 'chaos-squirrel'));
      toFill -= bufSize;
    }
  }

  stop(): void {
    // will likely be a big GC run after this!
    this.buffers = [];
  }
}

export = MemoryAttack;
