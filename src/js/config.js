const config = {
	type: Phaser.WEBGL,
    autoRound: false,
	scale: {
        mode: Phaser.Scale.NONE,
        parent: 'app',
        width: 500,
        height: 500,
    },
	pixelArt: true,
	roundPixels: true,
	input: {
		activePointers: 5
	  }
}
const mapConfig = {
    //tilesetPath: "assets/colored-transparent-packed.png",
	tilesetPath: "./assets/MiniWorldSprites.png",
	tileSizeX: 16,
	tileSizeY: 16,
	mapSizeX: 32,
	mapSizeY: 32,
	mapEdgeGapRatio: 4,
	layers: ["terrain-layer", "set-layer", "items-layer", "units-layer"],
	mapData: {}
}

export {config, mapConfig};