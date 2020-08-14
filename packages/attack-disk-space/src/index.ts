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

    // default for most OS' and the most performant
    let blockSize = 4096;
    if (this.size < blockSize) {
      // tiny attack! probably pointless but let's support it
      blockSize = this.size;
    }

    const spawned = spawn('dd', [
      'if=/dev/zero',
      `of=${this.file}`,
      // as close to the desired size as possible, but may be 1/2 blockSize more or less
      `count=${Math.round(this.size / blockSize)}`,
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
