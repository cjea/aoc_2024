const fs = require("fs");

const COST_A = 3;
const COST_B = 1;
const MAX_PRESSES = 100;

function readInput() {
  const lines = fs.readFileSync("input.txt").toString().split("\n");
  const out = [];
  const reg = new RegExp(/X.(\d+), Y.(\d+)/);
  for (let i = 0; i < lines.length; i += 4) {
    out.push({
      a: lines[i].match(reg).slice(1).map(Number),
      b: lines[i + 1].match(reg).slice(1).map(Number),
      prize: lines[i + 2].match(reg).slice(1).map(Number),
    });
  }

  return out;
}

function minCost({ a, b, prize }) {
  const over = ({ x, y, a, b }) =>
    x > prize[0] || y > prize[1] || a > MAX_PRESSES || b > MAX_PRESSES;
  const press = (cur, button, cost, btn) => ({
    x: cur.x + button[0],
    y: cur.y + button[1],
    a: cur.a + (btn === "A" ? 1 : 0),
    b: cur.b + (btn === "B" ? 1 : 0),
    tokens: cur.tokens + cost,
    presses: cur.presses + 1,
  });

  const memo = {};
  const memoized = ({ x, y }) => memo[x] && memo[x][y];
  const memoize = ({ x, y, tokens }) => {
    if (!memo[x]) memo[x] = {};
    memo[x][y] = tokens;
  };

  const queue = [{ a: 0, b: 0, tokens: 0, x: 0, y: 0 }];
  while (queue.length) {
    const cur = queue.pop();
    if (over(cur)) continue;

    if (memoized(cur) && memoized(cur) <= cur.tokens) continue;

    memoize(cur);
    queue.push(press(cur, a, COST_A, "A"));
    queue.push(press(cur, b, COST_B, "B"));
  }

  return memoized({ x: prize[0], y: prize[1] });
}

function cost(machines) {
  let total = 0;
  for (const m of machines) {
    const price = minCost(m);
    if (price > 0) total += price;
  }

  return total;
}

function solve() {
  const input = readInput();
  const tokens = cost(input);

  return tokens;
}
console.log(solve());
