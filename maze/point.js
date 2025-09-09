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

export const NORTH = point(0, -1);
export const EAST = point(1, 0);
export const SOUTH = point(0, 1);
export const WEST = point(-1, 0);

export const addPoint = (a, b) => point(
  a.x + b.x,
  a.y + b.y
);