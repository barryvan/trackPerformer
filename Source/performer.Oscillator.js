barryvan.tp.performer.Oscillator = new Class({
	Implements: [Options],
	
	Extends: barryvan.tp.performer.Base,
	
	Binds: [
		'noteEvent',
		'frame',
		'tick',
		'_drawNote',
		'resize'
	],
	
	options: {
		colour: '#729fcf',
		vertical: 32,
		horizontal: 32,
		length: 48,
		middle: 60,
		thickness: 8,
		stepSize: 8,
		sustain: false,
		vitalisation: 0
	},
	
	_currentNote: null,
	_vitality: 0,
	
	initialize: function(context, canvas, options) {
		this.parent(context, canvas, options);
		
		this.resize(this._canvas.width, this._canvas.height);
	},
	
	noteEvent: function(data) {
		if (data.note < 0) {
			this._currentNote = null;
			this._vitality = this._vitality / 2;
			// Note cut / note off
			return;
		}
		
		if (!this.filterNote(data)) return;
		
		this._currentNote = data.note;
		
		this._vitality = this.options.vitalisation;
		
		// If we're sustained or vitalised, drawing is handled in frame(), not noteEvent().
		// if (this.options.sustain || this.options.vitalisation) return;
		
		this._drawNote();
	},
	
	tick: function() {
		// Decrement vitality in tick() rather than frame() to ensure it's fairly
		// consistent regardless of FPS
		if (this._vitality > 0) this._vitality -= 1;
	},
	
	frame: function() {
		if (this._vitality || this.options.sustain) {
			this._drawNote();
		}
	},
	
	_drawNote: function() {
		if (!this._currentNote) return;
		
		var n = this.options.middle - this._currentNote;
		var y = this._centre + (n * this.options.stepSize) - (this.options.thickness / 2);
		
		if (this.options.vitalisation) {
			var prev_alpha = this._context.globalAlpha;
			this._context.globalAlpha = this._vitality / this.options.vitalisation;
		}
		
		this._context.fillStyle = this.options.colour;
		this._context.fillRect(this._left, y, this.options.length, this.options.thickness);
		
		if (this.options.vitalisation) {
			this._context.globalAlpha = prev_alpha;
		}
	},
	
	resize: function(width, height) {
		this._left = (this.options.horizontal > 0 ? this.options.horizontal : (width + this.options.horizontal - this.options.length));
		this._top = Math.abs(this.options.vertical);
		this._bottom = height - this._top;
		
		this._centre = (this._bottom - this._top) / 2;
	}
});