module.exports = Input

const deltas = require('directions')
const { add, multiply } = require('vector2d')

function Input(game) {
	return { move }

	function move(entity, direction) {
		var delta = deltas[direction]
		if (delta) {
			entity.velocity = add(entity.velocity, multiply(delta, entity.speed))
			return true
		} else {
			return false
		}
	}
}
