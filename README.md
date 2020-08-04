# Chaos Squirrel

JavaScript Chaos

## Packages

- [Runner](./packages/runner) - Determine which attacks to run, and run them
- [Middy](./packages/middy) - Run attacks as a Middy middleware

### Attacks

- [CPU](./packages/attack-cpu) - In-process CPU exhaustion
- [Background CPU](./packages/attack-cpu-background) - Spawn processes which exhaust CPU
- [Open Files](./packages/attack-open-files) - Open lots of file descriptors to exhaust `ulimit nofile`


- <del>[Delay](./packages/delay) - Wait for a set timeout (latency)</del> TODO
- <del>[Disk Space](./packages/disk) - Fill up a load of disk space</del> TODO
- <del>[Uncaught Exception](./packages/uncaught-exception) - Throw an error</del> TODO


## Usage

```ts
import chaosRunner from '@dazn/chaos-squirrel-runner';
const attacks = chaosRunner({
  // Set a global probability. This defaults to 1, meaning every request is open to chaos
  // Set to 0 to disable all chaos
  probability: 1,
  // Set to false to allow more than 1 concurrent attack to run
  // Note this may cause some pretty extreme chaos for unlucky requests
  exclusive: true,
  possibleAttacks: [
    {
      name: 'cpu',
      probability: 0.1,
    },
    {
      name: 'open-files',
      probability: 0.1,
    },
    {
      name: 'my-custom-chaos',
      probability: 0.2,
      start: () => {
        // do attack

        return {
          stop: () => {
            // stop attack
          }
        }
      }
    }
  ],
});

// do things

attacks.stop();
```


## Common Module Interface

```ts
import { startCPU } from '@dazn/chaos-squirrel-attack-cpu';

const attack = startCPU({
  allowLoopEvery: 1000,
});

// do things but the event loop can only
// complete once every second

attack.stop();

// CPU attack stopped, event loop back to normal
```
