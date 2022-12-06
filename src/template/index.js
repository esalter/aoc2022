import run from 'aocrunner';

const parseInput = (rawInput) => rawInput.split('\n');

const part1 = (rawInput) => {
  const input = parseInput(rawInput);
  console.log('input', input);

  return;
};

const part2 = (rawInput) => {
  const input = parseInput(rawInput);
  console.log('input', input);

  return;
};

let input = ``;

run({
  part1: {
    tests: [
      {
        input,
        expected: '',
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input,
        expected: '',
      },
    ],
    solution: part2,
  },
  trimTestInputs: false,
  onlyTests: true,
});
