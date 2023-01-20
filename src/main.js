import Phaser from 'phaser'
import { MainScreenScene } from './js/MainScreenScene'
import { config, mapConfig } from './js/config.js';


const game = new Phaser.Game(config);
const scene = new MainScreenScene(mapConfig);
game.scene.add('main-screen-scene', scene, true);
