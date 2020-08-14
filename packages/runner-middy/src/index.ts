import middy from '@middy/core';
import { Context } from 'aws-lambda';
import Runner from '@dazn/chaos-squirrel-runner';

interface ChaosContext extends Context {
  chaosRunner?: Runner;
}

interface MiddyRunnerOptions {
  createRunner: () => Runner;
  wait?: boolean;
}

type ChaosMiddleware = middy.MiddlewareObject<unknown, unknown, ChaosContext>;

const middleware = ({
  createRunner,
  wait = true,
}: MiddyRunnerOptions): ChaosMiddleware => {
  const stop = async (runner: Runner | undefined, wait: boolean) => {
    if (runner) {
      const stop = runner.stop();
      if (wait) await stop;
    }
  };

  return {
    before: async (handler) => {
      const context = handler.context;
      const runner = createRunner();
      context.chaosRunner = runner;
      const start = runner.start();
      if (wait) await start;
    },
    after: async (handler) => {
      await stop(handler.context.chaosRunner, wait);
    },
    onError: async (handler) => {
      await stop(handler.context.chaosRunner, wait);
    },
  };
};

export = middleware;
