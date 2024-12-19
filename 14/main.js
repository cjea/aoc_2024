const fs = require("fs");
const readline = require("readline");

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

function tick(input, rows = ROWS, cols = COLUMNS) {
  for (let i = 0; i < input.length; ++i) {
    const [position, velocity] = input[i];
    input[i][0] = elapse(1, { rows, cols, position, velocity });
  }
}

function neighbors(board, row, col) {
  let neighborRobots = [];
  const indexable = (o) => (i) => 0 <= i && i < o.length;
  for (const r of [row - 1, row, row + 1].filter(indexable(board))) {
    for (const c of [col - 1, col, col + 1].filter(indexable(board[r]))) {
      if (r === row && c === col) continue;

      if (board[r][c]) neighborRobots.push([r, c]);
    }
  }
  return neighborRobots;
}

const TOTAL_ROBOTS = 500;
const NEIGHBOR_THRESHOLD = 2;
const CONNECTED_FACTOR = 0.5;
const MIN_CONNECTED = CONNECTED_FACTOR * TOTAL_ROBOTS;

function runAnalysis(board) {
  let connected = new Set();
  for (let row = 0; row < board.length; ++row) {
    for (let col = 0; col < board[row].length; ++col) {
      if (!board[row][col]) continue;

      const ns = neighbors(board, row, col);
      if (NEIGHBOR_THRESHOLD <= ns.length) connected.add(`${row},${col}`);
    }
  }

  return {
    connected: connected.size,
    total: TOTAL_ROBOTS,
    ratio: connected.size / TOTAL_ROBOTS,
  };
}

function draw(input) {
  const newRow = () => new Array(COLUMNS).fill(0);
  const board = new Array(ROWS).fill(null).map(newRow);

  for (const [[x, y]] of input) board[y][x] += 1;

  const analysis = runAnalysis(board);
  if (analysis.connected < MIN_CONNECTED) {
    return { ok: false, result: analysis };
  }

  console.log(board.map((row) => row.map((c) => c || ".").join("")).join("\n"));
  console.log(analysis);

  return { ok: true, result: analysis };
}

function quadrants(input, rows = ROWS, cols = COLUMNS) {
  const middleRow = Math.floor(rows / 2);
  const middleCol = Math.floor(cols / 2);
  const quads = [0, 0, 0, 0];

  for (const [[x, y]] of input) {
    if (x < middleCol) {
      if (y < middleRow) quads[0] += 1;
      if (y > middleRow) quads[1] += 1;
    }
    if (x > middleCol) {
      if (y < middleRow) quads[2] += 1;
      if (y > middleRow) quads[3] += 1;
    }
  }

  return quads;
}

function safetyScore(input, seconds, rows = ROWS, cols = COLUMNS) {
  for (let i = 0; i < seconds; ++i) tick(input, rows, cols);

  return quadrants(input, rows, cols).reduce((acc, cur) => acc * cur);
}

function solve() {
  const input = readInput();
  const seconds = 100;
  const score = safetyScore(input, seconds);

  return score;
}

async function solve2() {
  const input = readInput();
  const sleep = (n) => new Promise((r) => setTimeout(r, n));

  let seconds = 0;
  while (true) {
    tick(input, ROWS, COLUMNS);
    ++seconds;

    const { ok } = draw(input);
    if (ok) {
      console.log({ seconds });
      await sleep(1000);
    }
  }
}

console.log("Part 1: " + solve());
solve2();
