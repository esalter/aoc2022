import run from 'aocrunner';
import _ from 'lodash';

const parseInput = (rawInput) =>
  rawInput
    .split('\n')
    .map((r) =>
      r.split('').map((h) => ({ h: parseInt(h), v: false, scenic: [] })),
    );

const markRight = (trees) => {
  // a tree is visible here if all the trees to the RIGHT of it are of LESS height than it
  trees.forEach((row) => {
    row.forEach((tree, i) => {
      let rightTrees = row.slice(i + 1);
      let scenic = 0;
      let neighbor;
      do {
        neighbor = rightTrees.shift();
        if (neighbor != null) {
          scenic++;
          if (neighbor.h >= tree.h) {
            neighbor = null;
          }
        } else {
          // it has no more neighbors this way, so it must be visible
          tree.v = true;
        }
      } while (neighbor != null);
      tree.scenic.push(scenic);
    });
  });
};

const part1 = (rawInput) => {
  const input = parseInput(rawInput);
  markRight(input);
  markRight(input.map((row) => row.reverse()));
  let flipped = _.zip(...input);
  markRight(flipped);
  markRight(flipped.map((row) => row.reverse()));

  return _.sum(input.map((row) => _.sumBy(row, (r) => (r.v ? 1 : 0))));
};

const part2 = (rawInput) => {
  const input = parseInput(rawInput);
  markRight(input);
  markRight(input.map((row) => row.reverse()));
  let flipped = _.zip(...input);
  markRight(flipped);
  markRight(flipped.map((row) => row.reverse()));

  return _.max(
    input.map((row) =>
      _.max(
        row.map((t) => {
          if (t.scenic.length == 0) return 0;
          return t.scenic.reduce((p, v) => p * v, 1);
        }),
      ),
    ),
  );
};

let input = `30373
25512
65332
33549
35390`;

run({
  part1: {
    tests: [
      {
        input,
        expected: 21,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input,
        expected: 8,
      },
    ],
    solution: part2,
  },
  trimTestInputs: false,
  onlyTests: false,
});
