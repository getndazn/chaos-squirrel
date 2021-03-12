
# @dazn/chaos-squirrel-attack-http-requests

Attacks outgoing HTTP requests.

## Usage

```ts
import HttpAttack from '@dazn/chaos-squirrel-attack-http-requests';
const createHttpAttack = HttpAttack.configure({
  ignoreUrlPatterns: [
      'dontattackme.com'
  ],
});
const httpAttack = createHttpAttack();

// Will intercept HTTP requests and inject failures
await httpAttack.start();

// Will stop injecting failures into HTTP requests
await httpAttack.stop();
```
