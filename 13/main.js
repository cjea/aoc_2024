const fs = require("fs");

const COST_A = 3n;
const COST_B = 1n;
const ZERO = 0n;

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

function gcd(a, b) {
  const rem = a % b;
  if (!rem) return b;

  return gcd(b, rem);
}

function div(a, b) {
  const d = gcd(a, b);

  return BigInt(a / d) / BigInt(b / d);
}

function reaches(start, dest, step) {
  return (dest - start) % step === ZERO;
}

/**
--------------------------------------------------------------------------------
Each button, A and B, gives the slope of a line. Given a coordinate plane, draw
a line of A presses from origin, and draw a line of B presses from the prize.

Find the intersection of the two lines. If steps along the A vector can land on
the point, and steps along the B vector lead from the point to the prize, then
the point is a solution. Determine how many A and B presses are required by
dividing the distance by the step size.

All math needs to avoid floating point operations, or else there are IEEE 754
rounding errors.

Line for A:               Line for B:
===========               ===========
y = ma * x                y = mb * x' + b
  where ma = ay/ax          where mb = by/bx
                                  x' = (x - px)
                                  b  = py
Equivalence
===========
ma(x) = mb(x) - mb(px) + py
x(ma - mb) = py - mb(px)
x = (py - mb(px)) / (ma - mb)  👈 Multiply by (ax * bx)

x = (ax * (bx(py) - by(px))) / (ay(bx) - by(ax))
y = ay(x) / ax

Check if (x, y) comes via A and leads to prize via B.

*/
function minCost({ a, b, prize }) {
  const [ax, ay] = a.map(BigInt);
  const [bx, by] = b.map(BigInt);
  const [px, py] = prize.map(BigInt);

  if (ay * bx === by * ax) throw new Error("Same slopes");

  const xnum = ax * (bx * py - by * px);
  const xden = ay * bx - by * ax;

  const x = div(xnum, xden);
  const y = div(ay * x, ax);
  if (
    reaches(ZERO, x, ax) &&
    reaches(ZERO, y, ay) &&
    reaches(x, px, bx) &&
    reaches(y, py, by)
  ) {
    return COST_A * div(x, ax) + COST_B * div(px - x, bx);
  }

  return 0;
}

function cost(machines) {
  let total = ZERO;
  for (const m of machines) {
    const price = minCost(m);
    if (price > 0) total += price;
  }

  return total;
}

function solve() {
  const input = readInput();
  console.log("Part 1", cost(input).toString());
}

function solve2() {
  const offset = 10000000000000;
  const input = readInput().reduce((arr, m) => {
    m.prize[0] += offset;
    m.prize[1] += offset;
    arr.push(m);
    return arr;
  }, []);

  console.log("Part 2:", cost(input).toString());
}

solve();
solve2();
