import run from 'aocrunner';

const getLCM = (arr) => {
  if (arr.length === 0) return;
  const gcd = (a, b) => {
    return !b ? a : gcd(b, a % b);
  };

  const lcm = (a, b) => {
    return (a * b) / gcd(a, b);
  };

  var multiple = arr[0];
  arr.forEach(function (n) {
    multiple = lcm(multiple, n);
  });

  return multiple;
};

const parseInput = (rawInput, worryLevel = 3) =>
  rawInput.split('\n\n').map((monkey) => {
    let monkeyObj = {
      totalInspected: 0,
      items: [],
      op: '',
      test: 1,
      throwTo: [],
    };
    monkey.split('\n').map((monkeyLine) => {
      let items = monkeyLine.match(/Starting items: ([\d, ]+)/);
      if (items != null) {
        monkeyObj.items = items[1].split(', ').map((i) => parseInt(i));
      }

      Math.l;

      let op = monkeyLine.match(/Operation: new = (.*)/);
      if (op != null) {
        monkeyObj.op = `(${op[1]}) / ${worryLevel} | 0`; // https://james.darpinian.com/blog/integer-math-in-javascript
      }

      let test = monkeyLine.match(/Test: divisible by (\d+)/);
      if (test != null) {
        monkeyObj.test = parseInt(test[1]);
      }

      let throwTo = monkeyLine.match(/throw to monkey (\d+)/);
      if (throwTo != null) {
        monkeyObj.throwTo.push(parseInt(throwTo[1]));
      }

      return monkeyLine;
    });

    return monkeyObj;
  });

const parseInputPart2 = (rawInput) =>
  rawInput.split('\n\n').map((monkey) => {
    let monkeyObj = {
      totalInspected: 0,
      items: [],
      op: '',
      test: 1,
      throwTo: [],
    };
    monkey.split('\n').map((monkeyLine) => {
      let items = monkeyLine.match(/Starting items: ([\d, ]+)/);
      if (items != null) {
        monkeyObj.items = items[1].split(', ').map((i) => parseInt(i));
      }

      let op = monkeyLine.match(/Operation: new = (.*)/);
      if (op != null) {
        monkeyObj.op = op[1]; // https://james.darpinian.com/blog/integer-math-in-javascript
      }

      let test = monkeyLine.match(/Test: divisible by (\d+)/);
      if (test != null) {
        monkeyObj.test = parseInt(test[1]);
      }

      let throwTo = monkeyLine.match(/throw to monkey (\d+)/);
      if (throwTo != null) {
        monkeyObj.throwTo.push(parseInt(throwTo[1]));
      }

      return monkeyLine;
    });

    return monkeyObj;
  });

const doMonkeyRound = (monkeys, monkey, lcm = -1) => {
  // first, increment num items inspected since the monkey will complete his turn
  monkey.totalInspected += monkey.items.length;
  while (monkey.items.length > 0) {
    let item = monkey.items.shift();
    let newVal = eval(monkey.op.replace(/old/g, item));
    if (lcm !== -1) {
      newVal = newVal % lcm;
    }
    let throwToMonkey =
      newVal % monkey.test === 0 ? monkey.throwTo[0] : monkey.throwTo[1];
    monkeys[throwToMonkey].items.push(newVal);
  }
};

const part1 = (rawInput) => {
  const monkeys = parseInput(rawInput);

  for (let i = 0; i < 20; i++) {
    monkeys.forEach((monkey) => doMonkeyRound(monkeys, monkey));
  }

  return monkeys
    .sort((a, b) => b.totalInspected - a.totalInspected)
    .slice(0, 2)
    .reduce((acc, cur) => acc * cur.totalInspected, 1);
};

const part2 = (rawInput) => {
  const monkeys = parseInputPart2(rawInput);

  let tests = monkeys.map((m) => m.test);
  let lcm = getLCM(tests);

  for (let i = 0; i < 10000; i++) {
    monkeys.forEach((monkey) => doMonkeyRound(monkeys, monkey, lcm));
  }

  return monkeys
    .sort((a, b) => b.totalInspected - a.totalInspected)
    .slice(0, 2)
    .reduce((acc, cur) => acc * cur.totalInspected, 1);
};

let input = `Monkey 0:
Starting items: 79, 98
Operation: new = old * 19
Test: divisible by 23
  If true: throw to monkey 2
  If false: throw to monkey 3

Monkey 1:
Starting items: 54, 65, 75, 74
Operation: new = old + 6
Test: divisible by 19
  If true: throw to monkey 2
  If false: throw to monkey 0

Monkey 2:
Starting items: 79, 60, 97
Operation: new = old * old
Test: divisible by 13
  If true: throw to monkey 1
  If false: throw to monkey 3

Monkey 3:
Starting items: 74
Operation: new = old + 3
Test: divisible by 17
  If true: throw to monkey 0
  If false: throw to monkey 1`;

run({
  part1: {
    tests: [
      {
        input,
        expected: 10605,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input,
        expected: 2713310158,
      },
    ],
    solution: part2,
  },
  trimTestInputs: false,
  onlyTests: false,
});
