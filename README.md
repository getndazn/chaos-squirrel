# Chaos Squirrel

JavaScript Chaos

## Packages

- [Runner](./packages/runner) - Determine which attacks to run, and run them

### Attacks

- [CPU](./packages/attack-cpu) - In-process CPU exhaustion
- [Background CPU](./packages/attack-cpu-background) - Spawn processes which exhaust CPU
- [Open Files](./packages/attack-open-files) - Open lots of file descriptors to exhaust `ulimit nofile`

## Usage via Runner

```ts
import chaosRunner from '@dazn/chaos-squirrel-runner';
const attack = await chaosRunner({
  // Set a global probability. This defaults to 1, meaning every request is open to chaos
  // Set to 0 to disable all chaos
  probability: 1,
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

await attack.stop();
```
