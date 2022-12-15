import run from 'aocrunner';
import { addGridItem, makeGrid } from '../utils/index.js';
import stringify from 'json-stringify-pretty-compact';
import _ from 'lodash';
import { exit } from 'process';

const parseInput = (rawInput) => {
  let rows = 0;
  let columns = 0;
  let segments = rawInput.split('\n').map((segment) =>
    segment.split(' -> ').map((p) =>
      p.split(',').map((c, i) => {
        let v = parseInt(c);
        if (i === 0 && rows < v) {
          rows = v;
        }
        if (i === 1 && columns < v) {
          columns = v;
        }
        return v;
      }),
    ),
  );

  return {
    rows,
    columns,
    segments,
  };
};

const drawLine = (grid, start, end) => {
  // console.log('drawing line from start/end', start, end);
  if (start[0] === end[0]) {
    if (start[1] > end[1]) {
      // try again reversing arg order
      return drawLine(grid, end, start);
    }

    // same row -> build the range of y numbers
    // they're in order already
    for (let i = start[1]; i <= end[1]; i++) {
      addGridItem(grid, start[0], i, 'x', '.');
    }
  } else {
    if (start[0] > end[0]) {
      // try again reversing arg order
      return drawLine(grid, end, start);
    }

    // same column -> build the range of x numbers
    for (let i = start[0]; i <= end[0]; i++) {
      addGridItem(grid, i, start[1], 'x', '.');
    }
  }
};

const buildRockMaze = (input) => {
  let { segments, rows, columns } = input;
  let grid = makeGrid(rows + 1, columns + 1, '.');
  segments.forEach((segment) => {
    for (let i = 0; i < segment.length; i++) {
      let start = segment[i];
      let end = segment[i + 1];
      if (end == null) continue;

      drawLine(grid, start, end);
    }
    // console.log('grid after drawing segment', segment, stringify(grid));
  });
  return grid;
};

const isVoid = (grid, pointX, pointY, verbose = false) => {
  let v = grid[pointX][pointY];
  if (verbose) console.log('checking if void', v);
  return v == null;
};

const isBlocked = (grid, pointX, pointY, verbose = false) => {
  let v = grid[pointX][pointY];
  if (verbose) console.log('checking if blocked', v);
  return !['.', '~'].includes(v);
};

const dropSand = (grid, sandX = 500, sandY = 0, verbose = false) => {
  // check if we're immediately blocked
  if (sandX === 500 && sandY === 0 && grid[sandX][sandY] === 'o') {
    return false;
  }
  switch (grid[sandX][sandY]) {
    case '.':
    case '~':
      // empty space, keep falling straight down
      // note, might have to check for falling off the grid here.
      if (verbose) {
        // console.log('got a ', grid[sandX][sandY], 'at point ', sandX, sandY);
        addGridItem(grid, sandX, sandY, '~');
      }
      return dropSand(grid, sandX, sandY + 1, verbose);
    default:
      // reached a wall. can we go left?
      // check the void first
      if (isVoid(grid, sandX - 1, sandY, verbose)) {
        // we're done.
        // console.log('reached the void');
        return false;
      }
      if (!isBlocked(grid, sandX - 1, sandY, verbose)) {
        // +1 sandY?

        if (verbose) {
          console.log('we are not blocked to the left ', sandX, sandY);
        }
        return dropSand(grid, sandX - 1, sandY, verbose); // +1 sandY?
      }
      // how about right?
      // check the void first
      if (isVoid(grid, sandX + 1, sandY, verbose)) {
        // we're done.
        // console.log('reached the void');
        return false;
      }
      if (!isBlocked(grid, sandX + 1, sandY, verbose)) {
        // +1 sandY?
        if (verbose) {
          console.log('we are not blocked to the right ', sandX, sandY);
        }
        return dropSand(grid, sandX + 1, sandY, verbose); // +1 sandY?
      }

      // we're completely stuck, go up one, draw here and stop.
      if (verbose) {
        // console.log('we are stuck - drawing sand resting spot', sandX, sandY);
      }
      addGridItem(grid, sandX, sandY - 1, 'o');
      return true;
  }
};

const draw = (thing, rows = 15) => {
  let length = thing.length;
  console.log(_.zip(...thing.slice(length - rows)).map((r) => r.join('')));
};

const part1 = (rawInput) => {
  const input = parseInput(rawInput);
  let grid = buildRockMaze(input);
  let numSand = 0;
  while (true) {
    let sandResult = dropSand(grid);
    if (!sandResult) {
      break;
    }
    numSand++;
  }
  // draw(grid);
  // let sandResult = dropSand(grid, undefined, undefined, true);

  // draw(grid);

  return numSand;
};

const part2 = (rawInput) => {
  const input = parseInput(rawInput);
  let grid = buildRockMaze(input);

  // draw the floor - two units more than highest y value, and twice as long so we have room to grow the pyramid.
  drawLine(grid, [0, input.columns + 2], [input.rows * 2, input.columns + 2]);
  let numSand = 0;
  while (true) {
    let sandResult = dropSand(grid);
    if (!sandResult) {
      break;
    }
    numSand++;
  }
  // draw(grid);
  // let sandResult = dropSand(grid, undefined, undefined, true); // to si
  // draw(grid);

  return numSand;
};

let input = `498,4 -> 498,6 -> 496,6
503,4 -> 502,4 -> 502,9 -> 494,9`;

run({
  part1: {
    tests: [
      {
        input,
        expected: 24,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input,
        expected: 93,
      },
    ],
    solution: part2,
  },
  trimTestInputs: false,
  onlyTests: false,
});
