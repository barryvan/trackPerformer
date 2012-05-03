barryvan.tp.performer.Fixed = new Class({
	Implements: [Options],
	
	Extends: barryvan.tp.performer.Base,
	
	Binds: [
		'updateOpts',
		'noteEvent',
		'frame',
		'tick',
		'_drawNote'
	],
	
	options: {
		colour: '#729fcf',
		x: 10,
		y: 10,
		width: 10,
		height: 10,
		sustain: false,
		vitalisation: 0,
		honourCuts: true
	},
	
	_vitality: 0,
	
	initialize: function(context, canvas, options) {
		this.parent(context, canvas, options);
	},
	
	updateOpts: function(options) {
		this.options = Object.merge(this.options, options);
	},
	
	noteEvent: function(data) {
		if ((data.note < 0) && this.options.honourCuts) {
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
		
		if (this.options.vitalisation) {
			var prev_alpha = this._context.globalAlpha;
			this._context.globalAlpha = this._vitality / this.options.vitalisation;
		}
		
		this._context.fillStyle = this.options.colour;
		this._context.fillRect(this.options.x, this.options.y, this.options.width, this.options.height);
		
		if (this.options.vitalisation) {
			this._context.globalAlpha = prev_alpha;
		}
	}
});