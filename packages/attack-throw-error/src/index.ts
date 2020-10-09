export interface ThrowErrorAttackOptions {
  errorClass?: ErrConstructor;
  errorMessage?: string;
  uncaughtException?: boolean;
}

export type ErrConstructor = new (message?: string) => Error;

export default class ThrowErrorAttack {
  static configure(opts: ThrowErrorAttackOptions): () => ThrowErrorAttack {
    return () => {
      const attack = new ThrowErrorAttack(opts);
      return attack;
    };
  }

  errorClass: ErrConstructor;
  errorMessage: string;
  uncaughtException: boolean;
  stopped = false;

  constructor({
    errorClass = Error,
    errorMessage = 'chaos-squirrel: attack-throw-error',
    uncaughtException = false,
  }: ThrowErrorAttackOptions = {}) {
    this.errorClass = errorClass;
    this.errorMessage = errorMessage;
    this.uncaughtException = uncaughtException;
  }

  start(): void {
    this.stopped = false;
    if (!this.uncaughtException) throw new this.errorClass(this.errorMessage);
    setImmediate(() => {
      if (!this.stopped) throw new this.errorClass(this.errorMessage);
    });
  }

  stop(): void {
    this.stopped = true;
  }
}
