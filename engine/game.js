module.exports = Game
Game.Game = Game
Game.update = update
Game.Input = require('./input')

const { World } = require('./world')
const { Entity, move } = require('./entity')
const { Dungeon } = require('dungeon')
const { Seed } = require('random')
const { index, cells } = require('grid')
const { add, multiply, equals } = require('vector2d')
const scale = 16

function Game(width, height) {
	return function generate(seed) {
		var dungeon = Dungeon(width, height)(seed)
		var world = World(width, height, scale)
		world.tiles.fill('wall')
		world.spawns = []

		for (var room of dungeon.rooms) {
			for (var cell of cells(room).map(cell => add(cell, room))) {
				world.tiles[index(world, cell)] = 'floor'
				world.spawns.push(cell)
			}
		}

		for (var maze of dungeon.mazes) {
			for (var cell of maze) {
				world.tiles[index(world, cell)] = 'floor'
			}
		}

		for (var cell of dungeon.doors) {
			world.tiles[index(world, cell)] = 'floor'
		}



		return { world }
	}
}

function update(game) {
	for (var entity of game.world.entities) {
		if (entity.velocity.x) {
			move(entity, { x: entity.velocity.x, y: 0 }, game.world)
		}
		if (entity.velocity.y) {
			move(entity, { x: 0, y: entity.velocity.y }, game.world)
		}
		entity.velocity = multiply(entity.velocity, 0.9)
	}
}
