const fs = require("fs");

function readInput() {
  const fd = "input.txt";
  const lines = fs.readFileSync(fd).toString().split("\n");

  const registers = lines
    .filter((l) => l.startsWith("Register"))
    .map((l) => Number(l.split(":")[1].trim()));

  const program = lines
    .find((l) => l.match(/^Program: ([\d|,]+)/))
    .split(":")[1]
    .trim()
    .split(",")
    .map(Number);

  return { registers, program };
}

function comboOperand(state, operand) {
  return operand < 4 ? operand : state.registers[operand - 4];
}

function fetch(state) {
  const op = state.program[state.ip];
  const operand = state.program[state.ip + 1];

  return { op, operand };
}

function decode(state, { op, operand }) {
  switch (op) {
    case 0: {
      return (state) => {
        const num = state.registers[0];
        const denom = 2 ** comboOperand(state, operand);
        state.registers[0] = Math.floor(num / denom);
        state.ip += 2;
      };
    }
    case 1: {
      return (state) => {
        state.registers[1] ^= operand;
        state.ip += 2;
      };
    }
    case 2: {
      return (state) => {
        state.registers[1] = comboOperand(state, operand) % 8;
        state.ip += 2;
      };
    }
    case 3: {
      return (state) => {
        if (state.registers[0] !== 0) state.ip = operand;
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
        state.out.push(comboOperand(state, operand) % 8);
        state.ip += 2;
      };
    }
    case 6: {
      return (state) => {
        const num = state.registers[0];
        const denom = 2 ** comboOperand(state, operand);
        state.registers[1] = Math.floor(num / denom);
        state.ip += 2;
      };
    }
    case 7: {
      return (state) => {
        const num = state.registers[0];
        const denom = 2 ** comboOperand(state, operand);
        state.registers[2] = Math.floor(num / denom);
        state.ip += 2;
      };
    }
    default:
      throw new Error({ op, operand, state });
  }
}

function execute(state, command) {
  command(state);
}

function evalProgram({ registers, program }) {
  const state = { ip: 0, out: [], registers, program };
  while (state.ip < program.length) {
    execute(state, decode(state, fetch(state)));
  }

  return state;
}

function solve() {
  const input = readInput();
  const state = evalProgram(input);

  return state.out.join(",");
}

console.log(solve());
