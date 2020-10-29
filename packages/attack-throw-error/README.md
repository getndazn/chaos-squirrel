# @dazn/chaos-squirrel-attack-throw-error

Causes an error to be thrown - either directly or via `setImmediate` causing uncaught exception.

### Attack options

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `errorClass` | `ErrConstructor` | `Error` | Instance of that class will be thrown. The class should extend `Error`. |
| `errorMessage` | `string` | `chaos-squirrel: attack-throw-error` | Error message |
| `uncaughtException` | `boolean` | `false` | Flag that decides if uncaught exception is thrown |

### Examples

Immediately thrown error
```ts
import ThrowErrorAttack from '@dazn/chaos-squirrel-attack-throw-error';;

class CustomError extends Error {
  constructor(message?: string) {
    super(message);
  }
}
const errorMessage = 'Chaos!';
const attack = new ThrowErrorAttack({
    errorClass: CustomError,
    errorMessage
});

try {
    attack.start();
} catch (err) {
    err instanceof CustomError // true
    console.log(err.message) // Chaos!
}
```

Uncaught exception
```ts
import ThrowErrorAttack from '@dazn/chaos-squirrel-attack-throw-error';

const attack = new ThrowErrorAttack({ uncaughtException: true });

process.on('uncaughtException', (err) => {
    err instanceof Error // true
    console.log(err.message) // chaos-squirrel: attack-throw-error
})

attack.start();
console.log('Still alive');
// Uncaught exception is thrown via setImmediate so "check" phase
```

Stopping uncaught exception
```ts
import ThrowErrorAttack from '@dazn/chaos-squirrel-attack-throw-error';

const attack = new ThrowErrorAttack({ uncaughtException: true });

attack.start();
attack.stop();
// nothing bad is gonna happen
```

### Uncaught exception
To cause an uncaught exception an error is being thrown from `setImmediate` callback. See [docs](https://nodejs.org/dist/latest-v14.x/docs/api/errors.html#errors_error_first_callbacks).
