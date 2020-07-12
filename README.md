# Chaos Squirrel

JavaScript Chaos

## Packages

- [CPU](./packages/cpu) - In-process CPU exhaustion
- [Background CPU](./packages/background-cpu) - Spawn processes which exhaust CPU
- [Delay](./packages/delay) - Wait for a set timeout (latency)
- [Open Files](./packages/open-files) - Open lots of file descriptors to exhaust `ulimit nofile`
- [Disk Space](./packages/disk) - Fill up a load of disk space
- [Uncaught Exception](./packages/uncaught-exception) - Throw an error

## Common Module Interface

```ts
import { startCPU } from '@dazn/chaos-squirrel-cpu';

const attack = startCPU({
  allowLoopEvery: 1000,
});

// do things but the event loop can only
// complete once every second

attack.stop();

// CPU attack stopped, event loop back to normal
```
