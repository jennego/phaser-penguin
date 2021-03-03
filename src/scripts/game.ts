import Phaser from 'phaser'

import HelloWorldScene from './scenes/HelloWorldScene'
import Game from './scenes/Game'

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'matter',
    matter: {
      debug: true
    }
  },
  scene: [Game]
}

export default new Phaser.Game(config)
