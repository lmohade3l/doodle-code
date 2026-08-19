# Tuple to Union

## Problem

Implement a generic `TupleToUnion<T>` which converts the values of a tuple to its values union.

```typescript
type Arr = ['1', '2', '3']

type Test = TupleToUnion<Arr> // '1' | '2' | '3'
```