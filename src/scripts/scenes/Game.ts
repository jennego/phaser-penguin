import Phaser from 'phaser'

export default class Game extends Phaser.Scene {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private penguin!: Phaser.Physics.Matter.Sprite
  private isTouchingGround = false

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
    this.createPenguinAnimations()
    // const { width, height } = this.scale
    // this.add.image(width * 0.5, height * 0.5, 'penguin')
    const map = this.make.tilemap({ key: 'tilemap' })
    const tileset = map.addTilesetImage('iceworld', 'tiles')

    const ground = map.createLayer('ground', tileset)
    ground.setCollisionByProperty({ collides: true })

    this.matter.world.convertTilemapLayer(ground)

    const objectsLayer = map.getObjectLayer('objects')

    objectsLayer.objects.forEach((obj) => {
      const { x = 0, y = 0, name } = obj

      switch (name) {
        case 'spawn':
          this.penguin = this.matter.add.sprite(x, y, 'penguin').play('player-idle').setFixedRotation()

          this.penguin.setOnCollide((data: MatterJS.ICollisionPair) => {
            this.isTouchingGround = true
          })

          this.cameras.main.startFollow(this.penguin)
          break

        default:
          break
      }
    })
  }

  update() {
    if (!this.penguin) {
      return
    }
    const speed = 10
    if (this.cursors.left.isDown) {
      this.penguin.flipX = true
      this.penguin.setVelocityX(-speed)
      this.penguin.play('player-walk', true)
    } else if (this.cursors.right.isDown) {
      this.penguin.flipX = false
      this.penguin.setVelocityX(speed)
      this.penguin.play('player-walk', true)
    } else {
      this.penguin.setVelocityX(0)
      this.penguin.play('player-idle', true)
    }

    const spaceBarJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.space)
    if (spaceBarJustPressed && this.isTouchingGround) {
      this.penguin.setVelocityY(-15)
      this.isTouchingGround = false
    }
  }

  private createPenguinAnimations() {
    this.anims.create({
      key: 'player-idle',
      frames: [{ key: 'penguin', frame: 'penguin_walk01.png' }]
    })
    this.anims.create({
      key: 'player-walk',
      frameRate: 10,
      frames: this.anims.generateFrameNames('penguin', {
        start: 1,
        end: 4,
        prefix: 'penguin_walk0',
        suffix: '.png'
      }),
      repeat: -1
    })
  }
}
