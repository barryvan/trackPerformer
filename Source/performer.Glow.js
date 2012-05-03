barryvan.tp.performer.Glow = new Class({
	Implements: [Options],
	
	Extends: barryvan.tp.performer.Base,
	
	Binds: [
		'updateOpts',
		'frame',
		'noteEvent'
	],
	
	options: {
		size: 20,
		decay: 2,
		colour: '#204a87',
		template: '0 0 {size}px {colour}',
		velocity: {
			size: true,
			opacity: false
		}
	},
	
	_currentSize: 0,
	_currentOpacity: 0,
	_colourPart: 0,
	
	initialize: function(context, canvas, options) {
		this.parent(context, canvas, options);
		
		this._colourPart = 'rgba(' + (new Color(this.options.colour)).join(',') + ',';
	},
	
	updateOpts: function(options) {
		this.options = Object.merge(this.options, options);
		this._colourPart = 'rgba(' + (new Color(this.options.colour)).join(',') + ',';
	},
	
	frame: function() {
		var shadow = 'none';
		if (this._currentSize && this._currentOpacity) {
			shadow = this.options.template;
			shadow = shadow.replace(/\{size\}/g, this._currentSize);
			shadow = shadow.replace(/\{colour\}/g, this._colourPart + this._currentOpacity + ')');
		}
		
		this._canvas.setStyle('box-shadow', shadow);
		
		if (this._currentSize) this._currentSize -= this.options.decay;
	},
	
	noteEvent: function(data) {
		if (data.note < 0) {
			// Note cut / note off
			return;
		}
		
		if (!this.filterNote(data)) return;
		
		var multiplier = (data.volume === undefined ? 64 : data.volume) / 64;
		if (this.options.velocity.size) {
			this._currentSize = this.options.size * multiplier;
		} else {
			this._currentSize = this.options.size;
		}
		if (this.options.velocity.opacity) {
			this._currentOpacity = multiplier;
		} else {
			this._currentOpacity = 1;
		}
	}
});