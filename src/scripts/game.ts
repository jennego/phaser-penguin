import Phaser from 'phaser'

import Game from './scenes/Game'
import UI from './scenes/UI'
import GameOver from './scenes/GameOver'
import ForestLevel from './scenes/ForestLevel'

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
  scene: [Game, UI, GameOver]
}

export default new Phaser.Game(config)
