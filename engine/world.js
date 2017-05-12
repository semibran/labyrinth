module.exports = World
World.World = World
World.snap = snap
World.free = free

const { floor } = Math

function World(width, height, scale) {
	return {
		width, height, scale,
		tiles: new Array(width * height),
		entities: []
	}
}

function snap(position, world) {
	return floor(position / world.scale)
}

function free(cell, world) {
	return (cell + 0.5) * world.scale
}
