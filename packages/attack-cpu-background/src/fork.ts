import startCPU from '@dazn/chaos-squirrel-attack-cpu';

process.on('message', ({ runTime = Infinity }: { runTime: number }) => {
  startCPU({
    runTime,
    // don't allow event loop to run, useless in a child process
    allowLoopEvery: Infinity,
  });
});
