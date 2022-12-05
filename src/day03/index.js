import run from 'aocrunner';
import _ from 'lodash';
const { lowerCase, upperCase } = _;

const parseInput = (rawInput) => rawInput.split('\n');

const charCode = (str) => {
  return str.charCodeAt(0);
};

const isUpperCase = (char) => {
  return charCode(char) == charCode(upperCase(char));
};

const getPriority = (str) => {
  let temp = lowerCase(str);

  // char code a has ascii code 97, so normalize that so a == 1
  let priority = charCode(temp) - 96;
  if (isUpperCase(str)) {
    // the upper case chars are shifted exactly 26 from their lowercase counterparts.
    priority += 26;
  }

  return priority;
};

const part1 = (rawInput) => {
  const input = parseInput(rawInput);

  // console.log('input', input);

  let sumPriorities = 0;
  let groups = [];
  let i = 0;
  let group = [];
  input.forEach((line) => {
    if (line == '') return;
    let length = line.length;
    let numPerCompartment = length / 2;
    let compartment1 = line.substring(0, numPerCompartment);
    let compartment2 = line.substring(numPerCompartment);

    let compartment1Items = compartment1.split('');
    let compartment2Items = compartment2.split('');

    let itemType = _.intersection(compartment1Items, compartment2Items)[0];
    let priority = getPriority(itemType);
    sumPriorities += priority;

    group.push({
      rucksack: line,
      compartment1: compartment1Items,
      compartment2: compartment2Items,
      items: line.split(''),
      itemType,
      priority,
    });

    i++;

    if (i == 3) {
      groups.push(group);
      i = 0;
      group = [];
    }
  });

  return sumPriorities;
};

const part2 = (rawInput) => {
  const input = parseInput(rawInput);
  let sumPriorities = 0;
  let groups = [];
  let i = 0;
  let group = [];
  input.forEach((line) => {
    if (line == '') return;
    let length = line.length;
    let numPerCompartment = length / 2;
    let compartment1 = line.substring(0, numPerCompartment);
    let compartment2 = line.substring(numPerCompartment);

    let compartment1Items = compartment1.split('');
    let compartment2Items = compartment2.split('');

    let itemType = _.intersection(compartment1Items, compartment2Items)[0];
    let priority = getPriority(itemType);
    sumPriorities += priority;

    group.push({
      rucksack: line,
      compartment1: compartment1Items,
      compartment2: compartment2Items,
      items: line.split(''),
      itemType,
      priority,
    });

    i++;

    if (i == 3) {
      groups.push(group);
      i = 0;
      group = [];
    }
  });

  // part 2: get the sum of priorities of each group's common type
  let sumGroupPriorities = groups.reduce((sum, group) => {
    let groupItems = group.map((elf) => elf.items);
    let badge = _.intersection(...groupItems)[0];
    let groupPriority = getPriority(badge);
    return sum + groupPriority;
  }, 0);

  return sumGroupPriorities;
};

run({
  part1: {
    tests: [
      {
        input: `vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw`,
        expected: 157,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw`,
        expected: 70,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
