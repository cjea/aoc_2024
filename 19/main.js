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

const memo = {};
const mGet = (str) => memo[str];
const mSet = (str, total) => (memo[str] = total);

function countPatterns(inventory, design) {
  if (mGet(design) != null) return mGet(design);
  if (design === "") return 1;

  const edgeP = (inv) => design.startsWith(inv);
  let total = 0;
  for (const inv of inventory.filter(edgeP)) {
    const remaining = design.slice(inv.length);
    const count = countPatterns(inventory, remaining);
    total += count;
    mSet(remaining, count);
  }
  mSet(design, total);

  return total;
}

function solve() {
  const { inventory, designs } = readInput();
  let count = 0;
  for (const design of designs) if (countPatterns(inventory, design)) ++count;

  return count;
}

function solve2() {
  const { inventory, designs } = readInput();
  let count = 0;
  for (const design of designs) count += countPatterns(inventory, design);

  return count;
}

console.log(solve());
console.log(solve2());
