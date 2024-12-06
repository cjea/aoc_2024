const fs = require("fs");

function loadMap() {
  const lines = fs
    .readFileSync("input.txt")
    .toString()
    .split("\n")
    .map((row) => row.split(""))
    .filter(Boolean);

  return lines;
}

const DIR_UP = 0;
const DIR_RIGHT = 1;
const DIR_DOWN = 2;
const DIR_LEFT = 3;
const NUM_DIRS = 4;

const vectors = {
  [DIR_UP]: [-1, 0],
  [DIR_RIGHT]: [0, 1],
  [DIR_DOWN]: [1, 0],
  [DIR_LEFT]: [0, -1],
};

function inBounds(map, [row, col]) {
  return 0 <= row && row < map.length && 0 <= col && col < map[row].length;
}

function addCoords(c1, c2) {
  return [c1[0] + c2[0], c1[1] + c2[1]];
}

function getByCoord(map, coords) {
  if (!inBounds(map, coords)) return undefined;

  return map[coords[0]][coords[1]];
}

function isGuard(c) {
  return c === "^" || c === ">" || c === "v" || c === "<";
}

function isObstacle(c) {
  return c === "#";
}

function markObstacle(map, [row, col]) {
  map[row][col] = "#";
}

function isVisited(c) {
  return c === "X";
}

function markVisited(map, [row, col]) {
  map[row][col] = "X";
}

function guardDirection(g) {
  switch (g) {
    case "^":
      return DIR_UP;
    case ">":
      return DIR_RIGHT;
    case "v":
      return DIR_DOWN;
    case "<":
      return DIR_LEFT;
    default:
      throw new Error(`Bad guard: ${g}`);
  }
}

function findGuard(map) {
  for (let row = 0; row < map.length; ++row) {
    for (let col = 0; col < map[row].length; ++col) {
      const cell = map[row][col];
      if (isGuard(cell)) {
        return { coords: [row, col], direction: guardDirection(cell) };
      }
    }
  }

  return null;
}

function countVisited(map) {
  let total = 0;
  for (let row = 0; row < map.length; ++row) {
    for (let col = 0; col < map[row].length; ++col) {
      const cell = map[row][col];
      if (isVisited(cell)) total += 1;
    }
  }

  return total;
}

function step(map, coords, direction) {
  const vector = vectors[direction];
  if (!vector) throw new Error(`Bad direction: ${direction}`);

  const turn = () => (direction + 1) % NUM_DIRS;
  const newCoords = addCoords(coords, vector);

  if (isObstacle(getByCoord(map, newCoords))) {
    return step(map, coords, turn());
  }

  return { newCoords, newDirection: direction };
}

function countDistinctPositions(map) {
  let guard = findGuard(map);
  if (!guard) throw new Error("No guard");

  let { coords, direction } = guard;
  const _step = () => {
    const { newCoords, newDirection } = step(map, coords, direction);
    coords = newCoords;
    direction = newDirection;
  };

  while (inBounds(map, coords)) {
    markVisited(map, coords);
    _step();
  }

  return countVisited(map);
}

function hasLoop(map) {
  let seen = {};
  const markSeen = ([row, col], direction) => {
    if (!seen[row]) seen[row] = {};
    if (!seen[row][col]) seen[row][col] = [];

    seen[row][col].push(direction);
  };
  const been = ([row, col], direction) =>
    seen[row] && seen[row][col] && seen[row][col].includes(direction);

  let guard = findGuard(map);
  if (!guard) throw new Error("No guard");

  let { coords, direction } = guard;
  const _step = () => {
    const { newCoords, newDirection } = step(map, coords, direction);
    coords = newCoords;
    direction = newDirection;
  };

  while (inBounds(map, coords)) {
    if (been(coords, direction)) return true;

    markSeen(coords, direction);
    _step();
  }

  return false;
}

function countPossibleLoopsBruteForce(map) {
  let total = 0;
  for (let row = 0; row < map.length; ++row) {
    for (let col = 0; col < map[row].length; ++col) {
      const cell = map[row][col];
      if (isGuard(cell) || isObstacle(cell)) continue;

      markObstacle(map, [row, col]);
      if (hasLoop(map)) total += 1;
      map[row][col] = cell;
    }
  }

  return total;
}

function solve() {
  const map = loadMap();
  const n = countDistinctPositions(map);

  return n;
}

function solve2() {
  const map = loadMap();
  const n = countPossibleLoopsBruteForce(map);

  return n;
}

console.log(solve());
console.log(solve2());
