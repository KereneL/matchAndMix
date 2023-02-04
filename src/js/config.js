import EaseMovePlugin from 'phaser3-rex-plugins/plugins/easemove-plugin.js';

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
	  },
	plugins: {
        global: [{
            key: 'rexEaseMove',
            plugin: EaseMovePlugin,
            start: true
        },]
    },
}

const boardConfig = {
	colomns: 7,
	rows: 12,
	squareWidth: 34,
	squareHeight: 34,
}

export {config, boardConfig};