import Phaser from "phaser";
import { Tile } from "./Tile";

class Board extends Phaser.GameObjects.Rectangle {
    constructor(scene, posX, posY, squaresX, squaresY, squareXpx, squareYpx, gapPx) {
        super(scene, posX, posY);
        this.squaresX = squaresX;
        this.squaresY = squaresY;
        this.squareXpx = squareXpx;
        this.squareYpx = squareYpx;
        this.allTiles = [];
        this.gapPx = gapPx;
        this.width = squaresX * (squareXpx + gapPx) + gapPx;
        this.height = squaresY * (squareYpx + gapPx) + gapPx;

        //Init Board
        this.boardData = [squaresX];
        for (let x = 0; x < squaresX; x++) {
            this.boardData[x] = [];
            for (let y = 0; y < squaresY; y++) {

                let tileType = 0;

                let posX = this.x - this.width / 2 +
                    (this.gapPx + this.squareXpx) * x +
                    this.gapPx + (this.squareXpx/2);
                let posY = this.y - this.height / 2 +
                    (this.gapPx + this.squareYpx) * y +
                    this.gapPx + (this.squareYpx/2);
                //console.log(this.x);
                let tile = new Tile(this.scene, x, y, posX, posY, this.squareXpx, this.squareYpx, tileType)

                this.boardData[x][y] = tile;
                this.allTiles.push(tile);
            }
        }
    }

    draw() {

        let boardGO = this.scene.add.rectangle(this.x, this.y, this.width, this.height, 0x442222);
        this.allTiles.forEach((tile) => {
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

    switchTiles(first, second) {

    }
}

export { Board };
