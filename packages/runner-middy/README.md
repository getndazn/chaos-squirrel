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
    createLogger: (context) => {
      return (level, message, details) => {
        // call a logger which is attached to the lambda context
        context.logger[level](message, details);
      };
    },
  })
);

export { handler };
```

## Middy Runner Arguments

| Parameter      | Type       | Default | Description                                                                                                                                                                                                                                                              |
| -------------- | ---------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `createRunner` | `Function` | -       | A function which returns a new instance of ChaosRunner                                                                                                                                                                                                                   |
| `wait`         | `Boolean`  | `true`  | Whether to wait for async chaos functions to complete, for example waiting for all files to be created for the open files attack                                                                                                                                         |
| `createLogger` | `Function` | -       | Optional. A function which is called with the Lambda `context`, which must return a valid `logger` function (see Chaos Runner for logger docs). This is useful when the `context` has a custom logger or correlation IDs attached, which you want to include in any logs |
