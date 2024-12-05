const fs = require("fs");

function parsePageOrders(rawPageOrders) {
  const PAGE_ORDER_SEPARATOR = ",";
  const parse = (order) => order.split(PAGE_ORDER_SEPARATOR);

  return rawPageOrders.map(parse);
}

function parseDependencies(rawDependencies) {
  const ret = {};
  const list = (from) => ret[from] || (ret[from] = []);

  const DEPENDENCY_SEPARATOR = "|";
  for (const raw of rawDependencies) {
    const [from, to] = raw.split(DEPENDENCY_SEPARATOR);
    list(from).push(to);
  }

  return ret;
}

function parseInput() {
  const fd = "input.txt";
  const raw = fs.readFileSync(fd).toString().split("\n");

  const rawDependencies = [];
  const rawPageOrders = [];

  let i;
  for (i = 0; raw[i].trim().length > 0; ++i) {
    rawDependencies.push(raw[i]);
  }
  while (raw[++i].trim().length === 0) {}
  for (; raw[i].trim().length > 0; ++i) {
    rawPageOrders.push(raw[i]);
  }

  return {
    dependencies: parseDependencies(rawDependencies),
    pageOrders: parsePageOrders(rawPageOrders),
  };
}

function valid(dependencies, order) {
  const mustPrecede = (a, b) => (dependencies[a] || []).includes(b);
  for (let right = order.length - 1; right > 0; --right) {
    for (let left = right - 1; left >= 0; --left) {
      if (mustPrecede(order[right], order[left])) return false;
    }
  }

  return true;
}

function swap(arr, idx1, idx2) {
  const tmp = arr[idx1];
  arr[idx1] = arr[idx2];
  arr[idx2] = tmp;
}

function fix(dependencies, order) {
  let right, left;
  const mustPrecede = (a, b) => (dependencies[a] || []).includes(b);
  const reset = () => {
    right = order.length - 1;
    left = right - 1;
  };

  reset();
  while (left >= 0 && right > 0) {
    if (mustPrecede(order[right], order[left])) {
      swap(order, right, left);
      reset();
      continue;
    }
    right -= 1;
    left -= 1;
  }

  return order;
}

function sumMiddlesOfValidPageOrders(dependencies, pageOrders) {
  const isValid = valid.bind(null, dependencies);
  const middle = (arr) => arr[Math.floor(arr.length / 2)];
  const sum = (a, b) => Number(a) + Number(b);

  return pageOrders.filter(isValid).map(middle).reduce(sum);
}

function sumMiddlesOfFixedPageOrders(dependencies, pageOrders) {
  const isValid = valid.bind(null, dependencies);
  const fixOrder = fix.bind(null, dependencies);
  const middle = (arr) => arr[Math.floor(arr.length / 2)];
  const sum = (a, b) => Number(a) + Number(b);

  return pageOrders
    .filter((o) => !isValid(o))
    .map(fixOrder)
    .map(middle)
    .reduce(sum);
}

function solve() {
  const { dependencies, pageOrders } = parseInput();
  return sumMiddlesOfValidPageOrders(dependencies, pageOrders);
}

function solve2() {
  const { dependencies, pageOrders } = parseInput();
  return sumMiddlesOfFixedPageOrders(dependencies, pageOrders);
}

console.log(solve());
console.log(solve2());
