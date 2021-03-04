import Phaser from 'phaser'
import PlayerController from './PlayerController'

export default class Game extends Phaser.Scene {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private penguin?: Phaser.Physics.Matter.Sprite
  private playerController: PlayerController
  // private isTouchingGround = false

  constructor() {
    super('game')
  }

  init() {
    this.cursors = this.input.keyboard.createCursorKeys()
  }

  preload() {
    this.load.atlas('penguin', 'assets/penguin.png', 'assets/penguin.json')
    this.load.image('tiles', 'assets/sheet.png')
    this.load.tilemapTiledJSON('tilemap', 'assets/game.json')
  }
  create() {
    // const { width, height } = this.scale
    // this.add.image(width * 0.5, height * 0.5, 'penguin')
    const map = this.make.tilemap({ key: 'tilemap' })
    const tileset = map.addTilesetImage('iceworld', 'tiles')

    const ground = map.createLayer('ground', tileset)
    ground.setCollisionByProperty({ collides: true })

    this.matter.world.convertTilemapLayer(ground)
    // this.matter.world.setBounds(0, 0, 3500, 1050)

    const objectsLayer = map.getObjectLayer('objects')

    objectsLayer.objects.forEach((obj) => {
      const { x = 0, y = 0, name } = obj

      switch (name) {
        case 'spawn':
          this.penguin = this.matter.add.sprite(x, y, 'penguin').setFixedRotation()

          this.playerController = new PlayerController(this.penguin, this.cursors)

          this.cameras.main.startFollow(this.penguin)
          break

        default:
          break
      }
    })
  }

  update(t: number, dt: number) {
    this.playerController.update(dt)
    if (!this.playerController) {
      return
    }
  }
}
