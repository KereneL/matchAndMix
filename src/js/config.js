const config = {
	type: Phaser.WEBGL,
    autoRound: false,
	scale: {
        //mode: Phaser.Scale.NONE,
        parent: 'app',
        width: 600,
        height: 600,
    },
	pixelArt: true,
	roundPixels: true,
	input: {
		activePointers: 4
	  }
}
const boardConfig = {
	squaresX: 12,
	squaresY: 7,
	squareXpx: 32,
	squareYpx: 32
}

export {config, boardConfig};