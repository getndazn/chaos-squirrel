# @dazn/chaos-squirrel-runner

Run chaos attacks!

## Usage

```ts
import ChaosRunner from '@dazn/chaos-squirrel-runner';
import CPUAttack from '@dazn/chaos-squirrel-attack-cpu';

const runner = new ChaosRunner({
  // Set a global probability. This defaults to 1, meaning every request is open to chaos
  // Set to 0 to disable all chaos
  probability: 1,

  possibleAttacks: [
    {
      probability: 0.01,
      createAttack: CPUAttack.configure({ allowLoopEvery: 10 })
    },
    {
      probability: 0.02,
      createAttack: () => {
        return {
          start: () => {
            // do a custom attack!
          },
          stop: () => {
            // stop the attack
          }
        }
      }
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
```
