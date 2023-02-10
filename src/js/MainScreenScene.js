import Phaser from "phaser"
import { Board } from "./Board";

class MainScreenScene extends Phaser.Scene {
	board
	constructor(boardConfig) {
		super({ key: "main-screen-scene" });

		//init values for boards
		this.colomns = boardConfig.colomns;
		this.rows = boardConfig.rows;
		this.squareWidth = boardConfig.squareWidth;
		this.squareHeight = boardConfig.squareHeight;
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
		let gameBackground = new Phaser.GameObjects.Rectangle(	this,
																this.scale.width / 2,
																this.scale.height / 2,
																this.scale.width,
																this.scale.height,
																0xd3f9bc);

		this.add.existing(gameBackground);
		this.boards.push(new Board(this, this.scale.width / 2, this.scale.height / 2, this.colomns, this.rows, this.squareWidth, this.squareHeight, this.gapPx));
		//this.boards.push(new Board(this, 300, 400, this.colomns, this.rows, this.squareWidth, this.squareHeight, this.gapPx));

		this.boards.forEach((board) => { board.draw() });

	}
	update(time, delta) {

	}
}

export { MainScreenScene };