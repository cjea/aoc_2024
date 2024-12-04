const fs = require("fs");
const DIR = {
  _HOLD: 0,
  UP: 1,
  UP_LEFT: 2,
  LEFT: 3,
  DOWN_LEFT: 4,
  DOWN: 5,
  DOWN_RIGHT: 6,
  RIGHT: 7,
  UP_RIGHT: 8,
};

function readInputLines() {
  return fs.readFileSync("input.txt").toString().split("\n");
}

function extendCoords([row, col], dir) {
  switch (dir) {
    case DIR.UP: {
      return [
        [row, col],
        [row - 1, col],
        [row - 2, col],
        [row - 3, col],
      ];
    }
    case DIR.UP_LEFT: {
      return [
        [row, col],
        [row - 1, col - 1],
        [row - 2, col - 2],
        [row - 3, col - 3],
      ];
    }
    case DIR.LEFT: {
      return [
        [row, col],
        [row, col - 1],
        [row, col - 2],
        [row, col - 3],
      ];
    }
    case DIR.DOWN_LEFT: {
      return [
        [row, col],
        [row + 1, col - 1],
        [row + 2, col - 2],
        [row + 3, col - 3],
      ];
    }
    case DIR.DOWN: {
      return [
        [row, col],
        [row + 1, col],
        [row + 2, col],
        [row + 3, col],
      ];
    }
    case DIR.DOWN_RIGHT: {
      return [
        [row, col],
        [row + 1, col + 1],
        [row + 2, col + 2],
        [row + 3, col + 3],
      ];
    }
    case DIR.RIGHT: {
      return [
        [row, col],
        [row, col + 1],
        [row, col + 2],
        [row, col + 3],
      ];
    }
    case DIR.UP_RIGHT: {
      return [
        [row, col],
        [row - 1, col + 1],
        [row - 2, col + 2],
        [row - 3, col + 3],
      ];
    }
    default:
      throw new Error(`Bad direction: ${dir}`);
  }
}

function listDirections() {
  return [
    DIR.UP,
    DIR.UP_LEFT,
    DIR.LEFT,
    DIR.DOWN_LEFT,
    DIR.DOWN,
    DIR.DOWN_RIGHT,
    DIR.RIGHT,
    DIR.UP_RIGHT,
  ];
}

function hit(letters) {
  return letters === "XMAS";
}

function getByCoord(grid, [row, col]) {
  const rowInBounds = 0 <= row && row < grid.length;
  if (!rowInBounds) return undefined;

  return grid[row][col];
}

function getByCoords(grid, coords) {
  return coords.map((coord) => getByCoord(grid, coord)).join("");
}

function countXmas(grid) {
  const skip = (c) => c !== "X";
  const readWord = getByCoords.bind(null, grid);
  const directions = listDirections();

  let total = 0;
  for (let row = 0; row < grid.length; ++row) {
    for (let col = 0; col < grid[row].length; ++col) {
      const start = [row, col];
      if (skip(getByCoord(grid, start))) continue;

      for (const direction of directions) {
        const word = readWord(extendCoords(start, direction));
        if (hit(word)) total += 1;
      }
    }
  }

  return total;
}

function solve() {
  const grid = readInputLines();
  return countXmas(grid);
}

console.log(solve());
