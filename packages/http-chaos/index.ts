export default class HTTPAttack {
  static configure(): () => HTTPAttack {
    return () => {
      const attack = new HTTPAttack();
      return attack;
    };
  }

  stopped = false;

  start(): void {
    // TODO: Can we import, here?
    // eslint-disable-next-line
        const Mitm = require('mitm');
    const mitm = Mitm();

    // TODO: Type this value (https://github.com/moll/node-mitm)
    // eslint-disable-next-line
        mitm.on('connect', (socket: any) => {
      if (this.stopped) socket.bypass();
    });

    // TODO: good way to ignore this any on the _ type?
    // eslint-disable-next-line
        mitm.on('request', (_: any, res: any) => {
      res.statusCode = 500;
      // TODO: Fail in different ways, maybe?
      res.end('Request failed');
    });
  }

  stop(): void {
    this.stopped = true;
  }
}
