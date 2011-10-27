barryvan.tp.performer.Oscillator = new Class({
	Implements: [Options],
	
	Extends: barryvan.tp.performer.Base,
	
	Binds: [
		'noteEvent',
		'resize'
	],
	
	options: {
		//colour: '#fcaf3e',
		colour: '#729fcf',
		vertical: 32,
		horizontal: 32,
		length: 48,
		middle: 60,
		thickness: 8,
		stepSize: 8
	},
	
	initialize: function(context, canvas, options) {
		this.parent(context, canvas, options);
		
		this.resize(this._canvas.width, this._canvas.height);
	},
	
	noteEvent: function(data) {
		if (data.note < 0) {
			// Note cut / note off
			return;
		}
		
		var n = this.options.middle - data.note;
		var y = this._centre + (n * this.options.stepSize) - (this.options.thickness / 2);
		
		this._context.fillStyle = this.options.colour;
		this._context.fillRect(this._left, y, this.options.length, this.options.thickness);
	},
	
	resize: function(width, height) {
		this._left = (this.options.horizontal > 0 ? this.options.horizontal : (width + this.options.horizontal - this.options.length));
		this._top = Math.abs(this.options.vertical);
		this._bottom = height - this._top;
		
		this._centre = (this._bottom - this._top) / 2;
	}
});