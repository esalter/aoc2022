import run from 'aocrunner';
import _ from 'lodash';
import { json } from 'stream/consumers';
import util from 'util';

const parseInput = (rawInput) =>
  rawInput.split('\n\n').map((pair) => pair.split('\n').map((p) => eval(p)));
const parseInput2 = (rawInput) => rawInput.split(/\n+/).map((p) => eval(p));

const compareVals = (left, right) => {
  // console.log('called compareVals with', left, '###', right);
  let nums = left.length < right.length ? left.length : right.length;
  // console.log('num iters', nums);
  for (let i = 0; i < nums; i++) {
    // console.log('i', i);
    let lVal = left[i];
    let rVal = right[i];

    let lType = typeof lVal; // number, or object
    let rType = typeof rVal;

    // console.log('lVal vs rVal', lVal, '###', rVal);

    // console.log('typeof', lType, rType);

    if (lType !== rType) {
      // one of these things is not like the other.  convert the number to a [num], then try again
      // console.log('lVal or rVal needs conversion', lVal, rVal);
      if (lType === 'number') {
        lVal = [lVal];
        lType = 'object';
      } else {
        rVal = [rVal];
        rType = 'object';
      }
      // now continue onward
    }

    if (lType === 'number') {
      // both are ints
      if (lVal !== rVal) {
        // console.log(
        //   'lVal and rVal are different, returning',
        //   `${lVal} < ${rVal}`,
        //   lVal < rVal,
        // );
        return lVal < rVal;
      } else {
        // console.log('***lVal == rVal, continuing to compare');
        // equal; keep comparing
      }
    } else {
      // both are lists
      let listVal = compareVals(lVal, rVal);
      // if it was -1 we need to keep searching, otherwise return whatever the value was
      if (listVal !== -1) {
        // console.log('returning listVal', lVal, '###', rVal, listVal);
        return listVal;
      }

      // console.log('***list comparison was inconclusive, we continue');
    }
  }

  // console.log(
  //   'reached the end of comparing left vs right',
  //   left,
  //   right,
  //   '(',
  //   left.length,
  //   right.length,
  //   ')',
  // );
  // console.log('returning ', left.length <= right.length);

  // if list length is the same, return -1
  if (left.length === right.length) return -1;

  // if left side ran out first, return true, if right, then false,
  return left.length < right.length;
};

const part1 = (rawInput) => {
  const input = parseInput(rawInput);
  let response = input.map((pair, i) => {
    let [left, right] = pair;
    let result = compareVals(left, right);
    // console.log('final result: ', left, '###', right, result);
    return {
      i: i + 1,
      result,
      left: left,
      right: right,
    };
  });
  // console.log(JSON.stringify(response, null, 4));

  return response.reduce((acc, cur) => {
    return acc + (cur.result ? cur.i : 0);
  }, 0);
};

const part2 = (rawInput) => {
  const input = parseInput2(rawInput);
  input.push([[2]], [[6]]);
  let sorted = input.sort((l, r) => (compareVals(l, r) ? -1 : 1));

  return sorted.reduce(
    (acc, cur, i) =>
      acc * (['[[2]]', '[[6]]'].includes(JSON.stringify(cur)) ? i + 1 : 1),
    1,
  );
};

let input = `[1,1,3,1,1]
[1,1,5,1,1]

[[1],[2,3,4]]
[[1],4]

[9]
[[8,7,6]]

[[4,4],4,4]
[[4,4],4,4,4]

[7,7,7,7]
[7,7,7]

[]
[3]

[[[]]]
[[]]

[1,[2,[3,[4,[5,6,7]]]],8,9]
[1,[2,[3,[4,[5,6,0]]]],8,9]`;

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
        expected: 140,
      },
    ],
    solution: part2,
  },
  trimTestInputs: false,
  onlyTests: false,
});
