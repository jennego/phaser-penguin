import Phaser from 'phaser'
import StateMachine from '../../state-machine/StateMachine'
import { sharedInstance as events } from './EventCenter'

type CursorKeys = Phaser.Types.Input.Keyboard.CursorKeys

export default class PlayerController {
  private sprite: Phaser.Physics.Matter.Sprite
  private stateMachine: StateMachine
  private cursors: CursorKeys

  constructor(sprite: Phaser.Physics.Matter.Sprite, cursors: CursorKeys) {
    this.sprite = sprite
    this.cursors = cursors
    this.createPenguinAnimations()
    this.stateMachine = new StateMachine(this, 'player')

    this.stateMachine
      .addState('idle', { onEnter: this.idleOnEnter, onUpdate: this.idleOnUpdate })
      .addState('walk', { onEnter: this.walkOnEnter, onUpdate: this.walkOnUpdate })
      .addState('jump', { onEnter: this.jumpOnEnter, onUpdate: this.jumpOnUpdate })
      .setState('idle')

    this.sprite.setOnCollide((data: MatterJS.ICollisionPair) => {
      const body = data.bodyB as MatterJS.BodyType
      const gameObject = body.gameObject

      if (gameObject instanceof Phaser.Physics.Matter.TileBody) {
        if (this.stateMachine.isCurrentState('jump')) {
          this.stateMachine.setState('idle')
        }
        return
      }
      const sprite = gameObject as Phaser.Physics.Matter.Sprite
      const type = sprite.getData('type')

      switch (type) {
        case 'star': {
          events.emit('star-collected')
          sprite.destroy()
          break
        }

        default:
          break
      }
    })
  }

  update(dt: number) {
    this.stateMachine.update(dt)
  }

  private idleOnEnter() {
    this.sprite.play('player-idle')
  }

  private idleOnUpdate() {
    if (this.cursors.left.isDown || this.cursors.right.isDown) {
      this.stateMachine.setState('walk')
    }

    const spaceBarJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.space)
    if (spaceBarJustPressed) {
      this.stateMachine.setState('jump')
    }
  }

  private walkOnEnter() {
    this.sprite.play('player-walk')
  }

  private walkOnUpdate() {
    const speed = 8
    if (this.cursors.left.isDown) {
      this.sprite.flipX = true
      this.sprite.setVelocityX(-speed)
    } else if (this.cursors.right.isDown) {
      this.sprite.flipX = false
      this.sprite.setVelocityX(speed)
    } else {
      this.sprite.setVelocityX(0)
      this.stateMachine.setState('idle')
    }
    const spaceBarJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.space)
    if (spaceBarJustPressed) {
      this.stateMachine.setState('jump')
    }
  }

  private jumpOnEnter() {
    this.sprite.setVelocityY(-14)
  }

  private jumpOnUpdate() {
    const speed = 8
    if (this.cursors.left.isDown) {
      this.sprite.flipX = true
      this.sprite.setVelocityX(-speed)
    } else if (this.cursors.right.isDown) {
      this.sprite.flipX = false
      this.sprite.setVelocityX(speed)
    } else {
      this.sprite.setVelocityX(0)
      this.stateMachine.setState('idle')
    }
    const spaceBarJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.space)
    if (spaceBarJustPressed) {
      this.stateMachine.setState('jump')
    }
  }

  private createPenguinAnimations() {
    this.sprite.anims.create({
      key: 'player-idle',
      frames: [{ key: 'penguin', frame: 'penguin_walk01.png' }]
    })
    this.sprite.anims.create({
      key: 'player-walk',
      frameRate: 10,
      frames: this.sprite.anims.generateFrameNames('penguin', {
        start: 1,
        end: 4,
        prefix: 'penguin_walk0',
        suffix: '.png'
      }),
      repeat: -1
    })
  }
}
