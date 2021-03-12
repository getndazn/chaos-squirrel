import Mitm from 'mitm';

export interface HTTPAttackOptions {
  ignoreUrlPatterns?: string[];
}

export default class HTTPAttack {
  static configure(opts: HTTPAttackOptions): () => HTTPAttack {
    return () => {
      const attack = new HTTPAttack(opts);
      return attack;
    };
  }

  ignoreUrlPatterns: string[];
  stopped = false;

  constructor({ ignoreUrlPatterns = [] }: HTTPAttackOptions = {}) {
    this.ignoreUrlPatterns = ignoreUrlPatterns;
  }

  start(): void {
    const mitm = Mitm();

    mitm.on('connect', (socket, opts) => {
      // https://github.com/moll/node-mitm/issues/16
      // eslint-disable-next-line

      const requestedURL: string = opts?.host || '';

      const shouldIgnore = this.ignoreUrlPatterns.some((needle: string) =>
        requestedURL.includes(needle)
      );

      if (this.stopped || shouldIgnore) socket.bypass();
    });

    mitm.on('request', (_, res) => {
      res.statusCode = 500;
      res.end('Request failed');
    });
  }

  stop(): void {
    this.stopped = true;
  }
}
