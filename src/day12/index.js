import run from 'aocrunner';
import _ from 'lodash';
import util from 'util';

function Graph() {
  var neighbors = (this.neighbors = {}); // Key = vertex, value = array of neighbors.

  this.addEdge = function (u, v) {
    if (neighbors[u] === undefined) {
      neighbors[u] = [];
    }
    neighbors[u].push(v);
  };

  return this;
}

function shortestPath(graph, source, target) {
  if (source === target) {
    // Delete these four lines if
    console.log(source); // you want to look for a cycle
    return; // when the source is equal to
  } // the target.
  var queue = [source],
    visited = { [source]: true },
    predecessor = {},
    tail = 0;
  while (tail < queue.length) {
    var u = queue[tail++], // Pop a vertex off the queue.
      neighbors = graph.neighbors[u];
    for (var i = 0; i < neighbors.length; ++i) {
      var v = neighbors[i];
      if (visited[v]) {
        continue;
      }
      visited[v] = true;
      if (v === target) {
        // Check if the path is complete.
        var path = [v]; // If so, backtrack through the path.
        while (u !== source) {
          path.push(u);
          u = predecessor[u];
        }
        path.push(u);
        path.reverse();
        return path;
      }
      predecessor[v] = u;
      queue.push(v);
    }
  }

  return null;
}

function shortestPathAny(graph, source, targets) {
  if (targets.includes(source)) {
    // Delete these four lines if
    console.log(source); // you want to look for a cycle
    return; // when the source is equal to
  } // the target.
  var queue = [source],
    visited = { [source]: true },
    predecessor = {},
    tail = 0;
  while (tail < queue.length) {
    var u = queue[tail++], // Pop a vertex off the queue.
      neighbors = graph.neighbors[u];
    for (var i = 0; i < neighbors.length; ++i) {
      var v = neighbors[i];
      if (visited[v]) {
        continue;
      }
      visited[v] = true;
      if (targets.includes(v)) {
        // Check if the path is complete.
        var path = [v]; // If so, backtrack through the path.
        while (u !== source) {
          path.push(u);
          u = predecessor[u];
        }
        path.push(u);
        path.reverse();
        return path;
      }
      predecessor[v] = u;
      queue.push(v);
    }
  }

  return null;
}

const toPoint = (i, j) => `${i},${j}`;

const parseInput = (rawInput) => {
  let toRet = {
    start: null,
    end: null,
    nodes: null,
    aPositions: [],
  };

  let nodes = rawInput.split('\n').map((l, i) =>
    l.split('').map((c, j) => {
      if (c === 'S') {
        c = 'a';
        toRet.start = toPoint(i, j);
      } else if (c === 'E') {
        c = 'z';
        toRet.end = toPoint(i, j);
      }

      if (c === 'a') {
        toRet.aPositions.push(toPoint(i, j));
      }

      return parseInt(c, 36) - 10;
    }),
  );

  toRet.nodes = nodes;

  return toRet;
};

const buildGraph = (nodes) => {
  let graph = new Graph();
  for (let i = 0; i < nodes.length; i++) {
    for (let j = 0; j < nodes[i].length; j++) {
      let c1 = nodes[i][j];
      let c2 = null;
      let c3 = null;
      // check right and down.
      if (j < nodes[i].length - 1) {
        c2 = nodes[i][j + 1];
      }
      if (i < nodes.length - 1) {
        c3 = nodes[i + 1][j];
      }

      // if c1 is at most 1 away from c2 or c3, add them as edges
      if (c2 != null) {
        if (c2 - c1 <= 1) {
          graph.addEdge(toPoint(i, j), toPoint(i, j + 1));
        }
        if (c1 - c2 <= 1) {
          graph.addEdge(toPoint(i, j + 1), toPoint(i, j));
        }
      }

      if (c3 != null) {
        if (c3 - c1 <= 1) {
          graph.addEdge(toPoint(i, j), toPoint(i + 1, j));
        }
        if (c1 - c3 <= 1) {
          graph.addEdge(toPoint(i + 1, j), toPoint(i, j));
        }
      }
    }
  }

  return graph;
};

const buildReverseGraph = (nodes) => {
  let graph = new Graph();
  for (let i = 0; i < nodes.length; i++) {
    for (let j = 0; j < nodes[i].length; j++) {
      let c1 = nodes[i][j];
      let c2 = null;
      let c3 = null;
      // check right and down.
      if (j < nodes[i].length - 1) {
        c2 = nodes[i][j + 1];
      }
      if (i < nodes.length - 1) {
        c3 = nodes[i + 1][j];
      }

      // if c1 is at most 1 away from c2 or c3, add them as edges
      if (c2 != null) {
        if (c1 - c2 <= 1) {
          graph.addEdge(toPoint(i, j), toPoint(i, j + 1));
        }
        if (c2 - c1 <= 1) {
          graph.addEdge(toPoint(i, j + 1), toPoint(i, j));
        }
      }

      if (c3 != null) {
        if (c1 - c3 <= 1) {
          graph.addEdge(toPoint(i, j), toPoint(i + 1, j));
        }
        if (c3 - c1 <= 1) {
          graph.addEdge(toPoint(i + 1, j), toPoint(i, j));
        }
      }
    }
  }

  return graph;
};

const part1 = (rawInput) => {
  const input = parseInput(rawInput);
  let { nodes, start, end } = input;
  let graph = buildGraph(nodes);

  let path = shortestPath(graph, start, end);

  return path.length - 1;
};

const part2 = (rawInput) => {
  const input = parseInput(rawInput);
  let { nodes, end, aPositions } = input;
  let graph = buildReverseGraph(nodes);

  let paths = shortestPathAny(graph, end, aPositions);
  return paths.length - 1;
};

let input = `Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi`;

run({
  part1: {
    tests: [
      {
        input,
        expected: 31,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input,
        expected: 29,
      },
    ],
    solution: part2,
  },
  trimTestInputs: false,
  onlyTests: false,
});
