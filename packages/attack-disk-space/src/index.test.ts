import DiskSpaceAttack from './';
import { promises as fs } from 'fs';
import { tmpdir } from 'os';
import { join as pathJoin } from 'path';
import child_process from 'child_process';

jest.spyOn(fs, 'mkdtemp');

class ValidationError extends Error {
  public code = '';
}

describe('when filling 10 bytes', () => {
  it('creates a 10 byte file in a tmp directory', async () => {
    const attack = new DiskSpaceAttack({ size: 10 });
    await attack.start();
    expect(fs.mkdtemp).toHaveBeenCalledTimes(1);
    expect(fs.mkdtemp).toHaveBeenCalledWith(
      expect.stringContaining(pathJoin(tmpdir(), 'disk-space-'))
    );
    expect(attack.file).toEqual(expect.any(String));
    const { size } = await fs.stat(attack.file as string);
    expect(size).toBe(10);
    await attack.stop();
  });
});

describe('when given defaults', () => {
  it('creates a 1gb file in a tmp directory', async () => {
    const attack = new DiskSpaceAttack();
    await attack.start();
    const { size } = await fs.stat(attack.file as string);
    expect(size).toBe(1000001536);
    await attack.stop();
  }, 10000);
});

describe('when stopped before completing opening the files', () => {
  it('still removes the file', async () => {
    jest.spyOn(fs, 'unlink');
    const attack = new DiskSpaceAttack({ size: 10000000 });
    const startPromise = attack.start();
    attack.stop();
    await startPromise;
    // expect(fs.unlink).toHaveBeenCalledTimes(1);
    try {
      await fs.stat(attack.file as string);
      throw { code: 'File still exists' };
    } catch (err: unknown) {
      expect((err as ValidationError).code).toBe('ENOENT');
    }
  });
});

describe('when dd returns a non-0 exit code', () => {
  it('throws', async () => {
    expect.assertions(1);

    const on = jest.fn().mockImplementation((signal, cb) => {
      if (signal === 'close') cb(1);
    });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    jest.spyOn(child_process, 'spawn').mockReturnValueOnce({ on });

    const attack = new DiskSpaceAttack();
    try {
      await attack.start();
    } catch (err: unknown) {
      expect((err as ValidationError).message).toBe(
        'Unable to write chaos file, exit code: 1'
      );
    }
  });
});

describe('when stop is called multiple times', () => {
  it('does not throw', async () => {
    jest.spyOn(fs, 'unlink');
    const attack = new DiskSpaceAttack({ size: 1 });
    await attack.start();
    await attack.stop();
    expect(fs.unlink).toHaveBeenCalledTimes(1);
    await attack.stop();
    expect(fs.unlink).toHaveBeenCalledTimes(2);
  });
});

describe('when unlink errors', () => {
  it('throws', async () => {
    expect.assertions(1);
    jest.spyOn(fs, 'unlink').mockRejectedValue(new Error('Oh no!'));
    const attack = new DiskSpaceAttack({ size: 1 });
    await attack.start();
    try {
      await attack.stop();
    } catch (err: unknown) {
      expect((err as ValidationError).message).toBe('Oh no!');
    }
  });
});

describe('.configure', () => {
  it('returns a function which creates a new attack with the given options', () => {
    const createAttack = DiskSpaceAttack.configure({
      size: 1,
    });
    expect(createAttack).toEqual(expect.any(Function));
    const attack = createAttack();
    expect(attack).toBeInstanceOf(DiskSpaceAttack);
    expect(attack.size).toBe(1);
  });
});
