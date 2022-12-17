import run from 'aocrunner';
import {
  toPoint,
  translate,
  makeGrid,
  addGridItem,
  drawGrid,
  drawLine,
  addObjGridItem,
} from '../utils/index.js';
import _ from 'lodash';

const parseInput = (rawInput) => {
  return rawInput.split('\n').reduce((acc, cur) => {
    let groups = cur.match(
      /Sensor at x=([-\d]+), y=([-\d]+): closest beacon is at x=([-\d]+), y=([-\d]+)/,
    );
    let sensor = [parseInt(groups[1]), parseInt(groups[2])];
    let beacon = [parseInt(groups[3]), parseInt(groups[4])];
    let distance =
      Math.abs(sensor[0] - beacon[0]) + Math.abs(sensor[1] - beacon[1]);
    // console.log(groups);
    acc.push({
      sensor,
      beacon,
      distance,
    });
    return acc;
  }, []);
};

const part1 = (rawInput) => {
  const input = parseInput(rawInput);

  // stupid hack to diff between real and test input
  let targetRow = input[0].distance === 7 ? 10 : 2000000;
  let ranges = sortRanges(getIntervalsForRow(input, targetRow));

  let sum = sumRangeCounts(ranges);
  const target_beacons = _.uniqBy(
    input.filter((g) => g.beacon[1] == targetRow),
    (g) => `${g.beacon[0]},${g.beacon[1]}`,
  );
  return sum - target_beacons.length;
};

function sortRanges(ranges) {
  return ranges.sort((r1, r2) => {
    if (r1[0] == r2[0]) return 0;
    return r1[0] < r2[0] ? -1 : 1;
  });
}

function sumRangeCounts(ranges) {
  if (ranges.length == 0) {
    console.log(
      'No ranges to count. Are you using the correct row value for the input?',
    );
    return 0;
  }

  let count = 0;
  let [start, end] = ranges[0];

  for (let i = 1; i < ranges.length; i++) {
    const [range_start, range_end] = ranges[i];
    if (range_start > end) {
      count += end - start + 1;
      start = range_start;
      end = range_end;
    } else if (range_end > end) {
      end = range_end;
    }
  }

  count += end - start + 1;
  return count;
}

const getIntervalsForRow = (groups, row) => {
  // returns a list of (possibly overlapping) ranges on the target row.
  return groups
    .filter((group) => {
      // only worry about sensors that are even close to the target row
      // [parseInt(groups[1]), parseInt(groups[2])];
      let { sensor, distance } = group;
      // console.log(group);
      let diff = Math.abs(row - sensor[1]) < distance;
      // console.log('diff is ', Math.abs(row - sensor[1]), distance, diff);
      return diff;
    })
    .map((group) => {
      let { sensor, distance } = group;
      // how far away is the sensor precisely from the target row
      let dy = Math.abs(row - sensor[1]);
      // console.log('grouping group', group);
      return [sensor[0] - (distance - dy), sensor[0] + (distance - dy)];
    });
};

const part2 = (rawInput) => {
  const input = parseInput(rawInput);
  let maxRow = input[0].distance === 7 ? 20 : 4000000;
  for (let row = 0; row <= maxRow; row++) {
    let ranges = sortRanges(getIntervalsForRow(input, row));
    let col = findUncoveredColumn(ranges);
    if (col != null) {
      return col * 4000000 + row;
    }
  }
};

// Find the first column that isn't covered in the ranges.
// Ranges must be sorted by their start points.
function findUncoveredColumn(ranges, max_row) {
  let [_, end] = ranges[0];
  for (let i = 1; i < ranges.length; i++) {
    const [range_start, range_end] = ranges[i];
    if (range_start > end) {
      return range_start - 1;
    } else if (range_end > end) {
      end = range_end;
    }
    if (end > max_row) return null;
  }
  return null;
}

let input = `Sensor at x=2, y=18: closest beacon is at x=-2, y=15
Sensor at x=9, y=16: closest beacon is at x=10, y=16
Sensor at x=13, y=2: closest beacon is at x=15, y=3
Sensor at x=12, y=14: closest beacon is at x=10, y=16
Sensor at x=10, y=20: closest beacon is at x=10, y=16
Sensor at x=14, y=17: closest beacon is at x=10, y=16
Sensor at x=8, y=7: closest beacon is at x=2, y=10
Sensor at x=2, y=0: closest beacon is at x=2, y=10
Sensor at x=0, y=11: closest beacon is at x=2, y=10
Sensor at x=20, y=14: closest beacon is at x=25, y=17
Sensor at x=17, y=20: closest beacon is at x=21, y=22
Sensor at x=16, y=7: closest beacon is at x=15, y=3
Sensor at x=14, y=3: closest beacon is at x=15, y=3
Sensor at x=20, y=1: closest beacon is at x=15, y=3`;

run({
  part1: {
    tests: [
      {
        input,
        expected: 26,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input,
        expected: 56000011,
      },
    ],
    solution: part2,
  },
  trimTestInputs: false,
  onlyTests: false,
});
