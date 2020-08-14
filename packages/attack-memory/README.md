# @dazn/chaos-squirrel-attack-memory

Use lots of memory

## Usage

```ts
import MemoryAttack from '@dazn/chaos-squirrel-attack-memory';

const createMemoryAttack = MemoryAttack.configure({
  // 2gb
  size: 2000000000,
});

const memoryAttack = createMemoryAttack();
memoryAttack.start();

// 2gb of memory will be used

memoryAttack.stop(); // removes references to memory to allow GC to collect it
```
