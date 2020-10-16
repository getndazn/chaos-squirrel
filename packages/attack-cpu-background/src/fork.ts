import CPUAttack from '@dazn/chaos-squirrel-attack-cpu';

process.on('message', ({ runTime = Infinity }: { runTime: number }) => {
  const attack = new CPUAttack({
    runTime,
    // don't allow event loop to run, useless in a child process
    allowLoopEvery: Infinity,
  });
  attack.start();
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  process.send!('started');
});
