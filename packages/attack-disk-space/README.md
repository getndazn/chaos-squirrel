# @dazn/chaos-squirrel-attack-disk-space

Consume lots of disk space. Spawns a `dd` process, so this is unlikely to work on non-unix systems.

## Usage

```ts
import DiskSpaceAttack from '@dazn/chaos-squirrel-attack-disk-space';
const createDiskSpaceAttack = DiskSpaceAttack.configure({
  // 2gb
  size: 2000000000,
});
const diskSpaceAttack = createDiskSpaceAttack();

// Start and stop methods are async for this attack.
// You should await the results to ensure the file is fully created + removed
await diskSpaceAttack.start();
// a 2gb file will be created
await diskSpaceAttack.stop(); // deletes the file
```
