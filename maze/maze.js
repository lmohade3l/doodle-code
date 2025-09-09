function buildMaze(room, mazeSoFar, seed0) {
  // Find adjacent unconnected rooms.
  const candidates = getCandidates(room, mazeSoFar);
}

function getCandidates(room, mazeSoFar) {
    return [NORTH, SOUTH, EAST, WEST]
        .map(direction => addPoint(room, direction))
        .filter((pt) => mazeSoFar.get(pt)?.size === 0);
}