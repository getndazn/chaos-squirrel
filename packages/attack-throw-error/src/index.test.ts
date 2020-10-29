import ThrowErrorAttack from './';

// jest does not allow to test it with process.on('uncaughtException') https://github.com/facebook/jest/issues/5620

describe('ThrowErrorAttack', () => {
  class CustomError extends Error {
    constructor(message?: string) {
      super(message);
    }
  }
  const defaultErrorMessage = 'chaos-squirrel: attack-throw-error';
  const customErrorMessage = 'My custom chaos error';

  describe('.start', () => {
    jest.useFakeTimers('legacy'); // next major version will default to 'modern' that breaks access to setTimeout args

    it('causes default error to be thrown with default message', async () => {
      const attack = new ThrowErrorAttack();

      try {
        attack.start();
      } catch (err) {
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toBe(defaultErrorMessage);
      }
    });

    it('causes default error to be thrown with custom message', async () => {
      const attack = new ThrowErrorAttack({ errorMessage: customErrorMessage });

      try {
        attack.start();
      } catch (err) {
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toBe(customErrorMessage);
      }
    });

    it('causes default uncaught exception', async () => {
      const attack = new ThrowErrorAttack({ uncaughtException: true });

      attack.start();

      expect(setImmediate).toHaveBeenCalledTimes(1);
      const setTimeoutCb = ((<unknown>setImmediate) as jest.Mock).mock
        .calls[0][0];
      expect(setTimeoutCb).toEqual(expect.any(Function));
      expect(setTimeoutCb).toThrow(Error);
    });

    it('causes custom error to be thrown with default message', async () => {
      const attack = new ThrowErrorAttack({ errorClass: CustomError });

      try {
        attack.start();
      } catch (err) {
        expect(err).toBeInstanceOf(CustomError);
        expect(err.message).toBe(defaultErrorMessage);
      }
    });

    it('causes custom error to be thrown with custom message', async () => {
      const attack = new ThrowErrorAttack({
        errorClass: CustomError,
        errorMessage: customErrorMessage,
      });

      try {
        attack.start();
      } catch (err) {
        expect(err).toBeInstanceOf(CustomError);
        expect(err.message).toBe(customErrorMessage);
      }
    });

    it('causes custom uncaught exception', async () => {
      const attack = new ThrowErrorAttack({
        errorClass: CustomError,
        uncaughtException: true,
      });

      attack.start();

      expect(setImmediate).toHaveBeenCalledTimes(1);
      const setTimeoutCb = ((<unknown>setImmediate) as jest.Mock).mock
        .calls[0][0];
      expect(setTimeoutCb).toEqual(expect.any(Function));
      expect(setTimeoutCb).toThrow(CustomError);
    });

    it('causes error to be thrown even if was stopped before', () => {
      const attack = new ThrowErrorAttack();

      try {
        attack.stop();
        attack.start();
      } catch (err) {
        expect(err).toBeInstanceOf(Error);
      }
    });

    it('causes uncaught exception even if was stopped before', () => {
      const attack = new ThrowErrorAttack({ uncaughtException: true });

      attack.stop();
      attack.start();

      expect(setImmediate).toHaveBeenCalledTimes(1);
      const setTimeoutCb = ((<unknown>setImmediate) as jest.Mock).mock
        .calls[0][0];
      expect(setTimeoutCb).toEqual(expect.any(Function));
      expect(setTimeoutCb).toThrow(Error);
    });
  });

  describe('.stop', () => {
    it('prevents uncaught exception if was not thrown yet', async () => {
      const attack = new ThrowErrorAttack({ uncaughtException: true });

      attack.start();
      attack.stop();

      expect(setImmediate).toHaveBeenCalledTimes(1);
      const setTimeoutCb = ((<unknown>setImmediate) as jest.Mock).mock
        .calls[0][0];
      expect(setTimeoutCb).toEqual(expect.any(Function));
      setTimeoutCb(); // should not cause any error
    });
  });

  describe('.configure', () => {
    it('returns a function which creates a new attack with default options', () => {
      const createAttack = ThrowErrorAttack.configure({});

      const attack = createAttack();

      expect(attack).toBeInstanceOf(ThrowErrorAttack);
      expect(attack.errorClass).toStrictEqual(Error);
      expect(attack.errorMessage).toStrictEqual(defaultErrorMessage);
      expect(attack.uncaughtException).toBe(false);
    });

    it('returns a function which creates a new attack with the given options', () => {
      const createAttack = ThrowErrorAttack.configure({
        errorClass: CustomError,
        errorMessage: customErrorMessage,
        uncaughtException: true,
      });

      const attack = createAttack();

      expect(attack).toBeInstanceOf(ThrowErrorAttack);
      expect(attack.errorClass).toBe(CustomError);
      expect(attack.errorMessage).toBe(customErrorMessage);
      expect(attack.uncaughtException).toBe(true);
    });
  });
});
