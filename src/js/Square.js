import Phaser from "phaser";

class Square extends Phaser.GameObjects.Container {
	// These could be initalized before, during Board init to show a different graphic theme, matching all tiles
	static theme = 	[
		{ primary: 0xb01030, graphic: "cherry" },
		{ primary: 0xff990f, graphic: "mango" },
		{ primary: 0xffc20e, graphic: "banana" },
		{ primary: 0x4dc518, graphic: "green-apple" },
		{ primary: 0x0658b6, graphic: "blueberries" },
		{ primary: 0x492778, graphic: "grapes" },
					];
	static strokePrprts = 	{	width:2,
								color: 0x000000,
								activeColor: 0xf3ff7d,
								hoverColor: 0xfff1e8
							};

	static returnRandomID() {
		let c = Math.floor(Math.random() * Square.theme.length);
		return c;
	}

	constructor(board, xIndex, yIndex, squareWidth, squareHeight, tileType) {
		let position = board.indicesToPosition(xIndex,yIndex);
		super(board.scene, position.x, -squareHeight)	//Init as Phaser.GameObjects.Container object

		this.board = board;								//pointer to parent board
		this.xIndex = xIndex;							//location of the piece on board - X index
		this.yIndex = yIndex;							//location of the piece on board - Y index
		this.width = squareWidth;							//width of the piece in pixels
		this.height = squareHeight;						//height of the piece in pixels

		this.typeID = tileType; 						//{0-5} (or depeneds on the board/game)
		this.colorSet = Square.theme[this.typeID];  	//{primary:hexdec-color,grahpic:string}
		this.selected = false;							// default behavior is start as unselected

		//create the actual square graphic
		this.square = new Phaser.GameObjects.Rectangle(this.scene, 0, 0, this.width, this.height, this.colorSet.primary);
		//give it a stroke
		this.square.setStrokeStyle(Square.strokePrprts.width, Square.strokePrprts.color);
		//also create the actual graphic
		this.sprite = new Phaser.GameObjects.Image(this.scene, 0, 0, this.colorSet.graphic);
		//add them both to this container
		this.add([this.square, this.sprite]);
	}

	draw() {
		this.activateSquare();
		this.scene.add.existing(this);
		this.assumePositionMove();
		console.log(`square [${this.xIndex},${this.yIndex}] created`);
	}

	activateSquare() {
		// apply mouse pointer listeners
		this.setInteractive();
		this.on('pointerdown', (pointer) => {
			this.onPointerDown();
		});
		this.on('pointerup', (pointer) => {
			this.onPointerUp();
		});
		this.on('pointerover', (pointer) => {
			this.onPointerOver();
		});

		this.on('pointerout', (pointer) => {
			this.onPointerOut();
		});
	}
	onPointerDown() {
		this.refreshColor();
	}
	onPointerUp() {
		// could be mouse click, but could be a tap or keyboard key press
		this.interactSquare();
	}
	onPointerOver() {
		// same
		this.hoverSqaure();
	}
	onPointerOut() {
		this.refreshColor();
	}

	interactSquare(){
		this.selected = true;
		this.refreshColor();
		this.board.selected(this);
	}
	hoverSqaure(){
		this.square.strokeColor = Square.strokePrprts.hoverColor;
	}
	refreshColor() {
		if (this.selected) {
			this.square.strokeColor = Square.strokePrprts.activeColor;
		} else {
			this.square.strokeColor = Square.strokePrprts.color;
		}
	}

	animateMove(ease) {
		let newPos = this.board.indicesToPosition(this.xIndex,this.yIndex);
		return new Promise((resolve) => {
			let tween =  this.scene.tweens.add({
				targets: this,
				x: newPos.x,
				y: newPos.y,
				duration: 500,
				ease: ease,
			})
			tween.on('complete', () => {
				this.depth = 0;
				resolve();
			});
		  });
	}

	swapMove() {
		this.animateMove('Power4');
	}
	fallMove() {
		this.animateMove('Power2');
	}
	assumePositionMove(){
		this.fallMove();
	}
}

export { Square };