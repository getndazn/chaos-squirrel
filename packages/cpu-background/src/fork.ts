import { startCPU } from '@dazn/chaos-squirrel-cpu';

process.on('message', ({ runTime }) => {
  startCPU({
    runTime,
    // don't allow event loop to run, useless in a child process
    allowLoopEvery: Infinity,
  });
});
