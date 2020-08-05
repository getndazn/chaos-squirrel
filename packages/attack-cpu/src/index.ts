const cpuRun = (until: number): number => {
  let loops = 0;
  while (new Date().getTime() < until) {
    loops++;
  }
  return loops;
};

const getNextUntil = (
  runUntil: number,
  allowLoopEvery: number
): { until: number; lastRun: boolean } => {
  const nextTick = Date.now() + allowLoopEvery;
  const lastRun = nextTick > runUntil;
  return { until: lastRun ? runUntil : nextTick, lastRun };
};

const startCPU = ({ runTime = Infinity, allowLoopEvery = 1000 } = {}): {
  stop: () => void;
} => {
  let stopped = false;
  const runUntil = Date.now() + runTime;

  const loopCPU = () => {
    setImmediate(() => {
      if (stopped) return;
      const next = getNextUntil(runUntil, allowLoopEvery);
      // this part it totally blocking
      cpuRun(next.until);
      if (next.lastRun) return;
      loopCPU();
    });
  };

  loopCPU();

  return {
    stop: () => {
      stopped = true;
    },
  };
};

export = startCPU;
