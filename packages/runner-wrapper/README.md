# @dazn/chaos-squirrel-runner-wrapper

Integrate the Chaos Runner into any function. Chaos will start whenever the function is called, and stop again before it resolves.

## Usage

```ts
import ChaosRunner from '@dazn/chaos-squirrel-runner'
import chaosRunnerWrapper from '@dazn/chaos-squirrel-runner-wrapper'

const myFunction = async (number) => number + 1;
const myFunctionWithChaos = chaosRunnerWrapper(myFunction, {
  createRunner: ChaosRunner.configure({ ... })
});

const value = await myFunction(1); // 2
const chaosValue = await myFunctionWithChaos(1); // 2, but potentially with chaos!
```

## Wrapper Runner Arguments

| Parameter      | Type       | Default | Description                                                                                                                                                                                                                                                              |
| -------------- | ---------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `createRunner` | `Function` | -       | A function which returns a new instance of ChaosRunner                                                                                                                                                                                                                   |
| `wait`         | `Boolean`  | `true`  | Whether to wait for async chaos functions to complete, for example waiting for all files to be created for the open files
