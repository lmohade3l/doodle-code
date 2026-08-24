# Readonly

## Problem

Implement the built-in `Readonly<T>` generic without using it.
Constructs a type with all properties of `T` set to readonly, meaning the properties cannot be reassigned.

```typescript
interface Todo {
  title: string
}

const todo: MyReadonly<Todo> = { title: 'Hey' }
todo.title = 'Hello' // Error: cannot reassign a readonly property
```