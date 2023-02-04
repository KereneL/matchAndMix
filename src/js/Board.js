import Phaser from "phaser";
import { Square } from "./Square";

class Board extends Phaser.GameObjects.Container {
    constructor(scene, posX, posY, squaresX, squaresY, squareXpx, squareYpx, gapPx) {
        super(scene, posX, posY);
        this.squaresX = squaresX;
        this.squaresY = squaresY;
        this.squareXpx = squareXpx;
        this.squareYpx = squareYpx;
        this.allSquares = [];
        this.gapPx = gapPx;
        this.width = squaresX * (squareXpx + gapPx) + gapPx;
        this.height = squaresY * (squareYpx + gapPx) + gapPx;
        this.boardBG = new Phaser.GameObjects.Rectangle(this.scene, this.x, this.y, this.width, this.height, 0x885237);
        this.boardBG.setStrokeStyle(3, 0x000000);
        this.isInSelectMode = false;

        //Init Board
        this.initBoard();
    }

    initBoard() {
        this.boardData = [this.squaresX];
        for (let x = 0; x < this.squaresX; x++) {
            this.boardData[x] = [];
            for (let y = 0; y < this.squaresY; y++) {
                let tileType = Square.returnRandomID();
                let square = new Square(this, x, y, this.squareXpx, this.squareYpx, tileType)
                this.boardData[x][y] = square;
                this.allSquares.push(square);
            }
        }
    }

    draw() {
        this.scene.add.existing(this.boardBG);
        this.allSquares.forEach((square) => {
            square.draw();
        });
        this.comboLoop(this.checkForCombos());
    }

    indeciesToPosition(x,y) {
        if (x < 0 || x >= this.width ||
            y < 0 || y >= this.width) {
                return null;            
        }

        let posX = this.x - this.width / 2 +
        (this.gapPx + this.squareXpx) * x +
        this.gapPx + (this.squareXpx / 2);

        let posY = this.y - this.height / 2 +
        (this.gapPx + this.squareYpx) * y +
        this.gapPx + (this.squareYpx / 2);

        return {"x":posX,"y":posY}
    }

    selected(square) {
        //console.log(`x:  ${square.xIndex}(), y: ${square.yIndex}, type: ${square.colorSet.graphic}`)
        //console.log(`boardData: (${this.boardData[square.xIndex][square.yIndex].colorSet.graphic})`)
        square.selected = true;
        square.refreshColor();

        // Is it the first selected square for this move or the second? if it's the second - attemp move;
        if (this.firstSelected == null) {
            this.isInSelectMode = true;
            this.firstSelected = square;
        } else {
            this.secondSelected = square;
            this.attemptMove(this.firstSelected, this.secondSelected);
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
        //console.log(`First move Combos: ${combos.length}`);
        //console.log(combos);

        // Swap back after failed attempt
        if (combos.length === 0) {
            console.log(`no combos found :(`);
            this.switchSquaresOnBoard(second, first)  
            this.clearSelection();
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

    swapMoveAndAnimate(first, second){
        // but if the move succeeds -
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
        second.swapMove(positionOne);
    }

    comboLoop(combosOfAttempt){
        let combos = combosOfAttempt;
        while (combos.length > 0) {
            let toRemove = [];
            combos.forEach((combo) => {
                combo.forEach((square) => {
                    if (!toRemove.includes(square)) { toRemove.push(square) };
                })
            })

            toRemove.forEach((square) => {
                this.allSquares.splice(0,1,this.allSquares.indexOf(square));
                this.boardData[square.xIndex][square.yIndex].destroy();
                this.boardData[square.xIndex][square.yIndex] = null;
            });

            this.fallDown();
            combos = this.checkForCombos();
            //console.log(`Next combos: ${combos.length}`);
            //console.log(combos);
        }
    }

    clearSelection() {
        if (this.firstSelected) {
            this.firstSelected.selected = false;
            this.firstSelected.refreshColor();
        };
        this.firstSelected = null;

        if (this.secondSelected) {
            this.secondSelected.selected = false;
            this.secondSelected.refreshColor();
        };
        this.secondSelected = null;

        this.isInSelectMode = false;
    }

    checkForCombos() {
        let combos = [];
        for (let row = 0; row < this.squaresX; row++) {
            for (let col = 0; col < this.squaresY; col++) {
                if (this.boardData[row][col] == null) { break }

                let currentSquare = this.boardData[row][col];
                let currentType = currentSquare.typeID;

                // check horizontally
                let combo = [currentSquare];
                for (let x = row + 1; x < this.squaresX; x++) {
                    if (this.boardData[x][col] == null) { break; }
                    if (this.boardData[x][col].typeID === currentType) {
                        combo.push(this.boardData[x][col]);
                    } else {
                        break;
                    }
                }
                if (combo.length >= 3) {
                    combos.push(combo);
                }

                combo = [currentSquare];
                // check vertically
                for (let y = col + 1; y < this.squaresY; y++) {
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
        console.log(`${combos.length}`);
        return combos;
    }

    fallDown() {
        for (let x = 0; x < this.boardData.length; x++) {
            let destY = this.boardData[x].length - 1;
            
            for (let y = this.boardData[x].length - 1; y >= 0; y--) {
                if (this.boardData[x][y] !== null) {
                    if (destY !== y) {
                        this.boardData[x][destY] = this.boardData[x][y];

                        let posY = this.y - this.height / 2 +
                            (this.gapPx + this.squareYpx) * destY +
                            this.gapPx + (this.squareYpx / 2);

                        this.boardData[x][destY].yIndex=destY;
                        this.boardData[x][destY].fallMove(posY);

                        this.boardData[x][y] = null;
                    }
                    destY--;
                }
            }
        }
        this.refillBoard();
    }

    refillBoard() {
        for (let x = 0; x < this.boardData.length; x++) {
            for (let y = 0; y < this.boardData[x].length; y++) {
                if (this.boardData[x][y] === null) {
                    let tileType = Square.returnRandomID();
                    let square = new Square(this, x, y, this.squareXpx, this.squareYpx, tileType);
                    this.boardData[x][y] = square;
                    this.allSquares.push(square);

                    square.draw();
                }
            }
        }
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
