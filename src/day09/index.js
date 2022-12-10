import run from 'aocrunner';
import _ from 'lodash';
import { makeGrid, incrementGridItem, reduceGrid } from '../utils/index.js';

const parseInput = (rawInput) =>
  rawInput
    .split('\n')
    .map((l) => l.split(' ').map((c, i) => (i === 1 ? parseInt(c) : c)));

const moveTail = (head, tail) => {
  let xDiff = head.x - tail.x;
  let yDiff = head.y - tail.y;

  let moveX = 0;
  let moveY = 0;
  if (Math.abs(xDiff) > 1) {
    moveX = Math.sign(xDiff);

    // also moveY
    moveY = Math.sign(yDiff);
  }
  if (Math.abs(yDiff) > 1) {
    moveY = Math.sign(yDiff);
    moveX = Math.sign(xDiff);
  }

  tail.x += moveX;
  tail.y += moveY;
};

const makeMove = (positions, head, tail, move) => {
  let [direction, steps] = move;
  for (let i = 0; i < steps; i++) {
    switch (direction) {
      case 'R':
        head.x++;
        break;
      case 'L':
        head.x--;
        break;
      case 'U':
        head.y++;
        break;
      case 'D':
        head.y--;
        break;
    }

    moveTail(head, tail);
    positions.push(_.clone(tail));
  }
};

const makeMovePart2 = (positions, knots, move) => {
  let [direction, steps] = move;
  for (let i = 0; i < steps; i++) {
    let head = knots[0];

    switch (direction) {
      case 'R':
        head.x++;
        break;
      case 'L':
        head.x--;
        break;
      case 'U':
        head.y++;
        break;
      case 'D':
        head.y--;
        break;
    }

    // the head moved, now we need to move all the tail knots accordingly
    // each tail follows the one in front of it, if needed.
    for (let j = 1; j < knots.length; j++) {
      let tail = knots[j];
      // head is the relative head from current tail.
      moveTail(head, tail);
      if (j == knots.length - 1) {
        // this is the true tail, push its position
        positions.push(_.clone(tail));
      }

      // set relative head
      head = tail;
    }
  }
};

const part1 = (rawInput) => {
  const input = parseInput(rawInput);
  let head = { x: 0, y: 0 };
  let tail = { x: 0, y: 0 };
  let positions = [_.clone(tail)];
  input.forEach((move) => makeMove(positions, head, tail, move));
  return _.uniqBy(positions, (p) => `${p.x},${p.y}`).length;
};

const part2 = (rawInput) => {
  const input = parseInput(rawInput);
  let knots = [];
  for (let i = 0; i < 10; i++) {
    knots.push({ x: 0, y: 0 });
  }
  let positions = [{ x: 0, y: 0 }];
  input.forEach((move) => makeMovePart2(positions, knots, move));
  return _.uniqBy(positions, (p) => `${p.x},${p.y}`).length;
};

let input = `R 4
U 4
L 3
D 1
R 4
D 1
L 5
R 2`;

run({
  part1: {
    tests: [
      {
        input,
        expected: 13,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input,
        expected: 1,
      },
      {
        input: `R 5
U 8
L 8
D 3
R 17
D 10
L 25
U 20`,
        expected: 36,
      },
    ],
    solution: part2,
  },
  trimTestInputs: false,
  onlyTests: false,
});
