/// <reference path="jquery.d.ts"/>

class Board {
    numberOfRows:number = 4;
    numberOfColumns:number = 4;

    private state:Tile[][];

    constructor() {

        this.initialise();
        this.setInitialState();
        this.computeScore();
    }

    private initialise() {
        this.state = [];

        for (var c = 0; c < this.numberOfColumns; c++) {
            this.state.push([]);
        }
    }

    private setInitialState() {
        for (var i = 0; i < 9; i++) {
            this.addRandomTile();
        }
    }

    move(direction:Direction) {
        var moved:boolean;
        if (direction == Direction.Up) {
            moved = this.shiftUp();
        }
        if (direction == Direction.Down) {
            moved = moved || this.shiftDown();
        }
        if (direction == Direction.Left) {
            moved = moved || this.shiftLeft();
        }
        if (direction == Direction.Right) {
            moved = moved || this.shiftRight();
        }

        if (moved) {
            this.addRandomTile();
        }

        this.computeScore();

    }

    private computeScore() {
        var total:number = 0;
        for (var j = 0; j < this.numberOfColumns; j++) {
            for (var i = 0; i < this.numberOfRows; i++) {
                var tile:Tile = this.state[j][i];
                if (tile != null && tile.value > 2) {
                    total += Math.pow(3, (Math.log(tile.value / 3) / Math.log(2) + 1));
                }
            }
        }

        $("#score").text("Score " + total);

    }

    private addRandomTile() {

        var addedTile:boolean;

        while (!addedTile) {
            var column = Math.floor(Math.random() * 4);
            var row = Math.floor(Math.random() * 4);

            if (this.state[column][row] == null) {
                var value = Math.floor(Math.random() * 3 + 1);
                if (value == 1) {
                    this.state[column][row] = new UnitTile();
                }
                else if (value == 2) {
                    this.state[column][row] = new DyadTile();
                }
                else {
                    var exponent = Math.floor(Math.random() * 3);
                    var val = Math.pow(2, exponent) * 3;
                    this.state[column][row] = new Tile(val);
                }

                addedTile = true;
            }
        }
    }

    private shiftLeft():boolean {
        var moved:boolean = false;
        for (var row = 0; row < this.numberOfRows; row++) {
            for (var col = 0; col < this.numberOfColumns; col++) {

                var tile = this.state[col][row];
                if (tile == null) continue;

                if (this.isOnBoard(col - 1, row)) {
                    var other = this.state[col - 1][row];
                    if (other != null) {
                        if (tile.canMergeWith(other)) {
                            this.state[col - 1][row] = other.merge(tile);
                            this.state[col][row] = null;
                            moved = true;

                        }
                    }
                    else {
                        this.state[col - 1][row] = tile;
                        this.state[col][row] = null;
                        moved = true;

                    }

                }
            }
        }

        return moved;
    }

    private shiftRight():boolean {
        var moved:boolean = false;
        for (var row = 0; row < this.numberOfRows; row++) {
            for (var col = this.numberOfColumns - 1; col > -1; col--) {

                var tile = this.state[col][row];
                if (tile == null) continue;

                if (this.isOnBoard(col + 1, row)) {
                    var other = this.state[col + 1][row];
                    if (other != null) {
                        if (tile.canMergeWith(other)) {
                            this.state[col + 1][row] = other.merge(tile);
                            this.state[col][row] = null;
                            moved = true;

                        }
                    }
                    else {
                        this.state[col + 1][row] = tile;
                        this.state[col][row] = null;
                        moved = true;

                    }
                }
            }
        }

        return moved;
    }

    private shiftDown():boolean {
        var moved:boolean = false;
        for (var col = 0; col < this.numberOfColumns; col++) {
            for (var row = this.numberOfRows - 1; row > -1; row--) {

                var tile = this.state[col][row];
                if (tile == null) continue;

                if (this.isOnBoard(col, row + 1)) {
                    var other = this.state[col][row + 1];
                    if (other != null) {
                        if (tile.canMergeWith(other)) {
                            this.state[col][row + 1] = other.merge(tile);
                            this.state[col][row] = null;
                            moved = true;

                        }
                    }
                    else {
                        this.state[col][row + 1] = tile;
                        this.state[col][row] = null;
                        moved = true;

                    }
                }
            }
        }

        return moved;
    }

    private shiftUp():boolean {
        var moved:boolean = false;
        for (var col = 0; col < this.numberOfColumns; col++) {
            for (var row = 0; row < this.numberOfRows; row++) {

                var tile = this.state[col][row];
                if (tile == null) continue;

                if (this.isOnBoard(col, row - 1)) {
                    var other = this.state[col][row - 1];
                    if (other != null) {
                        if (tile.canMergeWith(other)) {
                            this.state[col][row - 1] = other.merge(tile);
                            this.state[col][row] = null;
                            moved = true;

                        }
                    }
                    else {
                        this.state[col][row - 1] = tile;
                        this.state[col][row] = null;
                        moved = true;

                    }
                }
            }
        }

        return moved;
    }

    getTile(column:number, row:number) {
        return this.state[column][row];
    }

    private isOnBoard(column:number, row:number) {
        return -1 < column && column < this.numberOfColumns && -1 < row && row < this.numberOfRows;
    }
}

class Tile {

    color:string = "#FFFFFF";
    textColor:string = "#000000";

    constructor(public value:number) {
    }

    canMergeWith(other:Tile) {
        return other.value == this.value;
    }

    merge(other:Tile):Tile {
        return new Tile(this.value + other.value);
    }
}

class UnitTile extends Tile {

    constructor() {
        super(1);
        this.color = "#FF0000";
        this.textColor = "#FFFFFF";
    }

    canMergeWith(other:Tile) {
        return other.value + this.value == 3;
    }
}

class DyadTile extends Tile {

    constructor() {
        super(2);
        this.color = "#0000FF";
        this.textColor = "#FFFFFF";
    }

    canMergeWith(other:Tile) {
        return other.value + this.value == 3;
    }
}

class BoardRenderer {
    private cornerRadius:number = 20;
    private boardSize:number = 400;
    private cellSize:number = 100;
    private tileSize:number = 80;

    constructor(public board:Board) {
    }

    render(context:CanvasRenderingContext2D) {

        var tileMargin:number = 10;

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
    }

    private drawTileValue(context:CanvasRenderingContext2D, tile:Tile, column:number, row:number) {

        var text:string = tile.value.toString();
        var fontSize:number = 30;

        context.font = fontSize + "px Arial";
        context.fillStyle = "#000000";
        context.fillStyle = tile.textColor;
        var textSize = context.measureText(tile.value.toString());

        context.fillText(text, column * this.cellSize + (this.cellSize - textSize.width) / 2, (row + 1) * this.cellSize - (this.cellSize - fontSize) / 2);
    }

    private drawBoard(context:CanvasRenderingContext2D) {
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
    }
}

enum Direction { Up, Down, Left, Right }

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
        if (code == 37) { // left
            board.move(Direction.Left);
        }
        if (code == 38) { // up
            board.move(Direction.Up);
        }
        if (code == 39) { // right
            board.move(Direction.Right);
        }
        if (code == 40) { // down
            board.move(Direction.Down);
        }

        boardRenderer.render(ctx);
    });
}

exec();



