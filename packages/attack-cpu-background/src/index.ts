import { fork, ChildProcess } from 'child_process';

const startCPUBackground = ({ runTime = Infinity, threads = 4 } = {}): {
  stop: () => void;
} => {
  const workers: ChildProcess[] = [];
  for (let i = 0; i < threads; i++) {
    const worker = fork(`${__dirname}/fork.js`);
    worker.send({
      runTime,
    });
    workers.push(worker);
  }

  return {
    stop: () => {
      workers.forEach((worker) => {
        worker.kill();
      });
    },
  };
};

export = startCPUBackground;
