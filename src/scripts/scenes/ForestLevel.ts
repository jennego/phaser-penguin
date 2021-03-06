import Phaser from 'phaser'
import PlayerController from './PlayerController'
import ObstaclesController from './ObsController'
import SnowmanController from './SnowmanController'

export default class ForestLevel extends Phaser.Scene {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private penguin?: Phaser.Physics.Matter.Sprite
  private playerController: PlayerController
  private obstacles!: ObstaclesController
  private snowmen: SnowmanController[] = []

  // private isTouchingGround = false

  constructor() {
    super('forest')
  }

  init() {
    this.cursors = this.input.keyboard.createCursorKeys()
    this.obstacles = new ObstaclesController()
    this.snowmen = []

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.destroy()
    })
  }

  preload() {
    this.load.image('background', 'assets/bg_single_1.png')

    this.load.atlas('penguin', 'assets/penguin.png', 'assets/penguin.json')
    this.load.image('tiles', 'assets/forest_tiles.png')
    this.load.tilemapTiledJSON('tilemap', 'assets/forest.json')

    this.load.image('star', 'assets/star.png')
    this.load.image('health', 'assets/health.png')

    // this.load.atlas('snowman', 'assets/snowman.png', 'assets/snowman.json')
  }
  create() {
    this.scene.launch('ui')
    // this.add.image(600, 500, 'background')

    const map = this.make.tilemap({ key: 'tilemap' })
    const tileset = map.addTilesetImage('forest_tiles', 'tiles')

    const ground = map.createLayer('ground', tileset)
    ground.setCollisionByProperty({ collides: true })

    map.createLayer('obstacles', tileset)

    this.matter.world.convertTilemapLayer(ground)
    // this.matter.world.setBounds(0, 0, 3500, 1050)

    this.penguin = this.matter.add.sprite(50, 70, 'penguin').setFixedRotation()

    this.playerController = new PlayerController(this, this.penguin, this.cursors, this.obstacles)

    this.cameras.main.startFollow(this.penguin)

    const objectsLayer = map.getObjectLayer('objects')

    // objectsLayer.objects.forEach((obj) => {
    //   const { x = 0, y = 0, name, width = 0, height = 0 } = obj

    //   switch (name) {
    //     case 'spawn': {
    //       this.penguin = this.matter.add.sprite(x, y, 'penguin').setFixedRotation()

    //       this.playerController = new PlayerController(this, this.penguin, this.cursors, this.obstacles)

    //       this.cameras.main.startFollow(this.penguin)
    //       break
    //     }

    //     case 'snowman': {
    //       const snowman = this.matter.add.sprite(x, y, 'snowman').setFixedRotation()
    //       this.snowmen.push(new SnowmanController(this, snowman))
    //       this.obstacles.add('snowman', snowman.body as MatterJS.BodyType)
    //       break
    //     }

    //     case 'star': {
    //       const star = this.matter.add.sprite(x, y, 'star', undefined, {
    //         isStatic: true,
    //         isSensor: true
    //       })
    //       star.setData('type', 'star')
    //       break
    //     }
    //     case 'health': {
    //       const health = this.matter.add.sprite(x, y, 'health', undefined, {
    //         isStatic: true,
    //         isSensor: true
    //       })
    //       health.setData('type', 'health')
    //       health.setData('healthPoints', 10)
    //       break
    //     }
    //     case 'spikes': {
    //       const spike = this.matter.add.rectangle(x + width * 0.5, y + height * 0.5, width, height, {
    //         isStatic: true
    //       })
    //       this.obstacles.add('spikes', spike)
    //       break
    //     }

    //     default:
    //       break
    //   }
    // })
  }

  update(t: number, dt: number) {
    this.playerController?.update(dt)
    // this.snowmen.forEach((snowman) => snowman.update(dt))
  }

  destroy() {
    this.scene.stop('ui')
    // this.snowmen.forEach((snowman) => snowman.destroy())
  }
}
