import Mitm from 'mitm';

export default class HTTPAttack {
  static configure(): () => HTTPAttack {
    return () => {
      const attack = new HTTPAttack();
      return attack;
    };
  }

  stopped = false;

  start(): void {
    const mitm = Mitm();

    mitm.on('connect', (socket) => {
      if (this.stopped) socket.bypass();
    });

    mitm.on('request', (_, res) => {
      res.statusCode = 500;
      // TODO: Fail in different ways, maybe?
      res.end('Request failed');
    });
  }

  stop(): void {
    this.stopped = true;
  }
}
