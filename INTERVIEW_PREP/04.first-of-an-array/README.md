# First of Array

## Problem

Implement a generic `First<T>` that takes an Array `T` and returns its first element's type.

```typescript
type arr1 = ['a', 'b', 'c']
type arr2 = [3, 2, 1]

type head1 = First<arr1> // 'a'
type head2 = First<arr2> // 3

type arr3 = []
type head3 = First<arr3> // never
```