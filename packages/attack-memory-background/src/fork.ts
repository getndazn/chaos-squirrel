import MemoryAttack from '@dazn/chaos-squirrel-attack-memory';

interface Message {
  size: number;
  stepSize?: number;
  stepTime?: number;
}

process.on('message', ({ size, stepSize, stepTime }: Message) => {
  const attack = new MemoryAttack({
    size,
    stepSize,
    stepTime,
  });
  attack.start();
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  process.send!('started');
});
