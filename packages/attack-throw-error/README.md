# @dazn/chaos-squirrel-attack-throw-error

Causes an error to be thrown - either directly or via `setImmediate` causing uncaught exception.

### Attack options

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `error` | `Error` | `new Error('chaos-squirrel: attack-throw-error')` | An error to be thrown |
| `uncaughtException` | `boolean` | `false` | Flag that decides if uncaught exception is thrown |

### Examples

Immediately thrown error
```ts
import ThrowErrorAttack from '@dazn/chaos-squirrel-attack-throw-error';;

const error = new Error('Chaos!');
const attack = new ThrowErrorAttack({ error });

try {
    attack.start();
} catch (err) {
    err === error // true
}
```

Uncaught exception
```ts
import ThrowErrorAttack from '@dazn/chaos-squirrel-attack-throw-error';

const error = new Error('Chaos!');
const attack = new ThrowErrorAttack({ uncaughtException: true, error });

process.on('uncaughtException', (err) => {
    err === error // true
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
