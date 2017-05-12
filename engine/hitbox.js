module.exports = Hitbox
Hitbox.Hitbox = Hitbox
Hitbox.left = left
Hitbox.top = top
Hitbox.right = right
Hitbox.bottom = bottom
Hitbox.intersects = intersects

function Hitbox(width, height) {
	return {
		width, height,
		position: null
	}
}

function left(hitbox) {
	return hitbox.position.x - hitbox.width / 2
}

function top(hitbox) {
	return hitbox.position.y - hitbox.height / 2
}

function right(hitbox) {
	return hitbox.position.x + hitbox.width / 2
}

function bottom(hitbox) {
	return hitbox.position.y + hitbox.height / 2
}

function intersects(hitbox, other) {
	return left(hitbox) < right(other) && top(hitbox) < bottom(other) && right(hitbox) > left(other) && bottom(hitbox) > top(other)
}
