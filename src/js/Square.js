import Phaser from "phaser";

class Square extends Phaser.GameObjects.Container {
	constructor(board, xIndex, yIndex, posX, posY, squareXpx, squareYpx, tileGraphicKey) {
		super(board.scene, posX, posY, tileGraphicKey)
		this.board = board;
		this.x = posX;
		this.y = posY;
		this.xIndex = xIndex;
		this.yIndex = yIndex;
		this.squareXpx = squareXpx;
		this.squareYpx = squareYpx;
		this.selected = false;
		this.colorSet = this.returnRandomColor();
		this.square = new Phaser.GameObjects.Rectangle(this.scene,this.x,this.y,this.squareXpx,this.squareYpx,this.colorSet.primary);
		this.square.setStrokeStyle(2,0x111111);
		this.square.setInteractive();
	}

	draw() {
		this.square = this.scene.add.existing(this.square);
		//console.log(this);
		this.activateSquare();
	}

	refreshColor(){
		if (this.selected)
		this.square.fillColor=this.colorSet.highlight
		else
		this.square.fillColor=this.colorSet.primary
	}

	activateSquare(){
		this.square.on('pointerover', (pointer) => {
			this.square.fillColor=this.colorSet.highlight;
		});

		this.square.on('pointerout', (pointer) => {
			this.refreshColor()
		});

		this.square.on('pointerup',  (pointer) => {
			this.square.fillColor=this.colorSet.primary;
			this.onClick();
			
		});
		
		this.square.on('pointerdown', (pointer) => {
			this.square.fillColor=this.colorSet.highlight;
		});
	}

	onClick(){
		this.board.selected(this);
		
	}

	move(newLoction){
		this.square.depth = 1;
		let timeline = this.scene.tweens.createTimeline();
		this.x = newLoction.x;
		this.y = newLoction.y;

		timeline.add({
			targets: this.square,
			x: newLoction.x,
			ease: 'Power1',
			duration: 100
		});
	
		timeline.add({
			targets: this.square,
			y: newLoction.y,
			ease: 'Power1',
			duration: 100
		});
		timeline.play();
		timeline.on('complete', ()=> {
			this.square.depth = 0;
			this.refreshColor()
		});
	}

	returnRandomColor(){
		let colors = [{primary:0xFF004D, highlight: 0xBE1250},
		{primary:0x00E436, highlight: 0x00B543},
		{primary:0x29ADFF, highlight: 0x065AB5},
		{primary:0xFFA300, highlight: 0xFF6C24},
		{primary:0xFF77A8, highlight: 0x754665},
		{primary:0xFFCCAA, highlight: 0xFF6E59}]
		
		let c = Math.floor(Math.random()*colors.length);
		return(colors[c]);
	}
}

export { Square };




// Index 	Color 	Hex 	RGB 	Name
// 0 		#000000 	0, 0, 0 	black
// 1 		#1D2B53 	29, 43, 83 	dark-blue
// 2 		#7E2553 	126, 37, 83 	dark-purple
// 3 		#008751 	0, 135, 81 	dark-green
// 4 		#AB5236 	171, 82, 54 	brown
// 5 		#5F574F 	95, 87, 79 	dark-grey
// 6 		#C2C3C7 	194, 195, 199 	light-grey
// 7 		#FFF1E8 	255, 241, 232 	white
// 8 		#FF004D 	255, 0, 77 	red
// 9 		#FFA300 	255, 163, 0 	orange
// 10 		#FFEC27 	255, 236, 39 	yellow
// 11 		#00E436 	0, 228, 54 	green
// 12 		#29ADFF 	41, 173, 255 	blue
// 13 		#83769C 	131, 118, 156 	lavender
// 14 		#FF77A8 	255, 119, 168 	pink
// 15 		#FFCCAA 	255, 204, 170 	light-peach 
// Index 	Color 	Hex 	RGB 	Name
// 128 / -16 		#291814 	41,24,20 	brownish-black
// 129 / -15 		#111D35 	17,29,53 	darker-blue
// 130 / -14 		#422136 	66,33,54 	darker-purple
// 131 / -13 		#125359 	18,83,89 	blue-green
// 132 / -12 		#742F29 	116,47,41 	dark-brown
// 133 / -11 		#49333B 	73,51,59 	darker-grey
// 134 / -10 		#A28879 	162,136,121 	medium-grey
// 135 / -9 		#F3EF7D 	243,239,125 	light-yellow
// 136 / -8 		#BE1250 	190,18,80 	dark-red
// 137 / -7 		#FF6C24 	255,108,36 	dark-orange
// 138 / -6 		#A8E72E 	168,231,46 	lime-green
// 139 / -5 		#00B543 	0,181,67 	medium-green
// 140 / -4 		#065AB5 	6,90,181 	true-blue
// 141 / -3 		#754665 	117,70,101 	mauve
// 142 / -2 		#FF6E59 	255,110,89 	dark-peach
// 143 / -1 		#FF9D81 	255,157,129 	peach 