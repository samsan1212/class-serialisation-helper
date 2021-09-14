# class-serialisation-helper

Decorators that helps you serialise your response and request

## Installation

```
yarn add class-serialisation-helper
```

```
npm i class-serialisation-helper
```

## Documentation

- [Serialise](#Serialise)
- [SerialiseParam](#SerialiseParam)

To _enable serialisation_, put the `Serialise` decorator on the class method, e.g.

### Serialise response

```typescript
import { Serialise } from "class-serialisation-helper";

class App {
  @Serialise()
  hello() {
    return "hello";
  }
}
```

By default, `Serialise` will have no effect on the function's response.

To serialise the response, add a converter function in the `Serialise` decorator, i.e.

```typescript
const HelloResponseConverter = (v: string) => ({ message: "hello" });

class App {
  @Serialise(HelloResponseConverter)
  hello() {
    return "hello";
  }
}

// the response will become an object
expect(new App().hello()).toEqual({ message: "hello" });
```

### Serialise parameters

To serialise a parameter, we will need `SerialiseParam`, e.g.

```typescript
import { Serialise, SerialiseParam } from "class-serialisation-helper";

type Request = {
  name: string;
  date: Date;
};

const HelloRequestConverter = (name: string) => {
  // you can also validate the input if you like
  if (typeof name !== "string") {
    throw new Error(`"name" is not a string`);
  }
  return { name, date: new Date() };
};

class App {
  @Serialise(HelloResponseConverter)
  hello(@SerialiseParam(HelloRequestConverter) req: Request) {
    return `hello, ${req.name} at ${req.date.toLocaleString()}`;
  }
}

expect(new App().hello("sam")).toEqual(
  expect.objectContaining({
    message: expect.any(String),
  })
);
```

## API

### `Serialise`

Work in progress

### `SerialiseParam`

Work in progress

## Contributions

PRs are always welcome :)
