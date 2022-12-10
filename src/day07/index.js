import run from 'aocrunner';
import _ from 'lodash';
import util from 'util';

const parseInput = (rawInput) => _.compact(rawInput.split('\n').map(parseLine));

const parseLine = (line) => {
  // ignore ls
  if (line == '$ ls') return null;
  let command = line.match(/\$ cd (.+)/);
  if (command != null) {
    return {
      type: 'cd',
      cd: command[1],
    };
  }

  // must be a file or dir
  let dir = line.match(/dir (.+)/);
  if (dir != null) {
    return {
      type: 'dir',
      dir: dir[1],
    };
  }

  let file = line.match(/(\d+) (.+)/);
  return {
    type: 'file',
    file: file[2],
    size: parseInt(file[1]),
  };
};

const ensureTreeDir = (tree, dirs) => {
  if (!_.get(tree, dirs)) {
    _.set(tree, dirs, { _files: [] });
  }
};

const buildTree = (tree, line) => {
  let cwd = tree.cwd;
  switch (line.type) {
    case 'cd':
      let dir = line.cd;
      switch (dir) {
        case '..':
          // need to go up 1 directory from cwd
          cwd.pop();
          break;
        case '/':
          // switch to root
          ensureTreeDir(tree, ['/']);
          cwd = ['/'];
          break;
        default:
          cwd.push(dir);
          break;
        // need to descend one directory into the named one.
      }
      tree.cwd = cwd;

      break;
    case 'dir':
      // we got a dir, add it to the tree IF it doesn't already exist
      ensureTreeDir(tree, _.concat(tree.cwd, [line.dir]));
      break;
    case 'file':
      let existingFiles = _.get(tree, _.concat(cwd, ['_files']));
      existingFiles.push(line);
      break;
  }

  return tree;
};

const calculateSums = (tree, cwd) => {
  let root = _.get(tree, cwd);
  return Object.keys(root).map((k) => {
    let v = root[k];
    let size = 0;
    if (k === '_files') {
      size = _.sum(v.map((f) => f.size));
    } else {
      size = _.sum(calculateSums(tree, _.concat(cwd, [k])));
    }
    if (!root['_size']) {
      root['_size'] = 0;
    }
    root['_size'] += size;
    return size;
  });
};

const walk = (tree, cwd, sum) => {
  let root = _.get(tree, cwd);
  return Object.keys(root).map((k) => {
    let v = root[k];
    if (k === '_files') return;
    if (k === '_size') {
      if (v < 100000) {
        return sum.push(v);
      }
    } else return walk(tree, _.concat(cwd, [k]), sum);
  });
};

const walkPart2 = (tree, cwd, sum, threshold) => {
  let root = _.get(tree, cwd);
  return Object.keys(root).map((k) => {
    let v = root[k];
    if (k === '_files') return;
    if (k === '_size' && v > threshold) {
      return sum.push(v);
    } else return walkPart2(tree, _.concat(cwd, [k]), sum, threshold);
  });
};

const part1 = (rawInput) => {
  const input = parseInput(rawInput);
  let tree = input.reduce(buildTree, { cwd: [] });
  calculateSums(tree, ['/'], 0);
  let sum = [];
  walk(tree, ['/'], sum);

  return _.sum(sum);
};

const part2 = (rawInput) => {
  const input = parseInput(rawInput);
  let tree = input.reduce(buildTree, { cwd: [] });
  calculateSums(tree, ['/'], 0);
  let used = tree['/']['_size'];
  let unused = 70000000 - used;
  let needToFree = 30000000 - unused;

  let sum = [];
  walkPart2(tree, ['/'], sum, needToFree);
  return _.min(sum);
};

let input = `$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k`;

run({
  part1: {
    tests: [
      {
        input,
        expected: 95437,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input,
        expected: 24933642,
      },
    ],
    solution: part2,
  },
  trimTestInputs: false,
  onlyTests: false,
});
