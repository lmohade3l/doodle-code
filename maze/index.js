const { Map, List } = Immutable;

const mapWithObjects = Map([
    [{ x: 3, y: 5 }, 'First Obj'],
    [{ x: 3, y: 5 }, 'Second Obj'],
])
console.log('mapWithObjects length:', mapWithObjects.toArray().length);

const mapWithPoints = Map([
    [point(3, 5), 'First Obj'],
    [point(3, 5), 'Second Obj'],
])
console.log('mapWithPoints length:', mapWithPoints.toArray().length);

const n = 3;
const emptyArray = new Array(n ** 2).fill(undefined)
const roomList = emptyArray.map((_, i) => [point(i % n, Math.floor(i / n)), List()])

console.log({roomList})
const grid = Map(roomList)

console.log('Grid', grid);