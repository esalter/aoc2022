import run from 'aocrunner';
import _ from 'lodash';

let whatBeatsWhat = {
  Rock: 'Scissors',
  Scissors: 'Paper',
  Paper: 'Rock',
};

let encryption = {
  A: 'Rock',
  X: 'Rock',
  B: 'Paper',
  Y: 'Paper',
  C: 'Scissors',
  Z: 'Scissors',
};

let encryptionPart2 = {
  A: 'Rock',
  X: 'lose',
  B: 'Paper',
  Y: 'draw',
  C: 'Scissors',
  Z: 'win',
};

let scores = {
  Rock: 1,
  Paper: 2,
  Scissors: 3,
  win: 6,
  draw: 3,
  lose: 0,
};

const calculatePart1 = (encryptedHero, encryptedVillain) => {
  let villain = encryption[encryptedVillain];
  let hero = encryption[encryptedHero];
  // console.log('actual picks are (hero/villain):', hero, villain);
  let score = 0;
  score += scores[hero]; // add in the value of our pick regardless of who won
  let outcome = 'draw';
  if (hero != villain) {
    // we picked something different, determine who won
    if (whatBeatsWhat[hero] == villain) {
      outcome = 'win';
    } else {
      outcome = 'lose';
    }
  }

  // console.log('outcome (for us): ', outcome);

  // add in outcome score
  score += scores[outcome];
  return score;
};

const calculatePart2 = (encryptedOutcome, encryptedVillain) => {
  let villain = encryptionPart2[encryptedVillain];
  let outcome = encryptionPart2[encryptedOutcome];
  let score = 0;
  let pick = '';
  switch (outcome) {
    case 'draw':
      pick = villain;
      break;
    case 'lose':
      pick = whatBeatsWhat[villain];
      break;
    default:
      pick = whatBeatsWhat[whatBeatsWhat[villain]];
      break;
  }

  score += scores[pick]; // add in the value of our pick

  // add in outcome score
  score += scores[outcome];
  return score;
};

const parseInput = (rawInput) => rawInput.split('\n').map((v) => v.split(' '));

const part1 = (rawInput) => {
  const input = parseInput(rawInput);

  return _.sum(input.map((a) => calculatePart1(a[1], a[0])));
};

const part2 = (rawInput) => {
  const input = parseInput(rawInput);

  return _.sum(input.map((a) => calculatePart2(a[1], a[0])));
};

run({
  part1: {
    tests: [
      {
        input: `A Y
B X
C Z`,
        expected: 15,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `A Y
B X
C Z`,
        expected: 12,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
