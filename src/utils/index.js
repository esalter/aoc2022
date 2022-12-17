/**
 * Root for your util libraries.
 *
 * You can import them in the src/template/index.js,
 * or in the specific file.
 *
 * Note that this repo uses ES Modules, so you have to explicitly specify
 * .js extension (yes, .js not .ts - even for TypeScript files)
 * for imports that are not imported from node_modules.
 *
 * For example:
 *
 *   correct:
 *
 *     import _ fro 'lodash
 *     import myLib from '../utils/myLib.js'
 *     import { myUtil } from '../utils/index.js'
 *
 *   incorrect:
 *
 *     import _ fro 'lodash
 *     import myLib from '../utils/myLib'
 *     import { myUtil } from '../utils'
 */
import _ from 'lodash';

export function drawLine(grid, start, end, options = {}) {
  // console.log('drawing from ', start, end, options);
  options = _.assign(
    { drawChar: '#', fillWith: '.', overwrite: false },
    options,
  );
  // console.log('final options', options);
  let { drawChar, fillWith, overwrite } = options;
  let drawCharFunc = (cur) => {
    if (overwrite) {
      return drawChar;
    }
    // console.log('current value is', cur);
    // console.log('compare that with', fillWith, drawChar);
    return cur != fillWith ? cur : drawChar;
  };
  if (start[0] === end[0]) {
    if (start[1] > end[1]) {
      // try again reversing arg order
      return drawLine(grid, end, start, options);
    }

    // same row -> build the range of y numbers
    // they're in order already
    for (let i = start[1]; i <= end[1]; i++) {
      addGridItem(grid, start[0], i, drawCharFunc, fillWith);
    }
  } else {
    if (start[0] > end[0]) {
      // try again reversing arg order
      return drawLine(grid, end, start, options);
    }

    // same column -> build the range of x numbers
    for (let i = start[0]; i <= end[0]; i++) {
      addGridItem(grid, i, start[1], drawCharFunc, fillWith);
    }
  }
}

export function drawGrid(thing, rows = undefined, flip = false) {
  let length = thing.length;
  if (rows == null) {
    rows = length;
  }
  let sliced = thing.slice(length - rows);
  if (flip) {
    sliced = _.zip(...sliced);
  }
  console.log(sliced.map((r) => r.join('')));
}

export function toPoint(i, j) {
  if (Array.isArray(i)) {
    [i, j] = i;
  }
  return `${i},${j}`;
}

export function translate(point, xy) {
  return [point[0] + xy[0], point[1] + xy[1]];
}

export function makeGrid(rows, columns, fillWith = undefined) {
  // fill grid with 0's
  let grid = new Array(rows);
  for (let i = 0; i < rows; i++) {
    grid[i] = new Array(columns);
    for (let j = 0; j < columns; j++) {
      grid[i][j] = fillWith;
    }
  }

  return grid;
}

export function addGridItem(grid, i, j, item, fillWith = undefined) {
  if (grid == null) {
    grid = makeGrid(i + 1, j + 1, fillWith);
  }
  // these are 0-based, so must be at least 1 + that number
  extendGrid(grid, { rows: i + 1, columns: j + 1 }, fillWith);

  if (typeof item === 'function') {
    // console.log('about to call func', i, j);
    grid[i][j] = item(grid[i][j]);
  } else {
    grid[i][j] = item;
  }

  return grid;
}

export function addObjGridItem(grid, i, j, item, fillWith = undefined) {
  if (grid == null) {
    grid = {};
  }

  if (grid[i] === undefined) {
    grid[i] = {};
  }

  if (typeof item === 'function') {
    grid[i][j] = item(grid[i][j]);
  } else {
    grid[i][j] = item;
  }

  return grid;
}

export function incrementGridItem(grid, i, j, incr = 1, fillWith = 0) {
  // these are 0-based, so must be at least 1 + that number
  if (i < 0 || j < 0) {
    throw new Error(`i (${i}) or j (${j}) are out of range`);
  }
  // console.log('new grid size', i, j);
  extendGrid(grid, { rows: i + 1, columns: j + 1 }, fillWith);

  grid[i][j] += incr;

  return grid;
}

// takes a callback function with method signature (acc, currentItem, row, column, grid)
// visits every grid item and calls the callback for each item and updates acc
// return value acc
export function reduceGrid(grid, func, acc = 0) {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      acc = func(acc, grid[i][j], i, j, grid);
    }
  }

  return acc;
}

export function extendGrid(grid, options = {}, fillWith = undefined) {
  let { rows, columns } = options;
  if (rows) {
    if (grid.length < rows) {
      // need to add more rows
      let toAdd = rows - grid.length;
      for (let i = 0; i < toAdd; i++) {
        let length = 0;
        if (grid[0]) {
          length = grid[0].length;
        }
        let arr = new Array(length);
        for (let j = 0; j < arr.length; j++) {
          arr[j] = fillWith;
        }
        grid.push(arr);
      }
    }
  }
  if (columns) {
    if (grid[0].length < columns) {
      // need to add more columns
      let toAdd = columns - grid[0].length;
      for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < toAdd; j++) {
          grid[i].push(fillWith);
        }
      }
    }
  }

  return grid;
}
