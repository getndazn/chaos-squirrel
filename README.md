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

import ChaosRunner from '@dazn/chaos-squirrel-runner';
import CPUAttack from '@dazn/chaos-squirrel-attack-cpu';

const runner = new ChaosRunner({
  probability: 1,
  possibleAttacks: [
    {
      probability: 0.01,
      createAttack: CPUAttack.configure({ allowLoopEvery: 10 })
    },
    {
      probability: 0.02,
      createAttack: () => ({
          start: () => { /* do a custom attack!*/ },
          stop: () => { /* stop the attack */ }
      })
    },
    {
      probability: 0.03,
      createAttack: () => new CPUAttack({ allowLoopEvery: 100 })
    }
  ]
})

// start the chaos!
runner.start();
// do things

// stop the chaos
runner.stop();

## Runner Arguments

| Parameter       | Type    | Description                                            |
|-----------------|---------|--------------------------------------------------------|
| `probability`     | `Number` | A probability range between 0-1. Defaults to `1` which is 100% probability.               |
| `possibleAttacks` | `Array`   | An array of objects of [possible attacks](#possible-attack) that could be initiated  |

## Possible Attack

| Parameter    | Type     | Description                                                                |
|--------------|----------|----------------------------------------------------------------------------|
| `probability`  | `Boolean`  | Sets the probability of a specific attack                                  |
| `createAttack` | `Function` | Function which returns an attack object exposing a start and stop method.  |

```
