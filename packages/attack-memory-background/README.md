# @dazn/chaos-squirrel-attack-memory-background

Use lots of memory in a forked process. This will apply memory pressure to your service, without impacting garbage collection or risking the process being killed.

## Usage

Basic memory attack.

```ts
import BackgroundMemoryAttack from '@dazn/chaos-squirrel-attack-memory-background';

const createBackgroundMemoryAttack = BackgroundMemoryAttack.configure({
  size: 2e9 // ~2gb
});

const backgroundMemoryAttack = createBackgroundMemoryAttack();
backgroundMemoryAttack.start();

// ~2gb of memory will be used in a forked process

backgroundMemoryAttack.stop(); // kills the process
```

Progressive memory attack.


```ts
import BackgroundMemoryAttack from '@dazn/chaos-squirrel-attack-memory-background';

const createBackgroundMemoryAttack = BackgroundMemoryAttack.configure({
  size: 2e9 // ~2gb
  stepSize: 2e8, // ~200mb
  stepTime: 1e3 // 1s
});

const backgroundMemoryAttack = createBackgroundMemoryAttack();
backgroundMemoryAttack.start();

// ~2gb of memory will be used in forked processes, starting from 0gb & increasing by ~200mb every 1s

backgroundMemoryAttack.stop(); // kills the processes
```
