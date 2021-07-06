import buffer from 'buffer';

const BUF_LENGTH = buffer.constants.MAX_LENGTH;

export interface MemoryAttackOptions {
  size?: number; // bytes
  stepSize?: number; // bytes
  stepTime?: number; // milliseconds
}

export default class MemoryAttack {
  static configure(opts: MemoryAttackOptions): () => MemoryAttack {
    return () => {
      const attack = new MemoryAttack(opts);
      return attack;
    };
  }

  size: number;
  stepSize: number;
  stepTime: number;
  stepInterval?: NodeJS.Timeout;
  buffers: Buffer[] = [];

  constructor({
    size = BUF_LENGTH,
    stepSize = 0,
    stepTime = 0,
  }: MemoryAttackOptions = {}) {
    this.size = size;
    this.stepSize = stepSize;
    this.stepTime = stepTime;
  }

  private get allocatedSize() {
    return this.buffers.reduce(
      (total, current) => total + Buffer.byteLength(current),
      0
    );
  }

  start(): void {
    if (this.stepTime && this.stepSize) {
      this.allocate(this.stepSize);
      this.stepInterval = setInterval(
        this.stepAllocate.bind(this),
        this.stepTime
      );
    } else {
      this.allocate(this.size);
    }
  }

  private stepAllocate() {
    if (this.allocatedSize >= this.size) {
      this.clearStep();
    } else {
      this.allocate(this.stepSize);
    }
  }

  private clearStep() {
    if (typeof this.stepInterval !== 'undefined') {
      clearInterval(this.stepInterval);
      this.stepInterval = undefined;
    }
  }

  private allocate(size: number) {
    let toFill = size;
    while (toFill > 0) {
      const bufSize = Math.min(toFill, BUF_LENGTH);
      this.buffers.push(Buffer.alloc(bufSize, 'chaos-squirrel'));
      toFill -= bufSize;
    }
  }

  stop(): void {
    // will likely be a big GC run after this!
    this.buffers = [];
    this.clearStep();
  }
}
