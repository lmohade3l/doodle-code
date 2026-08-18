# Tuple Length

## Problem

For a given tuple, you need to create a generic `Length` that picks the length of the tuple
(as a specific number literal, not just `number`).

```typescript
type tesla = ['tesla', 'model 3', 'model X', 'model Y']
type spaceX = ['FALCON 9', 'FALCON HEAVY', 'DRAGON', 'STARSHIP', 'HUMAN SPACEFLIGHT']

type teslaLength = Length<tesla> // 4
type spaceXLength = Length<spaceX> // 5
```

## Explanation

### Key Concepts

- **Tuple types** are fixed-length arrays where each position has a known type
- **Indexed access types** let you look up a specific property of a type using bracket notation (`T['prop']`)
- The `'length'` property on a **tuple** resolves to a **number literal** (e.g. `4`), not the general `number` type
