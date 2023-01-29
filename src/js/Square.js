import Phaser from "phaser";

class Square extends Phaser.GameObjects.Container {
	constructor(board, xIndex, yIndex, posX, posY, squareXpx, squareYpx, tileGraphicKey) {
		super(board.scene, posX, posY, tileGraphicKey)
		this.board = board;
		this.x = posX;
		this.y = posY;
		this.xIndex = xIndex;
		this.yIndex = yIndex;
		this.selected = false;
		this.colorSet = this.returnRandomColor();


		this.strokePadding = 2;
		this.squareXpx = squareXpx//-this.strokePadding;
		this.squareYpx = squareYpx//-this.strokePadding;
		this.square = new Phaser.GameObjects.Rectangle(this.scene, 0, 0, this.squareXpx, this.squareYpx, this.colorSet.primary);
		this.square.setStrokeStyle(this.strokePadding, 0x000000);
		this.square.setInteractive();

		this.sprite = new Phaser.GameObjects.Image(this.scene,0,0,this.colorSet.graphic);

		this.add([this.square,this.sprite]);
	}

	draw() {
		this.scene.add.existing(this);
		//console.log(this);
		this.activateSquare();
	}

	activateSquare() {

		// Listeners
		this.square.on('pointerover', (pointer) => {
			this.square.setStrokeStyle(this.strokePadding, 0xFFF1E8);
		});

		this.square.on('pointerout', (pointer) => {
			this.refreshColor()
		});

		this.square.on('pointerup', (pointer) => {
			this.onClick();
			this.refreshColor()
		});

		this.square.on('pointerdown', (pointer) => {
			this.square.setStrokeStyle(this.strokePadding, 0xFFF1E8);
		});
	}

	onClick() {
		this.board.selected(this);

	}
	refreshColor() {
		if (this.selected)
		this.square.setStrokeStyle(this.strokePadding, 0xF3EF7D);
		else
		this.square.setStrokeStyle(this.strokePadding, 0x000000);
	}

	move(newLoction) {
		this.depth = 1;
		let timeline = this.scene.tweens.createTimeline();

		timeline.add({
			targets: this,
			x: newLoction.x,
			y: newLoction.y,
			ease: 'Ease',
			duration: 200
		});

		timeline.play();
		timeline.on('complete', () => {
			this.depth = 0;
			this.selected = false;
			this.refreshColor();
			this.board.clearSelection();
			this.board.setActiveOn();
		});
	}

	returnRandomColor() {
		let colors = [
			{ primary: 0xb01030, graphic: "cherry" },
			{ primary: 0xff990f, graphic: "mango" },
			{ primary: 0xffc20e, graphic: "banana" },
			{ primary: 0x4dc518, graphic: "green-apple" },
			{ primary: 0x0658b6, graphic: "blueberries" },
			{ primary: 0x492778, graphic: "grapes" },
		]

		let c = Math.floor(Math.random() * colors.length);
		return (colors[c]);
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