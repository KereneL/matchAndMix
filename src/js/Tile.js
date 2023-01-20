import Phaser from "phaser";

class Tile extends Phaser.GameObjects.Rectangle {
	constructor(scene, xIndex, yIndex, posX, posY, squareXpx, squareYpx, tileGraphicKey) {
		super(scene, posX, posY, tileGraphicKey)
		this.x = posX;
		this.y = posY;
		this.xIndex = xIndex;
		this.yIndex = yIndex;
		this.squareXpx = squareXpx;
		this.squareYpx = squareYpx;
		this.tileGraphicKey = tileGraphicKey
	}

	draw() {
		//console.log(this.x);
		let tileGO = this.scene.add.rectangle(this.x, this.y, this.squareXpx, this.squareYpx, 0x884422);
		console.log(this.x);
	}

}

export { Tile };
