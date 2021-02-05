# Chaos Squirrel

JavaScript Chaos

## Packages

- [Runner](./packages/runner) - Determine which attacks to run, and run them
- [Wrapper Runner](./packages/runner-wrapper) - Integrate the Chaos Runner into any function
- [Middy Runner](./packages/runner-middy) - Easily run attacks on Lambdas using [Middy](https://github.com/middyjs/middy)

### Attacks

- [CPU](./packages/attack-cpu) - In-process CPU exhaustion
- [Background CPU](./packages/attack-cpu-background) - Spawn processes which exhaust CPU
- [Open Files](./packages/attack-open-files) - Open lots of file descriptors to exhaust `ulimit nofile`
- [Memory](./packages/attack-memory) - Use lots of memory
- [Background Memory](./packages/attack-memory-background) - Use lots of memory in a forked process
- [Disk Space](./packages/attack-disk-space) - Consume lots of disk space
- [Throw Error](./packages/attack-throw-error) - Throws error or causes uncaught exception

## Usage via Runner

```ts
import ChaosRunner from '@dazn/chaos-squirrel-runner';
import CPUAttack from '@dazn/chaos-squirrel-attack-cpu';
// in ES5/CommonJS
// const { default: CPUAttack } = require('@dazn/chaos-squirrel-attack-cpu');

const createRunner = ChaosRunner.configure({
  probability: 1,
  possibleAttacks: [
    {
      weight: 2, // run twice as often as the default
      createAttack: CPUAttack.configure({ allowLoopEvery: 10 }),
    },
    {
      // weight: 1, // default value
      createAttack: () => {
        // Use a class for Attacks, as the Runner will take the class name as the attack name
        // using a plain object will result in the attack name being "Object"
        class CustomAttack {
          start() {
            // do a custom attack!
          }
          stop() {
            // stop the attack
          }
        }
        return new CustomAttack();
      },
    },
  ],

  // OPTIONAL: define a custom logger, defaults to console methods
  logger: (level, message, details) => console[level](message, details),
});

// a new instance of the runner should be created for each possible chaos run
const runner = createRunner();

// start the chaos!
runner.start();
// do things

// stop the chaos
runner.stop();
```

## Runner Arguments

| Parameter         | Type       | Default                                       | Description                                                                                                                                     |
| ----------------- | ---------- | --------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `probability`     | `Number`   | `1`                                           | A "global" probability range between 0-1. Defaults to `1` which is 100% probability.                                                            |
| `possibleAttacks` | `Array`    | -                                             | An array of objects of [possible attacks](#possible-attack) that could be initiated                                                             |
| `logger`          | `Function` | `(level, ...args) => console[level](...args)` | A logger function which is called for significant actions/decisions, such as starting an attack. Set to a no-op (`() => {}`) to disable logging |

## Possible Attack

| Parameter      | Type       | Default | Description                                                                                         |
| -------------- | ---------- | ------- | --------------------------------------------------------------------------------------------------- |
| `weight`       | `Number`   | `1`     | Sets the weighting of an attack vs the other attacks. Default = 1, set to 0 to disable this attack. |
| `createAttack` | `Function` | -       | Function which returns an attack class exposing a start and stop method.                            |

## Probabilities

The likelihood of running a given attack is the `runner.probability` \* `possibleAttack.weight` / `SUM(possibleAttacks.weight)`.

For example, if `runner.probability` is set to `0.5` and there are two possible attacks:

- Attack 1: weight = `1`
- Attack 2: weight = `3`

The probability of any each attack running will be

- Attack 1: `0.5 * 1 / 4` = `0.125`
- Attack 2: `0.5 * 3 / 4` = `0.375`
- Total probability (chances of either attack running) = `runner.probability` = `0.5`
