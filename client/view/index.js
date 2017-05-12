module.exports = View
View.View = View
View.render = render

const sprites = require('./sprites')(16)
const html = require('bel')
const { index, cells } = require('grid')
const { left, top } = require('../../engine/hitbox')

function View() {
	var tiles = html`<canvas class='tiles'/>`
	var entities = html`<div class='entities'></div>`
	var cache = {
		tree: { tiles, entities },
		entities: new Map()
	}
	var tree = html`
		<main>
			${tiles}
			${entities}
		</main>
	`
	Object.assign(tree.style, {
		position: 'absolute',
		left: '50%',
		top: '50%',
		transform: 'translate(-50%, -50%)'
	})
	return { tree, cache }
}

function render(view, state) {
	var { tree, cache } = view
	var world = state.game.world

	var canvas = cache.tree.tiles
	canvas.style.imageRendering = 'pixelated'
	canvas.width = world.width * world.scale
	canvas.height = world.height * world.scale

	var context = canvas.getContext('2d')
	for (var cell of cells(world)) {
		var tile = world.tiles[index(world, cell)]
		var sprite = sprites[tile]
		if (sprite) {
			context.drawImage(sprite, cell.x * world.scale, cell.y * world.scale)
		}
	}

	for (var [entity, drawn] of cache.entities) {
		if (!world.entities.includes(entity)) {
			cache.entities.delete(entity)
			cache.tree.entities.removeChild(drawn)
		}
	}

	for (var entity of world.entities) {
		var drawn = cache.entities.get(entity)
		if (!drawn) {
			drawn = html`<div></div>`
			cache.entities.set(entity, drawn)
			cache.tree.entities.appendChild(drawn)
			Object.assign(drawn.style, {
				width: entity.hitbox.width + 'px',
				height: entity.hitbox.height + 'px',
				position: 'absolute',
				zIndex: entity === state.entity ? 1 : 0,
				background: entity === state.entity ? 'lime' : 'red'
			})
		}
		drawn.style.left = left(entity.hitbox) + 'px'
		drawn.style.top = top(entity.hitbox) + 'px'
	}
}
