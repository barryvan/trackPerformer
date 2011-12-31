barryvan.tp.performer.ShimmerGrid = new Class({
	Implements: [Options],
	
	Extends: barryvan.tp.performer.Base,
	
	Binds: [
		'noteEvent',
		'resize',
		'frame'
	],
	
	options: {
		colour: '#ccc',
		spacing: 32,
		size: 1,
		probability: 0.2,
		vitalisation: 50,
		opacity: 0.25,
		jitter: 1,
		offset: null
	},
	
	_vitality: 0,
	
	initialize: function(context, canvas, options) {
		this.parent(context, canvas, options);
		
		this.resize(this._canvas.width, this._canvas.height);
		
		this._colourPart = 'rgba(' + (new Color(this.options.colour)).join(',') + ',';
		
		if (this.options.offset === null) {
			this.options.offset = Math.floor(this.options.spacing / 3);
		}
	},
	
	resize: function(width, height) {
		this._width = width;
		this._height = height;
	},
	
	noteEvent: function(data) {
		if (!this.filterNote(data.note)) return;
		
		if (data.note < 0) {
			this._vitality = this._vitality / 2;
			return;
		}
		
		this._vitality = this.options.vitalisation;
	},
	
	frame: function() {
		if (!this._vitality) return;
		
		var jitterMult = this.options.jitter * 2 + 1,
				step = this.options.spacing,
				x, y, jitterX, jitterY;
		
		for (x = this.options.offset; x < this._width; x += step) {
			for (y = this.options.offset; y < this._height; y += step) {
				if (Math.random() < this.options.probability) {
					
					this._context.fillStyle = this._colourPart + (((Math.random() / 2) + 0.5) * (this._vitality / this.options.vitalisation) * this.options.opacity) + ')';
					
					jitterX = x + Math.floor((Math.random() * this.options.jitter) - (this.options.jitter / 2));
					jitterY = y + Math.floor((Math.random() * this.options.jitter) - (this.options.jitter / 2));
					
					this._context.fillRect(jitterX, jitterY, this.options.size, this.options.size);
				}
			}
		}
		
		this._vitality -= 1;
		if (this._vitality < 0) this._vitality = 0;
	}
});


