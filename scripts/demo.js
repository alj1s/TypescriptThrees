/// <reference path="jquery.d.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Board = (function () {
    function Board() {
        this.numberOfRows = 4;
        this.numberOfColumns = 4;
        this.initialise();
        this.setInitialState();
    }
    Board.prototype.initialise = function () {
        this.state = new Array();

        for (var c = 0; c < this.numberOfColumns; c++) {
            this.state.push(new Array());
        }
    };

    Board.prototype.setInitialState = function () {
        this.state[0][0] = new Tile(3);
        this.state[1][0] = new DyadTile();
        this.state[3][0] = new UnitTile();
    };

    Board.prototype.move = function (direction) {
        if (direction == 0 /* Up */) {
            this.shiftUp();
        }
        if (direction == 1 /* Down */) {
            this.shiftDown();
        }
        if (direction == 2 /* Left */) {
            this.shiftLeft();
        }
        if (direction == 3 /* Right */) {
            this.shiftRight();
        }

        this.addRandomTile();
    };

    Board.prototype.addRandomTile = function () {
        var addedTile;

        while (!addedTile) {
            var column = Math.floor(Math.random() * 4);
            var row = Math.floor(Math.random() * 4);

            if (this.state[column][row] == null) {
                var value = Math.floor(Math.random() * 6 + 1);
                if (value == 1) {
                    this.state[column][row] = new UnitTile();
                } else if (value == 2) {
                    this.state[column][row] = new DyadTile();
                } else {
                    var val = Math.pow(2, value - 3) * 3;
                    this.state[column][row] = new Tile(val);
                }

                addedTile = true;
            }
        }
    };

    Board.prototype.shiftLeft = function () {
        for (var row = 0; row < this.numberOfRows; row++) {
            for (var col = 0; col < this.numberOfColumns; col++) {
                var tile = this.state[col][row];
                if (tile == null)
                    continue;

                if (this.isOnBoard(col - 1, row)) {
                    var other = this.state[col - 1][row];
                    if (other != null) {
                        if (tile.canMergeWith(other)) {
                            this.state[col - 1][row] = other.merge(tile);
                            this.state[col][row] = null;
                        }
                    } else {
                        this.state[col - 1][row] = tile;
                        this.state[col][row] = null;
                    }
                }
            }
        }
    };

    Board.prototype.shiftRight = function () {
        for (var row = 0; row < this.numberOfRows; row++) {
            for (var col = this.numberOfColumns - 1; col > -1; col--) {
                var tile = this.state[col][row];
                if (tile == null)
                    continue;

                if (this.isOnBoard(col + 1, row)) {
                    var other = this.state[col + 1][row];
                    if (other != null) {
                        if (tile.canMergeWith(other)) {
                            this.state[col + 1][row] = other.merge(tile);
                            this.state[col][row] = null;
                        }
                    } else {
                        this.state[col + 1][row] = tile;
                        this.state[col][row] = null;
                    }
                }
            }
        }
    };

    Board.prototype.shiftDown = function () {
        for (var col = 0; col < this.numberOfColumns; col++) {
            for (var row = this.numberOfRows - 1; row > -1; row--) {
                var tile = this.state[col][row];
                if (tile == null)
                    continue;

                if (this.isOnBoard(col, row + 1)) {
                    var other = this.state[col][row + 1];
                    if (other != null) {
                        if (tile.canMergeWith(other)) {
                            this.state[col][row + 1] = other.merge(tile);
                            this.state[col][row] = null;
                        }
                    } else {
                        this.state[col][row + 1] = tile;
                        this.state[col][row] = null;
                    }
                }
            }
        }
    };

    Board.prototype.shiftUp = function () {
        for (var col = 0; col < this.numberOfColumns; col++) {
            for (var row = 0; row < this.numberOfRows; row++) {
                var tile = this.state[col][row];
                if (tile == null)
                    continue;

                if (this.isOnBoard(col, row - 1)) {
                    var other = this.state[col][row - 1];
                    if (other != null) {
                        if (tile.canMergeWith(other)) {
                            this.state[col][row - 1] = other.merge(tile);
                            this.state[col][row] = null;
                        }
                    } else {
                        this.state[col][row - 1] = tile;
                        this.state[col][row] = null;
                    }
                }
            }
        }
    };

    Board.prototype.getTile = function (column, row) {
        return this.state[column][row];
    };

    Board.prototype.isOnBoard = function (column, row) {
        return -1 < column && column < this.numberOfColumns && -1 < row && row < this.numberOfRows;
    };
    return Board;
})();

var Tile = (function () {
    function Tile(value) {
        this.value = value;
        this.color = "#FFFFFF";
    }
    Tile.prototype.canMergeWith = function (other) {
        return other.value == this.value;
    };

    Tile.prototype.merge = function (other) {
        return new Tile(this.value + other.value);
    };
    return Tile;
})();

var UnitTile = (function (_super) {
    __extends(UnitTile, _super);
    function UnitTile() {
        _super.call(this, 1);
        this.color = "#FF0000";
    }
    UnitTile.prototype.canMergeWith = function (other) {
        return other.value + this.value == 3;
    };
    return UnitTile;
})(Tile);

var DyadTile = (function (_super) {
    __extends(DyadTile, _super);
    function DyadTile() {
        _super.call(this, 2);
        this.color = "#0000FF";
    }
    DyadTile.prototype.canMergeWith = function (other) {
        return other.value + this.value == 3;
    };
    return DyadTile;
})(Tile);

var BoardRenderer = (function () {
    function BoardRenderer(board) {
        this.board = board;
    }
    BoardRenderer.prototype.render = function (context) {
        for (var i = 0; i < this.board.numberOfRows; i++) {
            for (var j = 0; j < this.board.numberOfColumns; j++) {
                var tile = this.board.getTile(j, i);
                if (tile != null) {
                    var text = tile.value.toString();
                    context.fillStyle = tile.color;
                    context.fillRect(j * 50, i * 50, 50, 50);

                    context.font = "30px Arial";
                    context.fillStyle = "#000000";
                    context.fillText(text, j * 50 + 10, (i + 1) * 50 - 15);
                } else {
                    context.fillStyle = "#FFFFFF";
                    context.fillRect(j * 50, i * 50, 50, 50);
                }
            }
        }

        this.drawBoard(context);
    };

    BoardRenderer.prototype.drawBoard = function (context) {
        var i;
        for (i = 0; i <= 200; i += 50) {
            context.moveTo(0, i);
            context.lineTo(200, i);
            context.stroke();
        }
        for (i = 0; i <= 200; i += 50) {
            context.moveTo(i, 0);
            context.lineTo(i, 200);
            context.stroke();
        }
    };
    return BoardRenderer;
})();

var Direction;
(function (Direction) {
    Direction[Direction["Up"] = 0] = "Up";
    Direction[Direction["Down"] = 1] = "Down";
    Direction[Direction["Left"] = 2] = "Left";
    Direction[Direction["Right"] = 3] = "Right";
})(Direction || (Direction = {}));

function exec() {
    var canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    document.body.appendChild(canvas);
    var ctx = canvas.getContext("2d");
    var board = new Board();
    var boardRenderer = new BoardRenderer(board);
    boardRenderer.render(ctx);

    $(window).bind('keydown', function (e) {
        var code = (e.keyCode ? e.keyCode : e.which);
        if (code == 37) {
            board.move(2 /* Left */);
        }
        if (code == 38) {
            board.move(0 /* Up */);
        }
        if (code == 39) {
            board.move(3 /* Right */);
        }
        if (code == 40) {
            board.move(1 /* Down */);
        }

        boardRenderer.render(ctx);
    });
}

exec();
//# sourceMappingURL=demo.js.map
