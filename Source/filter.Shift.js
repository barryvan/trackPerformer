/* Swap horizontal lines of the canvas */
barryvan.tp.filter.Shift = new Class({
	Implements: [Options],
	
	Extends: barryvan.tp.filter.Base,
	
	Binds: [
		'updateOpts',
		'frame',
		'resize'
	],
	
	options: {
		x: 0,
		y: 1,
		randomiseSign: 0
	},
	
	_width: 0,
	_height: 0,
	_frame: 0,
	_imageData: null,
	
	_iteration: 0,
	
	initialize: function(context, canvas, options) {
		this.parent(context, canvas, options);
		
		this.resize(this._canvas.width, this._canvas.height);
	},
	
	updateOpts: function(options) {
		this.options = Object.merge(this.options, options);
	},
	
	frame: function() {
		var x = this.options.x,
				y = this.options.y,
				randomiseSign = this.options.randomiseSign,
				cdata;
		
		if (this.options.randomiseSign) {
			if (Math.random() < randomiseSign) x = -x;
			if (Math.random() < randomiseSign) y = -y;
		}
		
		cdata = this._context.getImageData(0, 0, this._width, this._height);
		this._context.putImageData(cdata, x, y);
	},
	
	resize: function(width, height) {
		this._width = width;
		this._height = height;
	}
});