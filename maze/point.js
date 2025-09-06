// we gotta create an immutable data structure
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

// save the previous points to prevent duplication
const allPoints = new Map();

const point = (x, y) => {
    const key = `${x}-${y}`
    if (allPoints.has(key)) return allPoints.get(key)

    const newPoint = new Point(x, y)
    // freezing the object so the properties can't get modified
    Object.freeze(newPoint)

    allPoints.set(newPoint)
    return newPoint
}