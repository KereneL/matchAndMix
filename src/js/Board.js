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
        this.boardBG = new Phaser.GameObjects.Rectangle(this.scene,this.x,this.y,this.width,this.height,0x442222);
        this.isInSelectMode = false;

        //Init Board
        this.boardData = [squaresX];
        for (let x = 0; x < squaresX; x++) {
            this.boardData[x] = [];
            for (let y = 0; y < squaresY; y++) {

                let tileType = 0;

                let posX = this.x - this.width / 2 +
                    (this.gapPx + this.squareXpx) * x +
                    this.gapPx + (this.squareXpx / 2);
                let posY = this.y - this.height / 2 +
                    (this.gapPx + this.squareYpx) * y +
                    this.gapPx + (this.squareYpx / 2);
                //console.log(this.x);
                let square = new Square(this, x, y, posX, posY, this.squareXpx, this.squareYpx, tileType)
                this.boardData[x][y] = square;
                this.allSquares.push(square);
            }
        }
    }

    draw() {
        this.scene.add.existing(this.boardBG);
        this.allSquares.forEach((tile) => {
            tile.draw();
        })

    }

    getTileAt(x, y) {
        if (x >= 0 && x < this.width &&
            y >= 0 && y < this.width) {
            return this.boardData[x][y];
        }
        return null;
    }

    selected(tile){
        tile.selected=true;
        if (this.firstSelected == null) {
            this.isInSelectMode = true;
            this.firstSelected = tile;
        } else {
            this.secondSelected = tile;
            this.switchTiles(this.firstSelected, this.secondSelected);
        }
    }

    clearSelection() {
        if (this.firstSelected.selected) {
            this.firstSelected.selected = false
        };
        this.firstSelected = null;
        if (this.secondSelected.selected) {
            this.secondSelected.selected = false
        };
        this.secondSelected = null;

        this.isInSelectMode = false;
    }

    switchTiles(first, second) {
        this.setActiveOff();
        let locationOne = {"x":first.x,"y":first.y};
        let locationTwo = {"x":second.x,"y":second.y};
        first.move(locationTwo);
        second.move(locationOne);

        let tempSquareRef =  this.boardData[first.xIndex][first.yIndex];
        this.boardData[first.xIndex][first.yIndex] = this.boardData[second.xIndex][second.yIndex];
        this.boardData[second.xIndex][second.yIndex] = tempSquareRef;
        this.clearSelection();
        this.setActiveOn();
    }

    setActiveOff(){
        this.allSquares.forEach((square)=>{
            square.setActive(false)
        })
    }
    setActiveOn(){
        this.allSquares.forEach((square)=>{
            square.setActive(true)
        })
    }
}

export { Board };
