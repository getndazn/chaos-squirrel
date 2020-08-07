const http = require('http');
const process = require('process');
var exec = require('child_process').exec;

const { startCPU } = require('@dazn/chaos-squirrel-cpu');

const HOSTNAME = '127.0.0.1';
const PORT = 3000;

const printCPU = () => {
  exec(`ps -p ${process.pid} -o %cpu,%mem`, function(_, stdout) {
    console.log(stdout);
  });
};

const server = http.createServer((req, res) => {
  const attack = startCPU({
    runTime: 3000,
    allowLoopEvery: 1500
  });
  console.time('request');
  setTimeout(function(){
    printCPU();
    console.timeEnd('request');
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello World');
  }, 0)
});

server.listen(PORT, HOSTNAME, () => {
  console.log(`To call the service: \n\n curl -o - http://127.0.0.1:3000/ \n`);
  console.log(`To view the CPU: \n\n ps -p ${process.pid} -o %cpu,%mem \n`);
  console.log(`Server running at http://${HOSTNAME}:${PORT}/`);
});
