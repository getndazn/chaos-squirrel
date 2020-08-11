# @dazn/chaos-squirrel-runner-middy

Integrate the chaos runner into your [Middy](https://github.com/middyjs/middy) middleware.

## Usage

```ts
import chaosRunnerMiddleware from '@dazn/chaos-squirrel-runner-middy';
import ChaosRunner from '@dazn/chaos-squirrel-runner';
import CPUAttack from '@dazn/chaos-squirrel-attack-cpu';
import middy from '@middy/core';

const createRunner = ChaosRunner.configure({
  probability: 1,
  possibleAttacks: [
    {
      probability: 0.01,
      createAttack: CPUAttack.configure({ allowLoopEvery: 10 }),
    },
  ],
});

const originalHandler = async () => {
  // your lambda here
  // there may be some chaos going on!
};

const handler = middy(originalHandler).use(
  chaosRunnerMiddleware({
    createRunner,
    wait: true,
  })
);

export { handler };
```
