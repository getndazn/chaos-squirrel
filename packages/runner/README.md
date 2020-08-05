# @dazn/chaos-squirrel-runner

Run chaos attacks!

## Usage

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
      probability: 0.2, // this custom attack will run on 20% of requests
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
