import run from 'aocrunner';
import _ from 'lodash';

const parseInput = (rawInput) => rawInput.split('');

const part1 = (rawInput) => {
  const input = parseInput(rawInput);
  for (let i = 4; i <= input.length; i++) {
    let sliced = input.slice(i - 4, i);
    if (sliced.length === _.uniq(sliced).length) {
      return i;
    }
  }

  return -1;
};

const part2 = (rawInput) => {
  const input = parseInput(rawInput);
  for (let i = 14; i <= input.length; i++) {
    let sliced = input.slice(i - 14, i);
    if (sliced.length === _.uniq(sliced).length) {
      return i;
    }
  }

  return -1;

  return;
};

run({
  part1: {
    tests: [
      {
        input: 'mjqjpqmgbljsphdztnvjfqwrcgsmlb',
        expected: 7,
      },
      {
        input: 'bvwbjplbgvbhsrlpgdmjqwftvncz',
        expected: 5,
      },
      {
        input: 'nppdvjthqldpwncqszvftbrmjlhg',
        expected: 6,
      },
      {
        input: 'nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg',
        expected: 10,
      },
      {
        input: 'zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw',
        expected: 11,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: 'mjqjpqmgbljsphdztnvjfqwrcgsmlb',
        expected: 19,
      },
      {
        input: 'bvwbjplbgvbhsrlpgdmjqwftvncz',
        expected: 23,
      },
      {
        input: 'nppdvjthqldpwncqszvftbrmjlhg',
        expected: 23,
      },
      {
        input: 'nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg',
        expected: 29,
      },
      {
        input: 'zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw',
        expected: 26,
      },
    ],
    solution: part2,
  },
  trimTestInputs: false,
  onlyTests: false,
});
