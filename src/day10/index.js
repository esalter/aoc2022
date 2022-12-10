import run from 'aocrunner';
import _ from 'lodash';

const parseInput = (rawInput) =>
  rawInput
    .split('\n')
    .map((l) => l.split(' ').map((c, i) => (i === 1 ? parseInt(c) : c)));

const part1 = (rawInput) => {
  const input = parseInput(rawInput);
  let registerX = 1;
  let cycle = 0;
  let cycleMap = [];
  input.forEach((instruction) => {
    switch (instruction[0]) {
      case 'noop':
        // takes 1 cycle
        cycle++;
        cycleMap.push([cycle, registerX]);
        break;
      case 'addx':
        // takes 2 cycles.  the first doesn't have the increased register, the second does
        cycle++;
        cycleMap.push([cycle, registerX]);
        cycle++;
        cycleMap.push([cycle, registerX]);
        registerX += instruction[1];
        break;
    }
  });

  return cycleMap.reduce((acc, cycle) => {
    if ((cycle[0] - 20) % 40 === 0) {
      return acc + cycle[0] * cycle[1];
    }
    return acc;
  }, 0);
};

const part2 = (rawInput) => {
  const input = parseInput(rawInput);
  let registerX = 1;
  let cycle = 0;
  let cycleMap = [];
  let pixelMap = new Array(40 * 6);
  input.forEach((instruction) => {
    switch (instruction[0]) {
      case 'noop':
        // takes 1 cycle
        cycle++;
        cycleMap.push([cycle, registerX]);
        break;
      case 'addx':
        // takes 2 cycles.  the first doesn't have the increased register, the second does
        cycle++;
        cycleMap.push([cycle, registerX]);
        cycle++;
        cycleMap.push([cycle, registerX]);
        registerX += instruction[1];
        break;
    }
  });

  cycleMap.map((inst) => {
    let [cycle, register] = inst;

    let cyclePos = (cycle - 1) % 40;

    let char = '.';
    let spritePosition = [register - 1, register, register + 1];
    if (spritePosition.includes(cyclePos)) {
      char = '#';
    }
    pixelMap[cycle - 1] = char;
  });

  let rendered = _.chunk(pixelMap, 40)
    .map((c) => c.join(''))
    .join('\n');
  console.log(rendered);

  // ACTUAL SOLUTION HERE (it's visual)
  return 'REHPRLUB';
};

let input = `addx 15
addx -11
addx 6
addx -3
addx 5
addx -1
addx -8
addx 13
addx 4
noop
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx -35
addx 1
addx 24
addx -19
addx 1
addx 16
addx -11
noop
noop
addx 21
addx -15
noop
noop
addx -3
addx 9
addx 1
addx -3
addx 8
addx 1
addx 5
noop
noop
noop
noop
noop
addx -36
noop
addx 1
addx 7
noop
noop
noop
addx 2
addx 6
noop
noop
noop
noop
noop
addx 1
noop
noop
addx 7
addx 1
noop
addx -13
addx 13
addx 7
noop
addx 1
addx -33
noop
noop
noop
addx 2
noop
noop
noop
addx 8
noop
addx -1
addx 2
addx 1
noop
addx 17
addx -9
addx 1
addx 1
addx -3
addx 11
noop
noop
addx 1
noop
addx 1
noop
noop
addx -13
addx -19
addx 1
addx 3
addx 26
addx -30
addx 12
addx -1
addx 3
addx 1
noop
noop
noop
addx -9
addx 18
addx 1
addx 2
noop
noop
addx 9
noop
noop
noop
addx -1
addx 2
addx -37
addx 1
addx 3
noop
addx 15
addx -21
addx 22
addx -6
addx 1
noop
addx 2
addx 1
noop
addx -10
noop
noop
addx 20
addx 1
addx 2
addx 2
addx -6
addx -11
noop
noop
noop`;

run({
  part1: {
    tests: [
      {
        input,
        expected: 13140,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input,
        expected: `##..##..##..##..##..##..##..##..##..##..
###...###...###...###...###...###...###.
####....####....####....####....####....
#####.....#####.....#####.....#####.....
######......######......######......####
#######.......#######.......#######.....`,
      },
    ],
    solution: part2,
  },
  trimTestInputs: false,
  onlyTests: false,
});
