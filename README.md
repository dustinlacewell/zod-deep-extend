# zod-deep-extend

`zod-deep-extend` is a powerful utility for extending Zod schemas in a deep and recursive manner. It provides a simple and efficient way to add new fields to your existing Zod schemas, even for nested objects. This package is built on top of the Zod library, a TypeScript-first schema declaration and validation library.

## Installation

You can install `zod-deep-extend` via npm:

```bash
npm install zod-deep-extend
```

Or via pnpm:

```bash
pnpm add zod-deep-extend
```


## Usage

First, import the `deepExtend` function from the package:

```javascript
import { deepExtend } from 'zod-deep-extend';
```

Then, define your original Zod schema:

```javascript
import { z } from 'zod';

const originalSchema = z.object({
  name: z.string(),
  address: z.object({
    city: z.string(),
  }),
});
```

Now, you can extend your schema using `deepExtend`:

```javascript
const extendedSchema = deepExtend(originalSchema, {
  email: z.string().email(),
  age: z.number().int(),
  address: z.object({
    street: z.string(),
    zip: z.string(),
    state: z.string()
  }),
});
```

You can now use your extended schema for validation:

```javascript
const data = {
  name: 'John',
  age: 30,
  email: 'john@example.com',
  address: {
    street: '123 Main St',
    city: 'New York',
    state: 'NY',
    zip: '10001',
  },
};

const result = extendedSchema.safeParse(data);

if (result.success) {
  console.log('Data is valid!');
} else {
  console.log('Data is invalid:', result.error);
}
```

## Why use `zod-deep-extend`?

Without `zod-deep-extend`, the above example would require accessing the internal shape of the original schema:

```typescript
const extendedSchema = originalSchema.extend({
  email: z.string().email(),
  age: z.number().int(),
  address: originalSchema.shape.address.extend({
    street: z.string(),
    zip: z.string(),
    state: z.string()
  }),
});
```

This isn't so bad here, but it can get messy with a more complicated schema:

```typescript
const extendedSchema = originalSchema.extend({
  profile: originalSchema.shape.profile.extend({
    preferences: originalSchema.shape.profile.shape.preferences.extend({
      game: originalSchema.shape.profile.shape.preferences.shape.game.extend({
        stats: originalSchema.shape.profile.shape.preferences.shape.game.shape.stats.extend({
          gameQuestionsAnswered: z.number(),
        }),
      }),
    }),
  }),
});
```

With `zod-deep-extend`, you can simply do this:

```typescript
const extendedSchema = deepExtend(originalSchema, {
  profile: {
    preferences: {
      game: {
        stats: {
          gameQuestionsAnswered: z.number(),
        },
      },
    },
  },
});
```


## Features

- Deeply extend your Zod schemas with new fields.
- Supports nested object schemas.
- Maintains the original schema's type safety.
- Provides clear error messages for invalid extensions.
- Fully compatible with all Zod types.

## Contributing

Contributions are always welcome. Feel free to open a pull request or a issue.

## License

MIT

## Conclusion

`zod-deep-extend` is a handy tool for those who want to extend their Zod schemas in a deep and recursive way. It simplifies the process of adding new fields to your schemas, making your code cleaner and easier to maintain. Try it out today!