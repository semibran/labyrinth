const path = require('path').join(__dirname, '../client')
const server = require('server')(path).listen(8080)
const io = require('socket.io')(server)

const { Entity } = require('../engine/entity')
const { World, free } = require('../engine/world')
const { Game, Input, update } = require('../engine/game')
const { Seed, choose } = require('random')
const { remove } = require('array')
const { random } = Math

var seed = Seed(random())
var game = Game(49, 49)(seed)
var input = Input(game)

var entities = {}

next()

io.on('connection', socket => {
	var entity = entities[socket.id] = Entity(12, 12)
	var spawn = choose(game.world.spawns)(seed)
	entity.hitbox.position = { x: free(spawn.x, game.world), y: free(spawn.y, game.world) }
	entity.speed = 1 / 8
	entity.bounce = 1 / 3
	game.world.entities.push(entity)

	socket.broadcast.emit('entity', socket.id, entity)

	var indexes = {}
	var data = { game, entities: indexes }
	for (var id in entities) {
		var entity = entities[id]
		var index = game.world.entities.indexOf(entity)
		indexes[id] = index
	}

	socket.emit('game', data)

	socket.on('move', direction => {
		input.move(entity, direction)
		io.emit('entity', socket.id, entity)
	})

	socket.on('disconnect', _ => {
		delete entities[id]
		remove(game.world.entities, entity)
		socket.broadcast.emit('leave', socket.id)
	})
})

function loop () {
	update(game)
	next()
}

function next () {
	setTimeout(loop, 1000 / 60)
}
