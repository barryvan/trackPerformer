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
		size: 1
	},
	
	_width: 0,
	_height: 0,
	_frame: 0,
	
	initialize: function(context, canvas, options) {
		this.parent(context, canvas, options);
		
		this.resize(this._canvas.width, this._canvas.height);
	},
	
	frame: function() {
		var step = this.options.spacing;
		for (var x = step; x < this._width; x += step) {
			for (var y = step; y < this._height; y += step) {
				this._context.fillStyle = this.options.colour;
				this._context.fillRect(x, y, this.options.size, this.options.size);
			}
		}
	},
	
	resize: function(width, height) {
		this._width = width;
		this._height = height;
	}
});