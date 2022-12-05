import run from 'aocrunner';
import _ from 'lodash';

const parseInput = (rawInput) => {
  let lines = rawInput.split('\n');
  // zip transforms from row-based to column based (basically)
  let stacks = _.zip(
    ..._.compact(lines.map((l) => l.match(/(\[[A-Za-z]+\]|\s{4})/g))).map(
      (row) => row.map((i) => i.trim()),
    ),
  )
    // pop off all empty parts of the stack so we JUST have the stack of crates
    .map((s) => _.compact(s));

  let moves = _.compact(
    lines.map((l) => l.match(/move (\d+) from (\d+) to (\d+)/)),
  ).map((m) => ({
    numMoves: parseInt(m[1]),
    fromStack: parseInt(m[2]),
    toStack: parseInt(m[3]),
  }));

  return {
    moves,
    stacks,
  };
};

const makeSingleMove = (stacks, move, times) => {
  if (times == 0) return;
  let fromStack = move.fromStack - 1; // 0-based index
  let toStack = move.toStack - 1;

  stacks[toStack].unshift(stacks[fromStack].shift());

  return makeSingleMove(stacks, move, times - 1);
};

const makeMultipleMove = (stacks, move, times) => {
  if (times == 0) return;
  let fromStack = move.fromStack - 1; // 0-based index
  let toStack = move.toStack - 1;

  // send multiple items to the front of the new stack
  stacks[toStack].unshift(...stacks[fromStack].slice(0, times));
  // make sure to remove the elements from the old stack
  stacks[fromStack] = stacks[fromStack].slice(times);
};

const part1 = (rawInput) => {
  const input = parseInput(rawInput);

  input.moves.forEach((move) =>
    makeSingleMove(input.stacks, move, move.numMoves),
  );

  // now build the solution
  let result = input.stacks.reduce(
    (str, stack) => str.concat(stack.shift().replace(/\[|\]/g, '')),
    '',
  );

  return result;
};

const part2 = (rawInput) => {
  const input = parseInput(rawInput);

  input.moves.forEach((move) =>
    makeMultipleMove(input.stacks, move, move.numMoves),
  );

  // now build the solution
  let result = input.stacks.reduce(
    (str, stack) => str.concat(stack.shift().replace(/\[|\]/g, '')),
    '',
  );

  return result;
};

run({
  part1: {
    tests: [
      {
        input: `    [D]    
[N] [C]    
[Z] [M] [P]
  1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`,
        expected: 'CMZ',
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `    [D]    
[N] [C]    
[Z] [M] [P]
  1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`,
        expected: 'MCD',
      },
    ],
    solution: part2,
  },
  trimTestInputs: false,
  onlyTests: false,
});
