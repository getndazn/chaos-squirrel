import MemoryAttack from '@dazn/chaos-squirrel-attack-memory';

process.on('message', ({ size }: { size: number }) => {
  const attack = new MemoryAttack({
    size,
  });
  attack.start();
});
