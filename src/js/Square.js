import Phaser from "phaser";

class Square extends Phaser.GameObjects.Container {
	// These would be Initalized later during Board construction
	static theme = [
		{ primary: 0xb01030, graphic: "cherry" },
		{ primary: 0xff990f, graphic: "mango" },
		{ primary: 0xffc20e, graphic: "banana" },
		{ primary: 0x4dc518, graphic: "green-apple" },
		{ primary: 0x0658b6, graphic: "blueberries" },
		{ primary: 0x492778, graphic: "grapes" },
	];
	static strokeWidth = 2;
	static returnRandomID() {
		let c = Math.floor(Math.random() * Square.theme.length);
		return c;
	}

	constructor(board, xIndex, yIndex, posX, posY, squareXpx, squareYpx, tileType) {
		super(board.scene, posX, posY)	//Init as Phaser.GameObjects.Container object

		this.board = board;								//pointer to parent board
		this.xIndex = xIndex;							//location of the piece on board - X index
		this.yIndex = yIndex;							//location of the piece on board - Y index
		this.x = posX;									//location of the piece in world, in pixels - X coordinates
		this.y = posY;									//location of the piece in world, in pixels - Y coordinates
		this.width = squareXpx;							//width of the piece in pixels
		this.height = squareYpx;						//height of the piece in pixels

		this.selected = false;							// default behavior is start as unselected
		this.typeID = tileType; 						//{0-5} (or depeneds on the board/game)
		this.colorSet = Square.theme[this.typeID];  	//{primary:hexdec-color,grahpic:string}

		this.square = new Phaser.GameObjects.Rectangle(this.scene, 0, 0, this.width, this.height, this.colorSet.primary);
		this.square.setStrokeStyle(Square.strokeWidth, 0x000000);
		this.sprite = new Phaser.GameObjects.Image(this.scene, 0, 0, this.colorSet.graphic);
		this.add([this.square, this.sprite]);
	}

	draw() {
		this.activateSquare();
		this.scene.add.existing(this);
	}

	activateSquare() {
		// Listeners
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
		this.board.selected(this);
		this.refreshColor();
	}
	onPointerOver() {
		this.square.setStrokeStyle(Square.strokeWidth, 0xFFF1E8);
	}
	onPointerOut() {
		this.refreshColor();
	}

	refreshColor() {
		if (this.selected)
			this.square.setStrokeStyle(Square.strokeWidth, 0xF3EF7D);
		else
			this.square.setStrokeStyle(Square.strokeWidth, 0x000000);
	}

	animateMove(newLocation, ease) {
		this.depth = 1;
		let tween = this.scene.tweens.add({
			targets: this,
			x: newLocation.x,
			y: newLocation.y,
			duration: 500,
			"ease": ease,
		});
		tween.on('complete', () => {
			this.depth = 0;
		});
	}
	swapMove(newLocation) {
		this.animateMove(newLocation,'Phaser.Math.Easing.Elastic.InOut');
		this.endMove();
	}
	fallMove(newPosY) {
		let newLocation = {x: this.x, y:newPosY};
		this.animateMove(newLocation,'Phaser.Math.Easing.Elastic.InOut');
		this.endMove();
	}
	endMove(){
		this.selected = false;
		this.refreshColor();
		this.board.clearSelection();
	}
}

export { Square };
// Fruits:
// Cherry			#b01030
// Mango			#ff990f
// Banana 			#ffc20e
// Green Apple 		#4dc518
// Blueberries		#0658b6
// Grapes			#492778

// PICO-8 Pallete
// Index Color 		Hex 		RGB 			Name
// 0 				#000000 	0, 0, 0 		black
// 1 				#1D2B53 	29, 43, 83 		dark-blue
// 2 				#7E2553 	126, 37, 83 	dark-purple
// 3 				#008751 	0, 135, 81 		dark-green
// 4 				#AB5236 	171, 82, 54 	brown
// 5 				#5F574F 	95, 87, 79 		dark-grey
// 6 				#C2C3C7 	194, 195, 199 	light-grey
// 7 				#FFF1E8 	255, 241, 232 	white
// 8 				#FF004D 	255, 0, 77 		red
// 9 				#FFA300 	255, 163, 0 	orange
// 10 				#FFEC27 	255, 236, 39 	yellow
// 11 				#00E436 	0, 228, 54 		green
// 12 				#29ADFF 	41, 173, 255 	blue
// 13 				#83769C 	131, 118, 156 	lavender
// 14 				#FF77A8 	255, 119, 168 	pink
// 15 				#FFCCAA 	255, 204, 170 	light-peach
// PICO-8 Inverse
// 128 / -16 		#291814 	41,24,20 		brownish-black
// 129 / -15 		#111D35 	17,29,53 		darker-blue
// 130 / -14 		#422136 	66,33,54 		darker-purple
// 131 / -13 		#125359 	18,83,89 		blue-green
// 132 / -12 		#742F29 	116,47,41 		dark-brown
// 133 / -11 		#49333B 	73,51,59 		darker-grey
// 134 / -10 		#A28879 	162,136,121 	medium-grey
// 135 / -9 		#F3EF7D 	243,239,125 	light-yellow
// 136 / -8 		#BE1250 	190,18,80 		dark-red
// 137 / -7 		#FF6C24 	255,108,36 		dark-orange
// 138 / -6 		#A8E72E 	168,231,46 		lime-green
// 139 / -5 		#00B543 	0,181,67 		medium-green
// 140 / -4 		#065AB5 	6,90,181 		true-blue
// 141 / -3 		#754665 	117,70,101 		mauve
// 142 / -2 		#FF6E59 	255,110,89 		dark-peach
// 143 / -1 		#FF9D81 	255,157,129 	peach 