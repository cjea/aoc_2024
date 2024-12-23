const fs = require("fs");

function readInput() {
  const fd = "input.txt";
  const lines = fs.readFileSync(fd).toString().split("\n");

  const registers = lines
    .filter((l) => l.startsWith("Register"))
    .map((l) => BigInt(Number(l.split(":")[1].trim())));

  const program = lines
    .find((l) => l.match(/^Program: ([\d|,]+)/))
    .split(":")[1]
    .trim()
    .split(",")
    .map(Number);

  return { registers, program };
}

function comboOperand(state, operand) {
  return operand < 4 ? BigInt(operand) : BigInt(state.registers[operand - 4]);
}

function read(state) {
  const op = state.program[state.ip];
  const operand = state.program[state.ip + 1];

  switch (op) {
    case 0: {
      return (state) => {
        state.registers[0] >>= comboOperand(state, operand);
        state.ip += 2;
      };
    }
    case 1: {
      return (state) => {
        state.registers[1] ^= BigInt(operand);
        state.ip += 2;
      };
    }
    case 2: {
      return (state) => {
        state.registers[1] = comboOperand(state, operand) % 8n;
        state.ip += 2;
      };
    }
    case 3: {
      return (state) => {
        if (state.registers[0] !== 0n) state.ip = operand;
        else state.ip += 2;
      };
    }
    case 4: {
      return (state) => {
        state.registers[1] ^= state.registers[2];
        state.ip += 2;
      };
    }
    case 5: {
      return (state) => {
        state.out.push(comboOperand(state, operand) % 8n);
        state.ip += 2;
      };
    }
    case 6: {
      return (state) => {
        state.registers[1] = state.registers[0] >> comboOperand(state, operand);
        state.ip += 2;
      };
    }
    case 7: {
      return (state) => {
        state.registers[2] = state.registers[0] >> comboOperand(state, operand);
        state.ip += 2;
      };
    }
    default:
      throw new Error({ op, operand, state });
  }
}

function evaluate(state, command) {
  command(state);
  return state;
}

function evalProgram({ registers, program }) {
  const state = { ip: 0, out: [], registers, program };
  while (state.ip < program.length) evaluate(state, read(state));

  return state;
}

async function evalQuine({ program }) {
  function explore(prefix, target) {
    const as = [];
    let state;

    for (let a = 0n; a < 8n; ++a) {
      const reg = (prefix << 3n) | a;
      state = { program, ip: 0, registers: [reg, 0n, 0n], out: [] };

      while (state.ip < program.length) {
        evaluate(state, read(state));
        if (state.out.length > 0) {
          if (BigInt(state.out[0]) === BigInt(target)) as.push(a);

          state.ip = Infinity;
        }
      }
    }
    return as;
  }

  let lowest = null;
  const submit = (score) => {
    if (lowest == null || lowest > score) lowest = score;
  };
  const queue = [{ prefix: 0n, idx: program.length - 1 }];
  while (queue.length) {
    const cur = queue.shift();
    if (cur.idx < 0) {
      submit(cur.prefix);
      continue;
    }
    const results = explore(cur.prefix, BigInt(program[cur.idx]));
    if (!results.length) continue;

    for (const a of results) {
      queue.push({
        prefix: (cur.prefix << 3n) | a,
        idx: cur.idx - 1,
      });
    }
  }

  return { prefix: lowest, prefixb: lowest.toString(2) };
}

function solve() {
  const input = readInput();
  const state = evalProgram(input);

  return state.out.join(",");
}

async function solve2() {
  const input = readInput();
  const ret = await evalQuine(input);
  console.log({ part2: ret });
  input.registers[0] = ret.prefix;
  const state = evalProgram(input);
  return state.out.join(",");
}

console.log(solve());
solve2().then((ret) => console.log(ret));
