const http = require('http');
const process = require('process');
const exec = require('child_process').exec;

const ChaosRunner = require('@dazn/chaos-squirrel-runner');
const CPUAttack = require('@dazn/chaos-squirrel-attack-cpu');

const HOSTNAME = '127.0.0.1';
const PORT = 3000;
const ATTACK_TIME = 3000;

const printCPU = () => {
  exec(`ps -p ${process.pid} -o %cpu,%mem`, function(_, stdout) {
    console.log(stdout);
  });
};

const createRunner = ChaosRunner.configure({
  probability: 0.5,
  possibleAttacks: [{
      createAttack: CPUAttack.configure({
        runTime: ATTACK_TIME,
        allowLoopEvery: 1500
       })
    }]
});

const server = http.createServer((req, res) => {
  const runner = createRunner();
  runner.start();
  console.time('request');
  setTimeout(function(){
    printCPU();
    console.timeEnd('request');
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello World');
    setTimeout(() => {
      console.log('attack stopped')
      runner.stop();
    }, ATTACK_TIME)
  }, 0)
});

server.listen(PORT, HOSTNAME, () => {
  console.log(`To call the service: \n\n curl -o - http://127.0.0.1:3000/ \n`);
  console.log(`To view the CPU: \n\n ps -p ${process.pid} -o %cpu,%mem \n`);
  console.log(`Server running at http://${HOSTNAME}:${PORT}/`);
});
