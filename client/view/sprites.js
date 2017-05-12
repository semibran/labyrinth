module.exports = function render(size) {
	return {
		floor: function draw() {
			var canvas = document.createElement('canvas')
			canvas.width = size
			canvas.height = size

			var context = canvas.getContext('2d')
			context.fillStyle = 'white'
			context.fillRect(0, 0, canvas.width, canvas.height)

			return canvas
		}(),
		wall: function draw() {
			var canvas = document.createElement('canvas')
			canvas.width = size
			canvas.height = size

			var context = canvas.getContext('2d')
			context.fillStyle = 'black'
			context.fillRect(0, 0, canvas.width, canvas.height)

			return canvas
		}()
	}
}
