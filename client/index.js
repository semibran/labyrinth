const socket = require('socket.io-client/dist/socket.io.js')()
const keys = require('keys')(window)
const { View, render } = require('./view')

const { Entity } = require('../engine/entity')
const { World, free } = require('../engine/world')
const { Game, Input, update } = require('../engine/game')
const { Seed, choose } = require('random')
const { remove } = require('array')
const { random } = Math

var state = {
 	game: null,
	entity: null
}

var game, entity, input
var entities = {}
var view = View()
document.body.appendChild(view.tree)
document.body.style.background = 'black'

socket.on('game', (data) => {
	for (var id in data.entities) {
		var index = data.entities[id]
		entities[id] = data.game.world.entities[index]
	}
	game = state.game = data.game
	entity = state.entity = entities[socket.id]
	input = Input(game)
	render(view, state)
	next()
})

socket.on('entity', (id, data) => {
	if (id in entities) {
		var entity = entities[id]
		Object.assign(entity, data)
	} else {
		var entity = entities[id] = data
		game.world.entities.push(entity)
	}
})

socket.on('leave', (id) => {
	remove(game.world.entities, entities[id])
	delete entities[id]
})

function loop() {
	if (keys.ArrowLeft || keys.KeyA) {
		input.move(entity, 'left')
		socket.emit('move', 'left')
	}
	if (keys.ArrowUp || keys.KeyW) {
		input.move(entity, 'up')
		socket.emit('move', 'up')
	}
	if (keys.ArrowRight || keys.KeyD) {
		input.move(entity, 'right')
		socket.emit('move', 'right')
	}
	if (keys.ArrowDown || keys.KeyS) {
		input.move(entity, 'down')
		socket.emit('move', 'down')
	}
	update(game)
	render(view, state)
	next()
}

function next() {
	requestAnimationFrame(loop)
}
