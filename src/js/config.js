import EaseMovePlugin from 'phaser3-rex-plugins/plugins/easemove-plugin.js';

const config = {
    type: Phaser.WEBGL,
    parent: 'app',
    width: "100%",
    height: "100%",
    autoRound: false,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    pixelArt: true,
    roundPixels: true,
    plugins: {
        global: [{
            key: 'rexEaseMove',
            plugin: EaseMovePlugin,
            start: true
        },]
    },
}

const boardConfig = {
    colomns: 8,
    rows: 8,
    squareWidth: 34,
    squareHeight: 34,
}

export { config, boardConfig };