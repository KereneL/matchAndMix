import Phaser from "phaser"
import { Board } from "./Board";

class MainScreenScene extends Phaser.Scene {
	board
	constructor(boardConfig) {
		super({ key: "main-screen-scene" });

		//init values for boards
		this.squaresX = boardConfig.squaresX;
		this.squaresY = boardConfig.squaresY;
		this.squareXpx = boardConfig.squareXpx;
		this.squareYpx = boardConfig.squareYpx;
		this.gapPx = 5;

		//create new board (have to have at least one)
		this.boards = [];
	}
	preload() {
		this.boards.push(new Board(this,300,300, this.squaresX,this.squaresY,this.squareXpx,this.squareYpx,this.gapPx));
	}
	create() {

		this.boards.forEach((board)=>{board.draw()});
	}
	update(time, delta) {

	}
}

export { MainScreenScene };