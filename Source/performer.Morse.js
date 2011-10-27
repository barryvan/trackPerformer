barryvan.tp.performer.Morse = new Class({
	Implements: [Options],
	
	Extends: barryvan.tp.performer.Base,
	
	Binds: [
		'noteEvent',
		'frame',
		'tick',
		'resize'
	],
	
	options: {
		//colour: '#8ae234',
		colour: '#204a87',
		middle: 60,
		position: -100,
		thickness: 1,
		length: 2,
		size: 24,
		slope: 0.9,
		cutPower: 4
	},
	
	_n: 0,
	_x: 0,
	_y: 0,
	_baseline: 0,
	
	initialize: function(context, canvas, options) {
		this.parent(context, canvas, options);
		
		this.resize(this._canvas.width, this._canvas.height);
		
		this._y = this._baseline;
	},
	
	noteEvent: function(data) {
		if (data.note <= 0) {
			this._n = this._n * Math.pow(this.options.slope, this.options.cutPower);
			//this._n = this._n / 2;
			return;
		}
		
		if (this.filterNote(data.note)) {
			this._n = this._n + 1;
			if (data.note > this.options.middle) this._n = -Math.abs(this._n);
		}
	},
	
	frame: function() {
		var oldX = this._x,
				oldY = this._y;
		
		this._x = this._x + this.options.length;
		if (this._x > this._canvas.width) {
			this._x = 0;
			oldX = 0;
		}
		this._y = this._baseline + this.options.size * this._n;
		
		this._context.lineWidth = this.options.thickness;
		this._context.strokeStyle = this.options.colour;
		this._context.beginPath();
		this._context.moveTo(oldX, oldY);
		this._context.lineTo(this._x, this._y);
		this._context.closePath();
		this._context.stroke();
		
		// Move back to the normal position.
		if (this._n) {
			this._n = this._n * this.options.slope;
			if (this._y > -0.5 && this._y < 0.5) {
				this._n = 0;
			}
		}
	},
	
	resize: function(width, height) {
		if (this.options.position > 0) {
			this._baseline = this.options.position;
		} else {
			this._baseline = this._canvas.height + this.options.position;
		}
		this._baseline = Math.floor(this._baseline) + 0.5;
	},
});