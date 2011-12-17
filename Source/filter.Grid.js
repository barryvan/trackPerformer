barryvan.tp.filter.Grid = new Class({
	Implements: [Options],
	
	Extends: barryvan.tp.filter.Base,
	
	Binds: [
		'frame',
		'resize'
	],
	
	options: {
		colour: 'rgba(0,0,0,0.1)',
		spacing: 32,
		size: 1,
		lined: false
	},
	
	_width: 0,
	_height: 0,
	_frame: 0,
	
	initialize: function(context, canvas, options) {
		this.parent(context, canvas, options);
		
		this.resize(this._canvas.width, this._canvas.height);
	},
	
	frame: function() {
		var stepX = this.options.spacing.x || this.options.spacing;
		var stepY = this.options.spacing.y || this.options.spacing;
		var fromX = 0, fromY = 0;
		if (this.options.lined) {
			this._context.lineWidth = this.options.size;
			this._context.strokeStyle = this.options.colour;
			this._context.beginPath();
			for (var x = stepX + 0.5; x < this._width; x += stepX) {
				this._context.moveTo(x, 0);
				this._context.lineTo(x, this._height);
			}
			for (var y = stepY + 0.5; y < this._height; y += stepY) {
				this._context.moveTo(0, y);
				this._context.lineTo(this._width, y);
			}
			this._context.stroke();
		} else {
			this._context.fillStyle = this.options.colour;
			for (var x = stepX; x < this._width; x += stepX) {
				for (var y = stepY; y < this._height; y += stepY) {
					this._context.fillRect(x, y, this.options.size, this.options.size);
				}
			}
		}
	},
	
	resize: function(width, height) {
		this._width = width;
		this._height = height;
	}
});