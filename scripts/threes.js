/// <reference path="jquery.d.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
        this.constructor = d;
    }

    __.prototype = b.prototype;
    d.prototype = new __();
};
var Board = (function () {
    function Board() {
        this.numberOfRows = 4;
        this.numberOfColumns = 4;
        this.initialise();
        this.setInitialState();
        this.computeScore();
    }

    Board.prototype.initialise = function () {
        this.state = [];

        for (var c = 0; c < this.numberOfColumns; c++) {
            this.state.push([]);
        }
    };

    Board.prototype.setInitialState = function () {
        for (var i = 0; i < 9; i++) {
            this.addRandomTile();
        }
    };

    Board.prototype.move = function (direction) {
        var moved;
        if (direction == 0 /* Up */) {
            moved = this.shiftUp();
        }
        if (direction == 1 /* Down */) {
            moved = moved || this.shiftDown();
        }
        if (direction == 2 /* Left */) {
            moved = moved || this.shiftLeft();
        }
        if (direction == 3 /* Right */) {
            moved = moved || this.shiftRight();
        }

        if (moved) {
            this.addTile(direction);
        }

        this.computeScore();
    };

    Board.prototype.computeScore = function () {
        var total = 0;
        for (var j = 0; j < this.numberOfColumns; j++) {
            for (var i = 0; i < this.numberOfRows; i++) {
                var tile = this.state[j][i];
                if (tile != null && tile.value > 2) {
                    total += Math.pow(3, (Math.log(tile.value / 3) / Math.log(2) + 1));
                }
            }
        }

        $("#score").text("Score " + total);
    };

    Board.prototype.getRandomValue = function () {
        return Math.floor(Math.random() * 3 + 1);
    };

    Board.prototype.addRandomTileToRow = function (row, value) {
        var addedTile = false;

        while (!addedTile) {
            var column = Math.floor(Math.random() * 4);

            if (this.state[column][row] == null) {
                if (value == 1) {
                    this.state[column][row] = new UnitTile();
                } else if (value == 2) {
                    this.state[column][row] = new DyadTile();
                } else {
                    var exponent = Math.floor(Math.random() * 3);
                    var val = Math.pow(2, exponent) * 3;
                    this.state[column][row] = new Tile(val);
                }

                addedTile = true;
            }
        }
    };

    Board.prototype.addRandomTileToColumn = function (column, value) {
        var addedTile = false;

        while (!addedTile) {
            var row = Math.floor(Math.random() * 4);

            if (this.state[column][row] == null) {
                if (value == 1) {
                    this.state[column][row] = new UnitTile();
                } else if (value == 2) {
                    this.state[column][row] = new DyadTile();
                } else {
                    var exponent = Math.floor(Math.random() * 3);
                    var val = Math.pow(2, exponent) * 3;
                    this.state[column][row] = new Tile(val);
                }

                addedTile = true;
            }
        }
    };

    Board.prototype.addRandomTile = function () {
        var addedTile = false;
        var value = this.getRandomValue();

        while (!addedTile) {
            var row = Math.floor(Math.random() * 4);
            var column = Math.floor(Math.random() * 4);

            if (this.state[column][row] == null) {
                if (value == 1) {
                    this.state[column][row] = new UnitTile();
                } else if (value == 2) {
                    this.state[column][row] = new DyadTile();
                } else {
                    var exponent = Math.floor(Math.random() * 3);
                    var val = Math.pow(2, exponent) * 3;
                    this.state[column][row] = new Tile(val);
                }

                addedTile = true;
            }
        }
    };

    Board.prototype.addTile = function (direction) {
        var value = this.getRandomValue();

        switch (direction) {
            case 0 /* Up */
            :
                this.addRandomTileToRow(this.numberOfRows - 1, value);
                break;
            case 1 /* Down */
            :
                this.addRandomTileToRow(0, value);
                break;
            case 2 /* Left */
            :
                this.addRandomTileToColumn(this.numberOfColumns - 1, value);
                break;
            case 3 /* Right */
            :
                this.addRandomTileToColumn(0, value);
        }
    };

    Board.prototype.shiftLeft = function () {
        var moved = false;
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
                            moved = true;
                        }
                    } else {
                        this.state[col - 1][row] = tile;
                        this.state[col][row] = null;
                        moved = true;
                    }
                }
            }
        }

        return moved;
    };

    Board.prototype.shiftRight = function () {
        var moved = false;
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
                            moved = true;
                        }
                    } else {
                        this.state[col + 1][row] = tile;
                        this.state[col][row] = null;
                        moved = true;
                    }
                }
            }
        }

        return moved;
    };

    Board.prototype.shiftDown = function () {
        var moved = false;
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
                            moved = true;
                        }
                    } else {
                        this.state[col][row + 1] = tile;
                        this.state[col][row] = null;
                        moved = true;
                    }
                }
            }
        }

        return moved;
    };

    Board.prototype.shiftUp = function () {
        var moved = false;
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
                            moved = true;
                        }
                    } else {
                        this.state[col][row - 1] = tile;
                        this.state[col][row] = null;
                        moved = true;
                    }
                }
            }
        }

        return moved;
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
        this.textColor = "#000000";
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
        this.textColor = "#FFFFFF";
    }

    UnitTile.prototype.canMergeWith = function (other) {
        return (other.value + this.value == 3);
    };
    return UnitTile;
})(Tile);

var DyadTile = (function (_super) {
    __extends(DyadTile, _super);
    function DyadTile() {
        _super.call(this, 2);
        this.color = "#0000FF";
        this.textColor = "#FFFFFF";
    }

    DyadTile.prototype.canMergeWith = function (other) {
        return other.value + this.value == 3;
    };
    return DyadTile;
})(Tile);

var BoardRenderer = (function () {
    function BoardRenderer(board) {
        this.board = board;
        this.cornerRadius = 20;
        this.boardSize = 400;
        this.cellSize = 100;
        this.tileSize = 80;
    }

    BoardRenderer.prototype.render = function (context) {
        var tileMargin = 10;

        this.drawBoard(context);

        for (var i = 0; i < this.board.numberOfRows; i++) {
            for (var j = 0; j < this.board.numberOfColumns; j++) {
                var tile = this.board.getTile(j, i);
                if (tile != null) {
                    context.fillStyle = tile.color;
                    context.lineJoin = "round";
                    context.lineWidth = this.cornerRadius;
                    context.strokeStyle = tile.color;
                    context.strokeRect(j * this.cellSize + tileMargin + (this.cornerRadius / 2), i * this.cellSize + tileMargin + (this.cornerRadius / 2), this.tileSize - this.cornerRadius, this.tileSize - this.cornerRadius);
                    context.fillRect(j * this.cellSize + tileMargin + (this.cornerRadius / 2), i * this.cellSize + tileMargin + (this.cornerRadius / 2), this.tileSize - this.cornerRadius, this.tileSize - this.cornerRadius);

                    this.drawTileValue(context, tile, j, i);
                }
            }
        }
    };

    BoardRenderer.prototype.drawTileValue = function (context, tile, column, row) {
        var text = tile.value.toString();
        var fontSize = 30;

        context.font = fontSize + "px Arial";
        context.fillStyle = "#000000";
        context.fillStyle = tile.textColor;
        var textSize = context.measureText(tile.value.toString());

        context.fillText(text, column * this.cellSize + (this.cellSize - textSize.width) / 2, (row + 1) * this.cellSize - (this.cellSize - fontSize) / 2);
    };

    BoardRenderer.prototype.drawBoard = function (context) {
        context.fillStyle = "#C5F6FF";
        context.lineJoin = "round";
        context.lineWidth = this.cornerRadius;
        context.strokeStyle = "#C5F6FF";
        context.strokeRect(this.cornerRadius / 2, this.cornerRadius / 2, this.boardSize - this.cornerRadius, this.boardSize - this.cornerRadius);
        context.fillRect(this.cornerRadius / 2, this.cornerRadius / 2, this.boardSize - this.cornerRadius, this.boardSize - this.cornerRadius);

        context.strokeStyle = "black";
        context.lineWidth = 1;

        var i;
        for (i = 0; i <= this.boardSize; i += this.cellSize) {
            context.moveTo(0, i);
            context.lineTo(this.boardSize, i);
            context.stroke();
        }
        for (i = this.cellSize; i <= this.boardSize - this.cellSize; i += this.cellSize) {
            context.moveTo(i, 0);
            context.lineTo(i, this.boardSize);
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

function boardClear() {
    var div = document.getElementById("myDiv");
    var canvas = document.getElementById("board");
    div.removeChild(canvas);
    exec();
}

function exec() {
    var canvas = document.createElement("canvas");
    canvas.id = "board";
    canvas.width = 400;
    canvas.height = 400;

    var div = document.getElementById("myDiv");
    if (div == null) {
        div = document.createElement("div");
        div.id = "myDiv";
        document.body.appendChild(div);
    }

    div.appendChild(canvas);

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
