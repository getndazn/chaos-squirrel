# @dazn/chaos-squirrel-runner

Run chaos attacks!

## Usage

```ts
import ChaosRunner from '@dazn/chaos-squirrel-runner';
import CPUAttack from '@dazn/chaos-squirrel-attack-cpu';

const createRunner = ChaosRunner.configure({
  probability: 1,
  possibleAttacks: [
    {
      weight: 2, // run twice as often as the default
      createAttack: CPUAttack.configure({ allowLoopEvery: 10 }),
    },
    {
      // weight: 1, // default value
      createAttack: () => ({
        start: () => {
          /* do a custom attack!*/
        },
        stop: () => {
          /* stop the attack */
        },
      }),
    },
  ],
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

| Parameter         | Type     | Default | Description                                                                          |
| ----------------- | -------- | ------- | ------------------------------------------------------------------------------------ |
| `probability`     | `Number` | `1`     | A "global" probability range between 0-1. Defaults to `1` which is 100% probability. |
| `possibleAttacks` | `Array`  | -       | An array of objects of [possible attacks](#possible-attack) that could be initiated  |

## Possible Attack

| Parameter      | Type       | Default | Description                                                                                         |
| -------------- | ---------- | ------- | --------------------------------------------------------------------------------------------------- |
| `weight`       | `Number`   | `1`     | Sets the weighting of an attack vs the other attacks. Default = 1, set to 0 to disable this attack. |
| `createAttack` | `Function` | -       | Function which returns an attack object exposing a start and stop method.                           |

## Probabilities

The likelihood of running a given attack is the `runner.probability` \* `possibleAttack.weight` / `SUM(possibleAttacks.weight)`.

For example, if `runner.probability` is set to `0.5` and there are two possible attacks:

- Attack 1: weight = `1`
- Attack 2: weight = `3`

The probability of any each attack running will be

- Attack 1: `0.5 * 1 / 4` = `0.125`
- Attack 2: `0.5 * 3 / 4` = `0.375`
- Total probability (chances of either attack running) = `runner.probability` = `0.5`
