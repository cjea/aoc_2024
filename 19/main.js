const fs = require("fs");

function readInput() {
  const fd = "input.txt";
  const lines = fs.readFileSync(fd).toString().split("\n");
  const inventory = lines[0]
    .split(",")
    .map((t) => t.trim())
    .sort();
  const designs = lines.slice(2);
  return { inventory, designs };
}

function makePattern(inventory, design) {
  const done = (d) => d === design;
  const seen = new Set();
  const see = (d) => seen.add(d);
  const been = (d) => seen.has(d);

  const queue = [{ d: "" }];
  while (queue.length) {
    const cur = queue.shift();
    if (been(cur.d)) continue;
    if (done(cur.d)) return true;

    const len = cur.d.length;
    for (const i of inventory) {
      const designMatch = design.slice(len, len + i.length);
      if (i === designMatch) {
        queue.push({ d: cur.d + i });
      }
    }
    see(cur.d);
  }

  return false;
}

function countTowels({ inventory, designs }) {
  let count = 0;
  for (const design of designs) {
    if (makePattern(inventory, design)) ++count;
  }

  return count;
}

function solve() {
  const input = readInput();
  const n = countTowels(input);

  return n;
}

console.log(solve());
