import Runner from '@dazn/chaos-squirrel-runner';

export interface WrapperRunnerOptions {
  createRunner: () => Runner;
  wait?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFunction = (...args: any[]) => Promise<any>;

export default <Func extends AnyFunction>(
  func: Func,
  { createRunner, wait = true }: WrapperRunnerOptions
): ((...args: Parameters<Func>) => ReturnType<Func>) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error ReturnType<Func> is already a promise, we don't need to wrap it again
  return async (...args: Parameters<Func>): ReturnType<Func> => {
    const runner = createRunner();
    const start = runner.start();
    if (wait) await start;

    const returnValue = await func(...args);

    const stop = runner.stop();
    if (wait) await stop;
    return returnValue;
  };
};
