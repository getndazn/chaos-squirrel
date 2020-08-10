import { promises as fs } from 'fs';
import { join as pathJoin } from 'path';
import { tmpdir } from 'os';
import { spawn } from 'child_process';

interface DiskSpaceAttackOptions {
  size?: number;
}

class DiskSpaceAttack {
  static configure(opts: DiskSpaceAttackOptions): () => DiskSpaceAttack {
    return () => {
      const attack = new DiskSpaceAttack(opts);
      return attack;
    };
  }

  size: number;
  stopped = false;
  file?: string;

  // default size is 1 gigabyte
  constructor({ size = 1000000000 }: DiskSpaceAttackOptions = {}) {
    this.size = size;
  }

  async start(): Promise<void> {
    const directory = await fs.mkdtemp(pathJoin(tmpdir(), 'disk-space-'));
    this.file = `${directory}/big-file.tmp`;
    let blockSize = 1000;
    if (this.size < blockSize) {
      // < 1kb of chaos... you probably want more than this
      blockSize = this.size;
    }
    const spawned = spawn('dd', [
      'if=/dev/zero',
      `of=${this.file}`,
      `count=${Math.floor(this.size / blockSize)}`,
      `bs=${blockSize}`,
    ]);

    const code = await new Promise((resolve) => {
      spawned.on('close', resolve);
    });
    if (code !== 0) {
      throw new Error(`Unable to write chaos file, exit code: ${code}`);
    }

    if (this.stopped) return this.stop();
  }

  async stop(): Promise<void> {
    this.stopped = true;

    if (this.file) {
      try {
        await fs.unlink(this.file);
      } catch (err) {
        if (err.code !== 'ENOENT') {
          throw err;
        }
      }
    }
  }
}

export = DiskSpaceAttack;
