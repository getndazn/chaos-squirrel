import { promises as fs } from 'fs';
import { join as pathJoin } from 'path';
import { tmpdir } from 'os';

export interface OpenFilesAttackOptions {
  number?: number;
}

export default class OpenFilesAttack {
  static configure(opts: OpenFilesAttackOptions): () => OpenFilesAttack {
    return () => {
      const attack = new OpenFilesAttack(opts);
      return attack;
    };
  }

  number: number;
  stopped = false;
  private openFiles: fs.FileHandle[] = [];

  constructor({ number = 1000 }: OpenFilesAttackOptions = {}) {
    this.number = number;
  }

  async start(): Promise<void> {
    const directory = await fs.mkdtemp(pathJoin(tmpdir(), 'open-files-'));
    const promises = [];
    for (let i = 0; i < this.number; i++) {
      promises.push(this.openFile(directory, i));
    }
    await Promise.all(promises);
  }

  async stop(): Promise<void> {
    this.stopped = true;
    await Promise.all(this.openFiles.map((file) => file.close()));
  }

  private async openFile(directory: string, i: number): Promise<fs.FileHandle> {
    const opened = await fs.open(pathJoin(directory, `${i}.tmp`), 'w');

    // edge case - attack was stopped after we started opening this file, immediately close it
    if (this.stopped) {
      await opened.close();
      return opened;
    }

    this.openFiles.push(opened);
    return opened;
  }
}
