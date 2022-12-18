import run from 'aocrunner';

const timeBudget = 30;
const openCost = 1;
const travelCost = 1;

const bfs = (grid, starting, ending) => {
  let queue = [];
  let visited = [starting];

  if (starting == ending) return [starting];
  queue.push([starting]);

  while (queue.length > 0) {
    let path = queue.shift();
    let node = path[path.length - 1];

    for (let neighbor of grid[node]) {
      if (visited.includes(neighbor)) continue;

      if (neighbor == ending) return path.concat([neighbor]);
      visited.push(neighbor);
      queue.push(path.concat([neighbor]));
    }
  }

  return [];
};

const parseInput = (rawInput) =>
  rawInput.split('\n').reduce(
    (acc, l) => {
      // console.log('got line', l);
      let groups = l.match(
        /Valve ([A-Za-z]+) has flow rate=(\d+); tunnels? leads? to valves? ([A-Za-z ,]+)/,
      );

      acc.rates[groups[1]] = parseInt(groups[2]);
      acc.graph[groups[1]] = groups[3].split(', ');
      return acc;
    },
    { rates: {}, graph: {} },
  );

const findRates = (distances, valve, minutes, left, opened = {}) => {
  let allRates = [opened];

  left.forEach((other, index) => {
    let newMinutes = minutes - distances[valve][other] - 1;
    if (newMinutes < 1) return;

    let newOpened = JSON.parse(JSON.stringify(opened));
    newOpened[other] = newMinutes;

    let newLeft = [...left];
    newLeft.splice(index, 1);

    allRates.push(
      ...findRates(distances, other, newMinutes, newLeft, newOpened),
    );
  });

  return allRates;
};

const part1 = (rawInput) => {
  const input = parseInput(rawInput);
  // console.log('input', input);

  let distances = {};
  Object.keys(input.graph).forEach((start) => {
    Object.keys(input.graph).forEach((end) => {
      if (distances[start] == null) distances[start] = {};
      distances[start][end] = bfs(input.graph, start, end).length - 1;
    });
  });
  let nonzeroValves = Object.keys(input.graph).filter(
    (valve) => input.rates[valve] != 0,
  );

  return findRates(distances, 'AA', 30, nonzeroValves)
    .map((path) =>
      Object.entries(path).reduce(
        (acc, [key, value]) => acc + input.rates[key] * value,
        0,
      ),
    )
    .sort((a, b) => b - a)[0];
};

const part2 = (rawInput) => {
  const input = parseInput(rawInput);
  // console.log('input', input);

  let distances = {};
  Object.keys(input.graph).forEach((start) => {
    Object.keys(input.graph).forEach((end) => {
      if (distances[start] == null) distances[start] = {};
      distances[start][end] = bfs(input.graph, start, end).length - 1;
    });
  });
  let nonzeroValves = Object.keys(input.graph).filter(
    (valve) => input.rates[valve] != 0,
  );
  let allRates = findRates(distances, 'AA', 26, nonzeroValves);

  let maxScores = {};
  allRates.forEach((rate) => {
    let key = Object.keys(rate).sort().join(',');
    let score = Object.entries(rate).reduce(
      (acc, [key, value]) => acc + input.rates[key] * value,
      0,
    );

    if (maxScores[key] == null) maxScores[key] = -Infinity;
    maxScores[key] = Math.max(score, maxScores[key]);
  });

  let highest = -Infinity;
  Object.keys(maxScores).forEach((player) => {
    Object.keys(maxScores).forEach((elephant) => {
      let allValves = new Set();
      let playerList = player.split(',');
      playerList.forEach((valve) => allValves.add(valve));
      let elephantList = elephant.split(',');
      elephantList.forEach((valve) => allValves.add(valve));

      if (allValves.size == playerList.length + elephantList.length)
        highest = Math.max(maxScores[player] + maxScores[elephant], highest);
    });
  });

  return highest;
};

let input = `Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
Valve BB has flow rate=13; tunnels lead to valves CC, AA
Valve CC has flow rate=2; tunnels lead to valves DD, BB
Valve DD has flow rate=20; tunnels lead to valves CC, AA, EE
Valve EE has flow rate=3; tunnels lead to valves FF, DD
Valve FF has flow rate=0; tunnels lead to valves EE, GG
Valve GG has flow rate=0; tunnels lead to valves FF, HH
Valve HH has flow rate=22; tunnel leads to valve GG
Valve II has flow rate=0; tunnels lead to valves AA, JJ
Valve JJ has flow rate=21; tunnel leads to valve II`;

run({
  part1: {
    tests: [
      {
        input,
        expected: 1651,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input,
        expected: 1707,
      },
    ],
    solution: part2,
  },
  trimTestInputs: false,
  onlyTests: false,
});
