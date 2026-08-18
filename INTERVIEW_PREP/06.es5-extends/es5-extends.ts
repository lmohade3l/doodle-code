function myExtends(SubType: any, SuperType: any) {
    function ExtendedType(this: any, ...args: any[]) {
        const target = Object.create(SubType.prototype)

        SuperType.apply(target, args)
        SubType.apply(target, args)

        return target
    }

    Object.setPrototypeOf(SubType.prototype, SuperType.prototype)
    Object.setPrototypeOf(ExtendedType, SuperType)

    return ExtendedType
}

function Animal(this: any, name: string) { this.name = name }
Animal.print = () => { console.log('Animal') }
Animal.prototype.greet = function () { return `Hello, ${this.name}` }

function Dog(this: any) { this.breed = 'Labrador' }
Dog.prototype.bark = function () { return `${this.name} says Woof!` }

const DogExtended = myExtends(Dog, Animal)
const dog = new (DogExtended as any)('Rex')

console.log(dog.name)                 // "Rex"
console.log(dog.breed)                // "Labrador"
console.log(dog.greet())              // "Hello, Rex"
console.log(dog.bark())               // "Rex says Woof!"
console.log(dog instanceof Animal)    // true
;(DogExtended as any).print()         // "Animal"