webpackJsonp([0],{

/***/ 1406:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MazeScene = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

__webpack_require__(79);

var _recursiveBacktracker = __webpack_require__(1407);

var _gridView = __webpack_require__(1408);

var _grid = __webpack_require__(1409);

var _randomizedKruskal = __webpack_require__(1412);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MazeScene = exports.MazeScene = function (_Phaser$Scene) {
  _inherits(MazeScene, _Phaser$Scene);

  function MazeScene() {
    _classCallCheck(this, MazeScene);

    return _possibleConstructorReturn(this, (MazeScene.__proto__ || Object.getPrototypeOf(MazeScene)).apply(this, arguments));
  }

  _createClass(MazeScene, [{
    key: 'create',
    value: function create() {
      var _this2 = this;

      this.cameras.main.setBackgroundColor(0xcacaca);

      this.scheduler = new Phaser.Time.Clock(this);
      this.scheduler.start();

      this.destroyedWallCount = 0;

      var rows = 5;
      var cols = 8;

      var grid = new _grid.Grid(rows, cols);
      this.gridView = new _gridView.GridView(this, grid, 250, 250);

      this.generators = [{
        name: 'Recursive Backtracer',
        generator: new _recursiveBacktracker.RecursiveBacktracker(this, grid, this.gridView)
      }, {
        name: 'Randomized Kruskal',
        generator: new _randomizedKruskal.RandomizedKruskal(this, grid, this.gridView)
      }];
      this.activeGeneratorIndex = 0;

      this.add.text(25, 450, 'switch algo').setInteractive().on('pointerdown', function () {
        _this2.activeGeneratorIndex = Phaser.Math.Wrap(_this2.activeGeneratorIndex + 1, 0, _this2.generators.length);

        _this2._updateActiveGeneratorName();
      });
      this.currentAlgoText = this.add.text(25, 470, '');

      this.add.text(175, 450, 'generate').setInteractive().on('pointerdown', function () {
        _this2._reset();

        _this2._getActiveGenerator().generator.generate();
      });

      this.add.text(300, 450, 'reset').setInteractive().on('pointerdown', function () {
        _this2._reset();
      });

      this.add.text(380, 450, 'randomize').setInteractive().on('pointerdown', function () {
        var rows = Phaser.Math.RND.between(2, 10);
        var cols = Phaser.Math.RND.between(2, 10);
        grid.setSize(rows, cols);
        _this2.gridView.refresh();
      });

      this._updateActiveGeneratorName();
    }
  }, {
    key: '_reset',
    value: function _reset() {
      this.destroyedWallCount = 0;
      this.scheduler.removeAllEvents();

      var generator = this._getActiveGenerator().generator;

      generator.reset();
      this.gridView.reset();
    }
  }, {
    key: 'scheduleNextWallRemoval',
    value: function scheduleNextWallRemoval(cell1, cell2) {
      var _this3 = this;

      var TIME_STEP = 50;

      if (cell1.row == cell2.row) {
        if (cell2.col < cell1.col) {
          // left
          this.scheduler.delayedCall(TIME_STEP * this.destroyedWallCount, function () {
            _this3.gridView.destroyWall(cell1.walls.left);
          });
        } else {
          // right
          this.scheduler.delayedCall(TIME_STEP * this.destroyedWallCount, function () {
            _this3.gridView.destroyWall(cell1.walls.right);
          });
        }
      } else {
        if (cell2.row < cell1.row) {
          // above
          this.scheduler.delayedCall(TIME_STEP * this.destroyedWallCount, function () {
            _this3.gridView.destroyWall(cell1.walls.above);
          });
        } else {
          // below
          this.scheduler.delayedCall(TIME_STEP * this.destroyedWallCount, function () {
            _this3.gridView.destroyWall(cell1.walls.below);
          });
        }
      }

      this.destroyedWallCount += 1;
    }
  }, {
    key: '_getActiveGenerator',
    value: function _getActiveGenerator() {
      return this.generators[this.activeGeneratorIndex];
    }
  }, {
    key: '_updateActiveGeneratorName',
    value: function _updateActiveGeneratorName() {
      this.currentAlgoText.text = 'algo: ' + this._getActiveGenerator().name;
    }
  }]);

  return MazeScene;
}(Phaser.Scene);

/***/ }),

/***/ 1407:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RecursiveBacktracker = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

__webpack_require__(79);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RecursiveBacktracker = exports.RecursiveBacktracker = function () {
  function RecursiveBacktracker(scene, grid, gridView) {
    _classCallCheck(this, RecursiveBacktracker);

    this.scene = scene;
    this.grid = grid;
    this.gridView = gridView;

    this.reset();
  }

  _createClass(RecursiveBacktracker, [{
    key: 'reset',
    value: function reset() {
      this.currentRow = Phaser.Math.RND.between(0, this.grid.rows - 1);
      this.currentCol = Phaser.Math.RND.between(0, this.grid.cols - 1);
      this.cellStack = [];

      this.grid.forEachCell(function (cell) {
        return delete cell.visited;
      });
    }
  }, {
    key: 'generate',
    value: function generate() {
      this.reset();

      this.grid.get(this.currentRow, this.currentCol).visited = true;

      this.step();
    }

    // private

  }, {
    key: 'canStep',
    value: function canStep() {
      return this.grid.someCell(function (cell) {
        return !cell.visited;
      });
    }
  }, {
    key: 'step',
    value: function step() {
      var cell = this.grid.get(this.currentRow, this.currentCol);
      var neighbors = Object.values(this.grid.getNeighbors(cell)).filter(function (x) {
        return x;
      });
      var unvisitedNeighbors = neighbors.filter(function (neighbor) {
        return !neighbor.visited;
      });

      if (unvisitedNeighbors.length) {
        var neighbor = Phaser.Math.RND.pick(unvisitedNeighbors);
        this.cellStack.push(cell);

        this.scene.scheduleNextWallRemoval(cell, neighbor);

        this.currentRow = neighbor.row;
        this.currentCol = neighbor.col;

        neighbor.visited = true;
      } else if (this.cellStack.length) {
        var poppedCell = this.cellStack.pop();

        this.currentRow = poppedCell.row;
        this.currentCol = poppedCell.col;
      }

      if (this.canStep()) {
        this.step();
      }
    }
  }]);

  return RecursiveBacktracker;
}();

/***/ }),

/***/ 1408:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GridView = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

__webpack_require__(79);

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CELL_SIZE = 40;
var WALL_THICKNESS = 1;

var GridView = exports.GridView = function () {
  function GridView(scene, grid, x, y) {
    _classCallCheck(this, GridView);

    this.scene = scene;
    this.grid = grid;

    this.gridX = x;
    this.gridY = y;

    this.refresh();
  }

  _createClass(GridView, [{
    key: 'refresh',
    value: function refresh() {
      if (this.container) {
        this.container.each(function (child) {
          return child.destroy();
        });
        this.container.destroy();
      }

      this.gridWidth = this.grid.cols * CELL_SIZE /*+ ((this.grid.cols + 1) * WALL_THICKNESS)*/;
      this.gridHeight = this.grid.rows * CELL_SIZE /*+ ((this.grid.rows + 1) * WALL_THICKNESS)*/;
      var centerX = this.gridX - this.gridWidth / 2;
      var centerY = this.gridY - this.gridHeight / 2;

      this.cellViews = this._buildCellViews(); // key: `${row}${col}`
      this.wallViews = this._buildWallViews(); // key: `${cell1.row}${cell1.col},${cell2.row}${cell2.col}`
      this.outlineViews = this._buildOutlineViews(); // []

      this.container = this.scene.add.container(centerX, centerY, [].concat(_toConsumableArray(Object.values(this.cellViews)), _toConsumableArray(Object.values(this.wallViews)), _toConsumableArray(this.outlineViews)));
    }
  }, {
    key: 'reset',
    value: function reset() {
      Object.values(this.wallViews).forEach(function (wallView) {
        return wallView.alpha = 1;
      });
      this.scene.tweens.killAll();
    }
  }, {
    key: 'destroyWall',
    value: function destroyWall(wall) {
      var wallView = this.wallViews['' + wall.cell1.row + wall.cell1.col + ',' + wall.cell2.row + wall.cell2.col];
      this.scene.tweens.add({
        targets: wallView,
        props: {
          alpha: 0
        },
        duration: 200
      });
    }
  }, {
    key: '_buildCellViews',
    value: function _buildCellViews() {
      var _this = this;

      var cellViews = {};

      this.grid.forEachCell(function (cell) {
        var _getCellCoordinates2 = _this._getCellCoordinates(cell),
            x = _getCellCoordinates2.x,
            y = _getCellCoordinates2.y;

        var cellView = _this.scene.add.rectangle(x, y, CELL_SIZE, CELL_SIZE, 0xFFFFFF);
        cellViews['' + cell.row + cell.col] = cellView;
      });

      return cellViews;
    }
  }, {
    key: '_buildWallViews',
    value: function _buildWallViews() {
      var _this2 = this;

      var wallViews = {};

      this.grid.forEachWall(function (wall) {
        var _getWallCoordinates2 = _this2._getWallCoordinates(wall),
            x = _getWallCoordinates2.x,
            y = _getWallCoordinates2.y,
            width = _getWallCoordinates2.width,
            height = _getWallCoordinates2.height;

        var wallView = _this2.scene.add.rectangle(x, y, width, height, 0x000000);
        wallViews['' + wall.cell1.row + wall.cell1.col + ',' + wall.cell2.row + wall.cell2.col] = wallView;
      });

      return wallViews;
    }
  }, {
    key: '_buildOutlineViews',
    value: function _buildOutlineViews() {
      var outlineViews = [this.scene.add.rectangle(this.gridWidth / 2, 0, this.gridWidth, WALL_THICKNESS, 0x000000), // top
      this.scene.add.rectangle(this.gridWidth / 2, this.gridHeight, this.gridWidth, WALL_THICKNESS, 0x000000), // bottom
      this.scene.add.rectangle(0, this.gridHeight / 2, WALL_THICKNESS, this.gridHeight, 0x000000), // left
      this.scene.add.rectangle(this.gridWidth, this.gridHeight / 2, WALL_THICKNESS, this.gridHeight, 0x000000)];

      return outlineViews;
    }
  }, {
    key: '_getCellCoordinates',
    value: function _getCellCoordinates(cell) {
      return {
        x: cell.col * CELL_SIZE + /*((cell.col + 1) * WALL_THICKNESS)*/+CELL_SIZE / 2,
        y: cell.row * CELL_SIZE + /*((cell.row + 1) * WALL_THICKNESS)*/+CELL_SIZE / 2
      };
    }
  }, {
    key: '_getWallCoordinates',
    value: function _getWallCoordinates(wall) {
      var cell1Coordinates = this._getCellCoordinates(wall.cell1);
      var cell2Coordinates = this._getCellCoordinates(wall.cell2);

      if (cell1Coordinates.x != cell2Coordinates.x) {
        // different columns
        var x = (cell1Coordinates.x + cell2Coordinates.x) / 2;
        var y = cell1Coordinates.y;
        var width = WALL_THICKNESS;
        var height = CELL_SIZE;

        return { x: x, y: y, width: width, height: height };
      } else {
        // different rows
        var _x = cell1Coordinates.x;
        var _y = (cell1Coordinates.y + cell2Coordinates.y) / 2;
        var _width = CELL_SIZE;
        var _height = WALL_THICKNESS;

        return { x: _x, y: _y, width: _width, height: _height };
      }
    }
  }]);

  return GridView;
}();

/***/ }),

/***/ 1409:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Grid = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cell = __webpack_require__(1410);

var _wall4 = __webpack_require__(1411);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Grid = exports.Grid = function () {
  function Grid(rows, cols) {
    _classCallCheck(this, Grid);

    this.setSize(rows, cols);
  }

  _createClass(Grid, [{
    key: 'setSize',
    value: function setSize(rows, cols) {
      var _this = this;

      this.rows = rows;
      this.cols = cols;
      this.cells = [];
      this.walls = new Set();

      // create cells
      for (var row = 0; row < rows; row++) {
        this.cells[row] = [];
        for (var col = 0; col < cols; col++) {
          this.cells[row][col] = new _cell.Cell(row, col);
        }
      }

      // create walls
      this.forEachCell(function (cell) {
        var aboveIndex = cell.row - 1;
        var belowIndex = cell.row + 1;
        var leftIndex = cell.col - 1;
        var rightIndex = cell.col + 1;

        var neighbors = {
          above: aboveIndex >= 0 ? _this.cells[aboveIndex][cell.col] : null,
          below: belowIndex < rows ? _this.cells[belowIndex][cell.col] : null,
          left: leftIndex >= 0 ? _this.cells[cell.row][leftIndex] : null,
          right: rightIndex < cols ? _this.cells[cell.row][rightIndex] : null
        };

        if (neighbors.above) {
          var wall = neighbors.above.walls.below || new _wall4.Wall(neighbors.above, cell);
          neighbors.above.walls.below = wall;
          cell.walls.above = wall;
          _this.walls.add(wall);
        }

        if (neighbors.below) {
          var _wall = neighbors.below.walls.above || new _wall4.Wall(neighbors.below, cell);
          neighbors.below.walls.above = _wall;
          cell.walls.below = _wall;
          _this.walls.add(_wall);
        }

        if (neighbors.left) {
          var _wall2 = neighbors.left.walls.right || new _wall4.Wall(neighbors.left, cell);
          neighbors.left.walls.right = _wall2;
          cell.walls.left = _wall2;
          _this.walls.add(_wall2);
        }

        if (neighbors.right) {
          var _wall3 = neighbors.right.walls.left || new _wall4.Wall(neighbors.right, cell);
          neighbors.right.walls.left = _wall3;
          cell.walls.right = _wall3;
          _this.walls.add(_wall3);
        }
      });
    }
  }, {
    key: 'getNeighbors',
    value: function getNeighbors(cell) {
      var aboveIndex = cell.row - 1;
      var belowIndex = cell.row + 1;
      var leftIndex = cell.col - 1;
      var rightIndex = cell.col + 1;

      return {
        above: aboveIndex >= 0 ? this.cells[aboveIndex][cell.col] : null,
        below: belowIndex < this.rows ? this.cells[belowIndex][cell.col] : null,
        left: leftIndex >= 0 ? this.cells[cell.row][leftIndex] : null,
        right: rightIndex < this.cols ? this.cells[cell.row][rightIndex] : null
      };
    }
  }, {
    key: 'get',
    value: function get(row, col) {
      return this.cells[row][col];
    }
  }, {
    key: 'someCell',
    value: function someCell(fn) {
      return this.cells.some(function (row) {
        return row.some(fn);
      });
    }
  }, {
    key: 'forEachCell',
    value: function forEachCell(fn) {
      return this.cells.forEach(function (row) {
        return row.forEach(fn);
      });
    }
  }, {
    key: 'forEachWall',
    value: function forEachWall(fn) {
      return this.walls.forEach(fn);
    }
  }]);

  return Grid;
}();

/***/ }),

/***/ 1410:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Cell = exports.Cell = function Cell(row, col) {
  _classCallCheck(this, Cell);

  this.row = row;
  this.col = col;

  this.walls = {
    above: null,
    below: null,
    left: null,
    right: null
  };
};

/***/ }),

/***/ 1411:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Wall = exports.Wall = function Wall(cell1, cell2) {
  _classCallCheck(this, Wall);

  this.cell1 = cell1;
  this.cell2 = cell2;
};

/***/ }),

/***/ 1412:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RandomizedKruskal = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

__webpack_require__(79);

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RandomizedKruskal = exports.RandomizedKruskal = function () {
  function RandomizedKruskal(scene, grid, gridView) {
    _classCallCheck(this, RandomizedKruskal);

    this.scene = scene;
    this.grid = grid;
    this.gridView = gridView;

    this.reset();
  }

  _createClass(RandomizedKruskal, [{
    key: 'reset',
    value: function reset() {
      var _this = this;

      this.walls = Phaser.Math.RND.shuffle([].concat(_toConsumableArray(this.grid.walls)));
      this.cellSets = [];
      this.grid.forEachCell(function (cell) {
        _this.cellSets.push(new Set([cell]));
      });
    }
  }, {
    key: 'generate',
    value: function generate() {
      var _this2 = this;

      this.walls.forEach(function (wall) {
        var cell1Set = _this2._findCellSet(wall.cell1);
        var cell2Set = _this2._findCellSet(wall.cell2);

        if (cell1Set != cell2Set) {
          _this2.scene.scheduleNextWallRemoval(wall.cell1, wall.cell2);

          var newCellSet = _this2._combineCellSets(cell1Set, cell2Set);
          _this2.cellSets.push(newCellSet);

          // remove old cell sets
          var cell1SetIndex = _this2.cellSets.findIndex(function (cellSet) {
            return cellSet == cell1Set;
          });
          _this2.cellSets.splice(cell1SetIndex, 1);

          var cell2SetIndex = _this2.cellSets.findIndex(function (cellSet) {
            return cellSet == cell2Set;
          });
          _this2.cellSets.splice(cell2SetIndex, 1);
        }
      });
    }
  }, {
    key: '_findCellSet',
    value: function _findCellSet(cell) {
      return this.cellSets.find(function (cellSet) {
        return cellSet.has(cell);
      });
    }
  }, {
    key: '_combineCellSets',
    value: function _combineCellSets(set1, set2) {
      var _union = new Set(set1);
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = set2[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var elem = _step.value;

          _union.add(elem);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return _union;
    }
  }]);

  return RandomizedKruskal;
}();

/***/ }),

/***/ 516:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(79);

var _mazeScene = __webpack_require__(1406);

var gameConfig = {
  width: 500,
  height: 500,
  scene: _mazeScene.MazeScene
};

new Phaser.Game(gameConfig);

/***/ })

},[516]);