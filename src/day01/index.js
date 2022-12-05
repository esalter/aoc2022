import run from 'aocrunner';
import _ from 'lodash';

const parseInput = (rawInput) => rawInput.split('\n\n');

const part1 = (rawInput) => {
  const input = parseInput(rawInput);

  let elves = input.map((e) => _.sum(e.split('\n').map((v) => parseInt(v))));
  return _.max(elves);
};

const part2 = (rawInput) => {
  const input = parseInput(rawInput);

  let elves = input.map((e) => _.sum(e.split('\n').map((v) => parseInt(v))));

  let topElves = elves.sort((a, b) => b - a).slice(0, 3);
  return _.sum(topElves);
};

run({
  part1: {
    tests: [
      {
        input: `1000
2000
3000

4000

5000
6000

7000
8000
9000

10000`,
        expected: 24000,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `1000
2000
3000

4000

5000
6000

7000
8000
9000

10000`,
        expected: 45000,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
