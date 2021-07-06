# @dazn/chaos-squirrel-attack-memory

Chaos Squirrel attack to fill memory instantly, or increasing memory usage over time.

## Usage

Basic memory attack.

```ts
import MemoryAttack from '@dazn/chaos-squirrel-attack-memory';

const createMemoryAttack = MemoryAttack.configure({
  size: 2e9 // ~2gb
});

const memoryAttack = createMemoryAttack();
memoryAttack.start();

// ~2gb of memory will be used

memoryAttack.stop(); // removes references to memory to allow GC to collect it
```

Progressive memory attack.

```ts
import MemoryAttack from '@dazn/chaos-squirrel-attack-memory';

const createMemoryAttack = MemoryAttack.configure({
  size: 2e9, // ~2gb
  stepSize: 2e8, // ~200mb
  stepTime: 1e3 // 1s
});

const memoryAttack = createMemoryAttack();
memoryAttack.start();

// ~2gb of memory will be used, starting from 0gb & increasing by ~200mb every 1s

memoryAttack.stop(); // removes references to memory to allow GC to collect it
```
