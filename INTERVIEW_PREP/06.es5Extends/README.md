# ES5 Extends

## Problem

Implement `myExtends` function that simulates ES6 class inheritance using ES5 patterns. The function should create a new constructor that properly inherits from both a SuperType and SubType.

## Requirements

- Returns a new constructor function
- Applies both SuperType and SubType constructors to instances
- Sets up proper prototype chain:
  - `instance.__proto__` → `SubType.prototype`
  - `instance.__proto__.__proto__` → `SuperType.prototype`
- Static inheritance: `ExtendedType.__proto__` → `SuperType`
- `instanceof` works for both types

## Signature

```typescript
function myExtends(SuperType: Function, SubType: Function): Function
```

## Example

```typescript
function Animal(name) {
  this.name = name
}
Animal.prototype.speak = function () {
  return `${this.name} makes a sound`
}

function Dog(name) {
  this.breed = 'unknown'
}
Dog.prototype.bark = function () {
  return 'Woof!'
}

const ExtendedDog = myExtends(Animal, Dog)
const dog = new ExtendedDog('Buddy')

dog.name // 'Buddy' (from Animal)
dog.breed // 'unknown' (from Dog)
dog.speak() // 'Buddy makes a sound'
dog.bark() // 'Woof!'

dog instanceof Dog // true
dog instanceof Animal // true
```