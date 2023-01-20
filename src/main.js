import Phaser from 'phaser'
import { MainScreenScene } from './js/MainScreenScene'
import { config, boardConfig } from './js/config.js';


const game = new Phaser.Game(config);
const scene = new MainScreenScene(boardConfig);
game.scene.add('main-screen-scene', scene, true);
