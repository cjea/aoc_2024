const fs = require("fs");

function range(arr, lo, f) {
  for (let hi = lo; hi < arr.length; ++hi) {
    if (f(arr[hi])) return arr.slice(lo, hi + 1);
  }

  return arr.slice(lo);
}

function readInput() {
  const fd = "input.txt";
  const lines = fs.readFileSync(fd).toString().split("\n");
  const board = range(lines, 0, (l) => l.length === 0)
    .filter(Boolean)
    .map((l) => l.split(""));
  const moves = lines.slice(board.length + 1).join("");

  return { board, moves };
}

const isPlayer = (c) => c === "@";
const isBox = (c) => c === "O" || c === "[" || c === "]";
const isWall = (c) => c === "#" || c == null;
const isFree = (c) => c === ".";

function swap(board, c1, c2) {
  const tmp = at(board, c1);
  board[c1[0]][c1[1]] = at(board, c2);
  board[c2[0]][c2[1]] = tmp;

  return true;
}

const vectors = [
  [-1, 0],
  [0, 1],
  [1, 0],
  [0, -1],
];
const [up, right, down, left] = vectors;
const dirs = { "^": up, ">": right, v: down, "<": left };

function translate([r1, c1], [r2, c2]) {
  return [r1 + r2, c1 + c2];
}
function at(board, [row, col]) {
  if (0 <= row && row < board.length) return board[row][col];

  return undefined;
}

function findPlayer(board) {
  for (let r = 0; r < board.length; ++r) {
    for (let c = 0; c < board[r].length; ++c) {
      if (isPlayer(board[r][c])) return [r, c];
    }
  }
}

function boxCoords(board, pos) {
  const char = at(board, pos);
  if (!isBox(char)) throw new Error("Can't get box coords for " + pos);

  const [row, col] = pos;
  switch (char) {
    case "O":
      return [pos];
    case "[":
      return [[row, col + 1], pos];
    case "]":
      return [[row, col - 1], pos];
    default:
      throw new Error("Malformed box at " + pos);
  }
}

function follow(board, pos, v) {
  const cur = at(board, pos);
  if (isPlayer(cur)) return follow(board, translate(pos, v), v);
  if (isWall(cur) || isFree(cur)) return [cur];
  if (isBox(cur)) {
    const nextBoxes = v[0] ? boxCoords(board, pos) : [pos];
    return nextBoxes.flatMap((p) => follow(board, translate(p, v), v));
  }
}

function shift(board, pos, v) {
  const nxt = translate(pos, v);
  const nxtChar = at(board, nxt);

  if (isWall(nxtChar)) return;
  if (isFree(nxtChar)) return swap(board, pos, nxt);
  if (isBox(nxtChar)) {
    const nextBoxes = v[0] ? boxCoords(board, nxt) : [nxt];
    for (const b of nextBoxes) shift(board, b, v);

    return swap(board, pos, nxt);
  }
}

function playMove(board, move) {
  const player = findPlayer(board);
  const v = dirs[move];
  if (!v) throw new Error("Invalid move: " + move);

  const legal = follow(board, player, v).every(isFree);
  if (!legal) return;

  shift(board, player, v);
}

function play(board, moves) {
  for (let i = 0; i < moves.length; ++i) {
    playMove(board, moves[i]);
  }
}

function gpsCoordinateSum(input, cmp = isBox) {
  const { board, moves } = input;
  play(board, moves);

  let total = 0;
  for (let r = 0; r < board.length; ++r) {
    for (let c = 0; c < board[r].length; ++c) {
      if (cmp(at(board, [r, c]))) total += 100 * r + c;
    }
  }

  return total;
}

function solve() {
  const input = readInput();
  const coordinateSum = gpsCoordinateSum(input);

  return coordinateSum;
}

function solve2() {
  const grow = { "#": "##", O: "[]", ".": "..", "@": "@." };
  const expand = (char) => grow[char].split("");

  const input = readInput();
  input.board = input.board.map((row) => row.flatMap(expand));

  const coordinateSum = gpsCoordinateSum(input, (c) => c === "[");

  return coordinateSum;
}

console.log(solve());
console.log(solve2());
