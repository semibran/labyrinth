module.exports = Entity
Entity.Entity = Entity
Entity.move = move

const { snap, free } = require('./world')
const { index } = require('grid')
const { add, multiply } = require('vector2d')
const { Hitbox, left, top, right, bottom, intersects } = require('./hitbox')

function Entity(width, height) {
	return {
		hitbox: Hitbox(width, height),
		velocity: { x: 0, y: 0 },
		speed: 0,
		bounce: 0
	}
}

function move(entity, delta, world) {
	var hitbox = entity.hitbox
	hitbox.position = add(hitbox.position, delta)
	if (world) {
		var wall = Hitbox(world.scale, world.scale)
		var bounds = {
			left: snap(left(hitbox), world),
			top: snap(top(hitbox), world),
			right: snap(right(hitbox), world),
			bottom: snap(bottom(hitbox), world)
		}
		for (var y = bounds.top; y <= bounds.bottom; y++) {
			for (var x = bounds.left; x <= bounds.right; x++) {
				var cell = { x, y }
				var tile = world.tiles[index(world, cell)]
				if (tile === 'wall') {
					wall.position = { x: free(cell.x, world), y: free(cell.y, world) }
					if (intersects(hitbox, wall)) {
						if (delta.x < 0) {
							hitbox.position.x = right(wall) + hitbox.width / 2
							entity.velocity.x *= -entity.bounce
						} else if (delta.x > 0) {
							hitbox.position.x = left(wall) - hitbox.width / 2
							entity.velocity.x *= -entity.bounce
						}
						if (delta.y < 0) {
							hitbox.position.y = bottom(wall) + hitbox.height / 2
							entity.velocity.y *= -entity.bounce
						} else if (delta.y > 0) {
							hitbox.position.y = top(wall) - hitbox.height / 2
							entity.velocity.y *= -entity.bounce
						}
					}
				}
			}
		}
		for (var other of world.entities) {
			if (entity !== other && intersects(hitbox, other.hitbox)) {
				if (delta.x < 0) {
					hitbox.position.x = right(other.hitbox) + hitbox.width / 2
					entity.velocity.x *= -entity.bounce
				} else if (delta.x > 0) {
					hitbox.position.x = left(other.hitbox) - hitbox.width / 2
					entity.velocity.x *= -entity.bounce
				}
				if (delta.y < 0) {
					hitbox.position.y = bottom(other.hitbox) + hitbox.height / 2
					entity.velocity.y *= -entity.bounce
				} else if (delta.y > 0) {
					hitbox.position.y = top(other.hitbox) - hitbox.height / 2
					entity.velocity.y *= -entity.bounce
				}
			}
		}
	}
}
