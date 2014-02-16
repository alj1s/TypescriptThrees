/// <reference path="jquery.d.ts"/>

class Board {
    numberOfRows:number = 4;
    numberOfColumns:number = 4;

    private state:Tile[][];

    constructor() {

        this.initialise();
        this.setInitialState();
    }

    private initialise() {
        this.state = [];

        for (var c = 0; c < this.numberOfColumns; c++) {
            this.state.push([]);
        }
    }

    private setInitialState() {
        this.state[0][0] = new Tile(3);
        this.state[1][0] = new DyadTile();
        this.state[3][0] = new UnitTile();
    }

    move(direction:Direction) {
        if (direction == Direction.Up) {
            this.shiftUp();
        }
        if (direction == Direction.Down) {
            this.shiftDown();
        }
        if (direction == Direction.Left) {
            this.shiftLeft();
        }
        if (direction == Direction.Right) {
            this.shiftRight();
        }

        this.addRandomTile();

    }

    private addRandomTile() {

        var addedTile:boolean;

        while (!addedTile) {
            var column = Math.floor(Math.random() * 4);
            var row = Math.floor(Math.random() * 4);

            if(this.state[column][row] == null){
                var value = Math.floor(Math.random()*6 + 1);
                if(value == 1){
                    this.state[column][row] = new UnitTile();
                }
                else if(value == 2){
                    this.state[column][row] = new DyadTile();
                }
                else{
                    var val = Math.pow(2,value -3)*3;
                    this.state[column][row] = new Tile(val);
                }

                addedTile = true;
            }
        }
    }

    private shiftLeft() {
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
                        }
                    }
                    else {
                        this.state[col - 1][row] = tile;
                        this.state[col][row] = null;
                    }
                }
            }
        }
    }

    private shiftRight() {
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
                        }
                    }
                    else {
                        this.state[col + 1][row] = tile;
                        this.state[col][row] = null;
                    }
                }
            }
        }
    }

    private shiftDown() {
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
                        }
                    }
                    else {
                        this.state[col][row + 1] = tile;
                        this.state[col][row] = null;
                    }
                }
            }
        }
    }

    private shiftUp() {
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
                        }
                    }
                    else {
                        this.state[col][row - 1] = tile;
                        this.state[col][row] = null;
                    }
                }
            }
        }
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

    color:string = "#FF0000";

    constructor() {
        super(1);
    }

    canMergeWith(other:Tile) {
        return other.value + this.value == 3;
    }
}

class DyadTile extends Tile {

    color:string = "#0000FF";

    constructor() {
        super(2);
    }

    canMergeWith(other:Tile) {
        return other.value + this.value == 3;
    }
}

class BoardRenderer {

    constructor(public board:Board) {
    }

    render(context:CanvasRenderingContext2D) {
        this.drawBoard(context);

        for (var i = 0; i < this.board.numberOfRows; i++) {
            for (var j = 0; j < this.board.numberOfColumns; j++) {
                var tile = this.board.getTile(j, i);
                if (tile != null) {
                    context.fillStyle = tile.color;
                    context.fillRect(j * 50 + 5, i * 50 + 5, 40, 40);

                    this.drawTileValue(context, tile, j, i);
                }
            }
        }
    }

    private drawTileValue(context:CanvasRenderingContext2D, tile:Tile, column:number, row:number) {
        var text:string = tile.value.toString();
        context.font = "30px Arial";
        context.fillStyle = "#000000";
        context.fillText(text, column * 50 + 10, (row + 1) * 50 - 15);
    }

    private drawBoard(context:CanvasRenderingContext2D) {

        context.fillStyle = "#FFFFFF";
        context.fillRect(0, 0, 200, 200);

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
    canvas.width = 256;
    canvas.height = 256;

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



