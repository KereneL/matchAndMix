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
		this.gapPx = 6;

		//create new board (have to have at least one)
		this.boards = [];
	}
	preload() {

		this.load.image("cherry", "fruit_sprites/cherry.png");
		this.load.image("mango", "fruit_sprites/mango.png");
		this.load.image("banana", "fruit_sprites/banana.png");
		this.load.image("green-apple", "fruit_sprites/greenapple.png");
		this.load.image("blueberries", "fruit_sprites/blueberries.png");
		this.load.image("grapes", "fruit_sprites/grapes.png");
	}
	create() {
		let boardBG = new Phaser.GameObjects.Rectangle(this, 300, 300, 600, 600, 0xd3f9bc);
		this.add.existing(boardBG);
		this.boards.push(new Board(this, 300, 300, this.squaresX, this.squaresY, this.squareXpx, this.squareYpx, this.gapPx));

		this.boards.forEach((board) => { board.draw() });

	}
	update(time, delta) {

	}
}

export { MainScreenScene };