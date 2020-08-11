import { MiddlewareObject } from 'middy';
import { Context } from 'aws-lambda';
import Runner from '@dazn/chaos-squirrel-runner';

interface ChaosContext extends Context {
  chaosRunner?: Runner;
}

interface MiddyRunnerOptions {
  createRunner: () => Runner;
  wait?: boolean;
}

const middleware = ({
  createRunner,
  wait = true,
}: MiddyRunnerOptions): MiddlewareObject<unknown, unknown, ChaosContext> => {
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
