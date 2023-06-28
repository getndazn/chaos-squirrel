import middy from '@middy/core';
import { Context } from 'aws-lambda';
import Runner, { Logger } from '@dazn/chaos-squirrel-runner';

export interface ChaosContext extends Context {
  chaosRunner?: Runner;
}

export interface MiddyRunnerOptions {
  createRunner: () => Runner;
  wait?: boolean;
  createLogger?: (context: Context) => Logger;
}

type ChaosMiddleware = middy.MiddlewareObj<
  unknown,
  unknown,
  unknown,
  ChaosContext
>;

export default ({
  createRunner,
  wait = true,
  createLogger,
}: MiddyRunnerOptions): ChaosMiddleware => {
  const stop = async (runner: Runner | undefined, wait: boolean) => {
    if (runner) {
      const stop = runner.stop();
      if (wait) await stop;
    }
  };

  return {
    before: async (handler) => {
      const context = handler.context as ChaosContext;
      const runner = createRunner();
      if (createLogger) {
        runner.logger = createLogger(context);
      }
      context.chaosRunner = runner;
      const start = runner.start();
      if (wait) await start;
    },
    after: async (handler) => {
      await stop((handler.context as ChaosContext).chaosRunner, wait);
    },
    onError: async (handler) => {
      await stop((handler.context as ChaosContext).chaosRunner, wait);
    },
  };
};
