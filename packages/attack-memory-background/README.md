# @dazn/chaos-squirrel-attack-memory-background

Use lots of memory in a forked process. This will apply memory pressure to your service, without impacting garbage collection or risking the process being killed.

## Usage

```ts
import BackgroundMemoryAttack from '@dazn/chaos-squirrel-attack-memory-background';

const createBackgroundMemoryAttack = BackgroundMemoryAttack.configure({
  // 2gb
  size: 2000000000,
});

const backgroundMemoryAttack = createBackgroundMemoryAttack();
backgroundMemoryAttack.start();

// 2gb of memory will be used in a forked process

memoryAttack.stop(); // kills the process
```
