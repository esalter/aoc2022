import run from 'aocrunner';
import _ from 'lodash';

const parseInput = (rawInput) =>
  rawInput.split('\n').map((p) =>
    p.split(',').map((a) => {
      let nums = a.split('-').map((n) => parseInt(n));
      let range = _.range(nums[0], nums[1] + 1);
      return range;
    }),
  );

const part1 = (rawInput) => {
  const input = parseInput(rawInput);
  return _.sum(
    input.map((pair) => {
      let elf1 = pair[0];
      let elf2 = pair[1];

      let intersect = _.intersection(elf1, elf2);

      let intLength = intersect.length;

      return intLength === elf1.length || intLength === elf2.length ? 1 : 0;
    }),
  );
};

const part2 = (rawInput) => {
  const input = parseInput(rawInput);
  return _.sum(
    input.map((pair) => {
      let elf1 = pair[0];
      let elf2 = pair[1];

      let intersect = _.intersection(elf1, elf2);

      return intersect.length > 0 ? 1 : 0;
    }),
  );
};

run({
  part1: {
    tests: [
      {
        input: `2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8`,
        expected: 2,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8`,
        expected: 4,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
