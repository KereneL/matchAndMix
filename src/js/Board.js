import Phaser from "phaser";
import { Square } from "./Square";

class Board extends Phaser.GameObjects.Container {
    static boardColor = 0x885237;
    static strokePrprts = 	{	width:3,
        color: 0x000000,
    };
    constructor(scene, worldPositionX, worldPositionY, boardColumns, boardRows, squareWidth, squareHeight, gapPx) {
        super(scene, worldPositionX, worldPositionY);

        this.boardColumns = boardColumns;
        this.boardRows = boardRows;

        this.squareWidth = squareWidth;
        this.squareHeight = squareHeight;
        this.allSquares = [];

        this.gapPx = gapPx;

        this.width = boardColumns * (squareWidth + gapPx) + gapPx;
        this.height = boardRows * (squareHeight + gapPx) + gapPx;

        this.boardBackground = new Phaser.GameObjects.Rectangle(this.scene, this.x, this.y, this.width, this.height, Board.boardColor);
        this.boardBackground.setStrokeStyle(Board.strokePrprts.width, Board.strokePrprts.color);
        this.isInSelectMode = false;

        //Init Board
        this.initBoard();
    }

    initBoard() {
        this.boardData = [this.boardColumns];
        for (let x = 0; x < this.boardColumns; x++) {
            this.boardData[x] = [];
            for (let y = 0; y < this.boardRows; y++) {
                let tileType = Square.returnRandomID();
                let square = new Square(this, x, y, this.squareWidth, this.squareHeight, tileType)
                this.boardData[x][y] = square;
                this.allSquares.push(square);
            }
        }
    }

    draw() {
        this.scene.add.existing(this.boardBackground);
        this.allSquares.forEach((square) => {
            square.draw();
        });
        this.comboLoop(this.checkForCombos());
    }

    indicesToPosition(x,y) {
        // if out-of-bounds return null
        if (x < 0 || x >= this.width ||
            y < 0 || y >= this.width) {
                return null;            
        }

        // if not, calculate the world position of tile[x][y], return it
        let worldPositionX = this.x - this.width / 2 +
        (this.gapPx + this.squareWidth) * x +
        this.gapPx + (this.squareWidth / 2);

        let worldPositionY = this.y - this.height / 2 +
        (this.gapPx + this.squareHeight) * y +
        this.gapPx + (this.squareHeight / 2);

        return {"x":worldPositionX,"y":worldPositionY}
    }

    selected(square) {
        // Is it the first selected square for this move or the second? if it's the second - attemp move;
        if (this.firstSelected == null) {
            this.isInSelectMode = true;
            this.firstSelected = square;
        } else {
            this.secondSelected = square;
            this.attemptMove(this.firstSelected, this.secondSelected);
            this.isInSelectMode = false;
        }
    }

    async attemptMove(first, second) {
        if (first==second){
            console.log("Illegal Move - can't select the same square twice");
            this.clearSelection();
            return;
        }

        let xDiffernce = Math.abs(first.xIndex - second.xIndex);
        let yDiffernce = Math.abs(first.yIndex - second.yIndex);
        if (!(xDiffernce === 1 && yDiffernce === 0) && 
            !(xDiffernce === 0 && yDiffernce === 1)){
            console.log("Illegal Move - squares have to be adjacent");
            this.clearSelection();
            return;
        }

        this.setActiveOff();
        this.switchSquaresOnBoard(first, second);

        let combos = await this.checkForCombos();

        // Swap back after failed attempt
        if (combos.length === 0) {
            console.log(`Illegal Move - not matching a combo :(`);
            this.switchSquaresOnBoard(second, first)  
            this.clearSelection();
            this.setActiveOn();
            return;
        }

        await this.swapMoveAndAnimate(first, second);

        await this.comboLoop(combos);

        this.clearSelection();
        this.setActiveOn();
    }

    switchSquaresOnBoard(first, second) {
        let temp = this.boardData[first.xIndex][first.yIndex];
        this.boardData[first.xIndex][first.yIndex] = this.boardData[second.xIndex][second.yIndex];
        this.boardData[second.xIndex][second.yIndex] = temp;
    }

    async swapMoveAndAnimate(first, second){
        // chagne Squares internal properties 
        let temp = { xIndex: first.xIndex, yIndex: first.yIndex };
        first.xIndex = second.xIndex;
        first.yIndex = second.yIndex;
        second.xIndex = temp.xIndex;
        second.yIndex = temp.yIndex;

        // also animate and change world position to finalize move to board
        let positionOne = { "x": first.x, "y": first.y };
        let positionTwo = { "x": second.x, "y": second.y };

        first.swapMove(positionTwo);
        await second.swapMove(positionOne);
    }

    async comboLoop(combosOfAttempt){
        let combos = combosOfAttempt;
        if (combos.length === 0) {
            return 0;
        }

        let toRemove = [];
        combos.forEach((combo) => {
            combo.forEach((square) => {
                if (!toRemove.includes(square)) {
                    toRemove.push(square)
                    square.square.fillColor = 0xffffff;
                };
            })
        })


        toRemove.forEach((square) => {
            this.allSquares.splice(0, 1, this.allSquares.indexOf(square));
            this.boardData[square.xIndex][square.yIndex].destroy();
            this.boardData[square.xIndex][square.yIndex] = null;
        });

        await this.fallDown();
        combos = await this.checkForCombos();
        await this.comboLoop(combos);
    }

    clearSelection() {
        if (this.firstSelected) {
            this. deselectSquare(this.firstSelected);
        };
        this.firstSelected = null;

        if (this.secondSelected) {
            this. deselectSquare(this.secondSelected);
        };
        this.secondSelected = null;

        this.isInSelectMode = false;
    }

    deselectSquare(square){
        square.selected = false;
        square.refreshColor();
    }

    checkForCombos() {
        let combos = [];
        for (let row = 0; row < this.boardColumns; row++) {
            for (let col = 0; col < this.boardRows; col++) {
                if (this.boardData[row][col] == null) { break }

                let currentSquare = this.boardData[row][col];
                let currentType = currentSquare.typeID;

                // check horizontally
                let combo = [currentSquare];
                for (let x = row + 1; x < this.boardColumns; x++) {
                    if (this.boardData[x][col] === null || this.boardData[x][col].typeID !== currentType) {
                        break;
                    } else {
                        combo.push(this.boardData[x][col]);
                    }
                }
                if (combo.length >= 3) {
                    combos.push(combo);
                }

                combo = [currentSquare];
                // check vertically
                for (let y = col + 1; y < this.boardRows; y++) {
                    if (this.boardData[row][y] == null) { break; }
                    if (this.boardData[row][y].typeID === currentType) {
                        combo.push(this.boardData[row][y]);
                    } else {
                        break;
                    }
                }
                if (combo.length >= 3) {
                    combos.push(combo);
                }
            }
        }
        console.log(`combos found: ${combos.length}`);
        return combos;
    }

    async fallDown() {
            for (let x = 0; x < this.boardData.length; x++) {
                let destY = this.boardData[x].length - 1;

                for (let y = this.boardData[x].length - 1; y >= 0; y--) {

                    if (this.boardData[x][y] !== null) {
                        if (destY !== y) {
                            this.boardData[x][destY] = this.boardData[x][y];

                            let worldPositionY = this.y - this.height / 2 +
                                (this.gapPx + this.squareHeight) * destY +
                                this.gapPx + (this.squareHeight / 2);

                            this.boardData[x][destY].yIndex = destY;
                            this.boardData[x][destY].fallMove(worldPositionY);

                            this.boardData[x][y] = null;
                        }
                        destY--;
                    }
                }
            }
             this.refillBoard();
    }

    async refillBoard() {
        for (let x = 0; x < this.boardData.length; x++) {
            for (let y = 0; y < this.boardData[x].length; y++) {
                if (this.boardData[x][y] === null) {
                    let tileType = Square.returnRandomID();
                    let square = new Square(this, x, y, this.squareWidth, this.squareHeight, tileType);
                    this.boardData[x][y] = square;
                    this.allSquares.push(square);

                    square.draw();
                }
            }
        }
    }

    boardNotFilled() {
        for (let x = 0; x < this.boardData.length; x++) {
            for (let y = 0; y = this.boardData[x].length; y++) {
                if (this.boardData[x][y] === null) {
                    return false;
                }
            }
        }
        return false;
    }

    setActiveOn() {
        this.allSquares.forEach((square) => {
            if(square.setActive)
            square.setActive(true);
        })
    }
    setActiveOff() {
        this.allSquares.forEach((square) => {
            if(square.setActive)
            square.setActive(false);
        })
    }
}

export { Board };
