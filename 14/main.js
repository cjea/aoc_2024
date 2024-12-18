const fs = require("fs");

const fd = "input.txt";
const COLUMNS = 101;
const ROWS = 103;

const LINE = /p=(.+) v=(.+)$/;
function parseLine(line) {
  return line
    .match(LINE)
    .slice(1, 3)
    .map((a) => a.split(",").map(Number));
}

function readInput() {
  return fs
    .readFileSync(fd)
    .toString()
    .split("\n")
    .filter(Boolean)
    .map(parseLine);
}

function elapse(seconds, { rows, cols, position, velocity }) {
  const [px, py] = position;
  const [vx, vy] = velocity;
  const x = (seconds * vx + px) % cols;
  const y = (seconds * vy + py) % rows;

  return [(x + cols) % cols, (y + rows) % rows];
}

function score(input, seconds, rows = ROWS, cols = COLUMNS) {
  const middleRow = Math.floor(rows / 2);
  const middleCol = Math.floor(cols / 2);
  const factors = [0, 0, 0, 0];

  for (const [position, velocity] of input) {
    const [x, y] = elapse(seconds, { rows, cols, position, velocity });
    if (x < middleCol) {
      if (y < middleRow) factors[0] += 1;
      if (y > middleRow) factors[1] += 1;
    }
    if (x > middleCol) {
      if (y < middleRow) factors[2] += 1;
      if (y > middleRow) factors[3] += 1;
    }
  }

  return factors.reduce((acc, cur) => acc * cur);
}

function solve() {
  const input = readInput();
  const seconds = 100;
  const safetyScore = score(input, seconds);

  return safetyScore;
}

console.log(solve());
