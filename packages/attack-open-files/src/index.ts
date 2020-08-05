import { promises as fs } from 'fs';
import { join as pathJoin } from 'path';
import { tmpdir } from 'os';

const startOpenFiles = async ({ number = 1000 } = {}): Promise<{
  stop: () => Promise<void>;
}> => {
  const directory = await fs.mkdtemp(pathJoin(tmpdir(), 'open-files-'));
  const promises = [];
  for (let i = 0; i < number; i++) {
    promises.push(fs.open(pathJoin(directory, `${i}.tmp`), 'w'));
  }
  const openedFiles = await Promise.all(promises);

  return {
    stop: async () => {
      await Promise.all(openedFiles.map((file) => file.close()));
    },
  };
};

export = startOpenFiles;
