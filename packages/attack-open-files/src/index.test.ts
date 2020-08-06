import OpenFilesAttack from './';
import { promises as fs } from 'fs';
import { tmpdir } from 'os';
import { join as pathJoin } from 'path';

jest.spyOn(fs, 'mkdtemp');
jest.spyOn(fs, 'open');

describe('when opening 10 files', () => {
  it('opens 10 files in a tmp directory', async () => {
    const attack = new OpenFilesAttack({ number: 10 });
    await attack.start();
    expect(fs.mkdtemp).toHaveBeenCalledTimes(1);
    expect(fs.mkdtemp).toHaveBeenCalledWith(
      expect.stringContaining(pathJoin(tmpdir(), 'open-files-'))
    );

    expect(fs.open).toHaveBeenCalledTimes(10);

    await attack.stop();
  });
});

describe('when given defaults', () => {
  it('opens 1000 files', async () => {
    const closeFn = jest.fn();
    jest.spyOn(fs, 'open').mockResolvedValue(({
      close: closeFn,
    } as unknown) as fs.FileHandle);

    const attack = new OpenFilesAttack();
    await attack.start();

    expect(fs.open).toHaveBeenCalledTimes(1000);

    await attack.stop();

    expect(closeFn).toHaveBeenCalledTimes(1000);
  });
});

describe('when stopped before completing opening the files', () => {
  it('still closes all files', async () => {
    const closeFn = jest.fn();
    jest.spyOn(fs, 'open').mockResolvedValue(({
      close: closeFn,
    } as unknown) as fs.FileHandle);

    const attack = new OpenFilesAttack({ number: 10 });
    const startPromise = attack.start();
    attack.stop();
    await startPromise;
    expect(closeFn).toHaveBeenCalledTimes(10);
  });
});
